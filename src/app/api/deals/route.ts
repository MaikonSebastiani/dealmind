import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDealSchema } from "@/lib/validations/deal";
import { calculateDealMetrics } from "@/lib/calculations/financing";
import { 
  checkRateLimit, 
  getRateLimitHeaders,
  RATE_LIMIT_CONFIG 
} from "@/lib/rate-limit";
import type { Prisma, DealStatus, PropertyType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    // Rate limiting for mutations (per user)
    const rateLimit = checkRateLimit(`deals:create:${session.user.id}`, RATE_LIMIT_CONFIG.mutation);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many requests. Please slow down." },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }

    const body = await request.json();

    const result = createDealSchema.safeParse(body);
    
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { 
          error: "VALIDATION_ERROR", 
          message: firstError.message,
          field: firstError.path[0],
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Use centralized calculation utility
    // Note: locale and isFirstProperty affect profit calculation only in frontend preview
    // Backend stores gross profit for now (before taxes)
    const metrics = calculateDealMetrics({
      purchasePrice: data.purchasePrice,
      estimatedCosts: data.estimatedCosts || 0,
      monthlyExpenses: data.monthlyExpenses || 0,
      propertyDebts: data.propertyDebts || 0,
      estimatedSalePrice: data.estimatedSalePrice,
      estimatedTimeMonths: data.estimatedTimeMonths || 12,
      useFinancing: data.useFinancing,
      amortizationType: data.amortizationType,
      downPayment: data.downPayment,
      interestRate: data.interestRate,
      loanTermYears: data.loanTermYears,
      closingCosts: data.closingCosts,
      isFirstProperty: data.isFirstProperty ?? false,
      locale: "pt-BR", // Default to Brazil for tax calculation
    });

    // Create deal with documents in a transaction
    const deal = await prisma.$transaction(async (tx) => {
      // Create the deal
      const createdDeal = await tx.deal.create({
        data: {
          userId: session.user.id,
          name: data.name,
          address: data.address,
          zipCode: data.zipCode,
          propertyType: data.propertyType,
          // Property characteristics
          area: data.area,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          parkingSpaces: data.parkingSpaces,
          lotSize: data.lotSize,
          yearBuilt: data.yearBuilt,
          condition: data.condition,
          // Acquisition data
          acquisitionType: data.acquisitionType || "TRADITIONAL",
          registryNumber: data.registryNumber,
          // Financial
          purchasePrice: data.purchasePrice,
          estimatedCosts: data.estimatedCosts || 0,
          monthlyExpenses: data.monthlyExpenses || 0,
          propertyDebts: data.propertyDebts || 0,
          estimatedSalePrice: data.estimatedSalePrice,
          estimatedTimeMonths: data.estimatedTimeMonths || 12,
          isFirstProperty: data.isFirstProperty ?? true,
          // Financing fields
          useFinancing: data.useFinancing ?? false,
          amortizationType: data.amortizationType || "SAC",
          downPayment: data.useFinancing ? data.downPayment : null,
          loanAmount: data.useFinancing ? metrics.loanAmount : null,
          interestRate: data.useFinancing ? data.interestRate : null,
          loanTermYears: data.useFinancing ? data.loanTermYears : null,
          monthlyPayment: data.useFinancing ? metrics.monthlyPayment : null,
          closingCosts: data.useFinancing ? data.closingCosts : null,
          // Calculated fields
          notes: data.notes,
          estimatedProfit: metrics.estimatedProfit,
          estimatedROI: metrics.estimatedROI,
          status: "ANALYZING",
        },
      });

      // Create documents if any
      if (body.documents && Array.isArray(body.documents) && body.documents.length > 0) {
        await tx.document.createMany({
          data: body.documents.map((doc: { name: string; url: string; fileKey: string; size: number; type: string }) => ({
            dealId: createdDeal.id,
            name: doc.name,
            url: doc.url,
            fileKey: doc.fileKey,
            size: doc.size,
            mimeType: doc.name.endsWith(".pdf") ? "application/pdf" : "image/*",
            type: doc.type,
          })),
        });
      }

      return createdDeal;
    });

    return NextResponse.json(
      { 
        message: "Deal created successfully",
        deal,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to create deal" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const propertyType = searchParams.get("type");
    const sort = searchParams.get("sort") || "createdAt-desc";

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split("-") as [string, "asc" | "desc"];
    
    // Valid sort fields
    const validSortFields = ["createdAt", "purchasePrice", "estimatedROI", "name"];
    const orderByField = validSortFields.includes(sortField) ? sortField : "createdAt";

    // Build where clause with Prisma type
    const where: Prisma.DealWhereInput = {
      userId: session.user.id,
    };

    // Add status filter
    if (status && status !== "all") {
      where.status = status as DealStatus;
    }

    // Add property type filter
    if (propertyType && propertyType !== "all") {
      where.propertyType = propertyType as PropertyType;
    }

    // Add search filter (name or address)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const deals = await prisma.deal.findMany({
      where,
      orderBy: {
        [orderByField]: sortOrder || "desc",
      },
    });

    return NextResponse.json({ 
      deals,
      count: deals.length,
    });

  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}
