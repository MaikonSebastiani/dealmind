import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDealSchema } from "@/lib/validations/deal";
import { calculateDealMetrics } from "@/lib/calculations/financing";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
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
    const metrics = calculateDealMetrics({
      purchasePrice: data.purchasePrice,
      estimatedCosts: data.estimatedCosts || 0,
      monthlyExpenses: data.monthlyExpenses || 0,
      estimatedSalePrice: data.estimatedSalePrice,
      estimatedTimeMonths: data.estimatedTimeMonths || 12,
      useFinancing: data.useFinancing,
      downPayment: data.downPayment,
      interestRate: data.interestRate,
      loanTermYears: data.loanTermYears,
      closingCosts: data.closingCosts,
    });

    const deal = await prisma.deal.create({
      data: {
        userId: session.user.id,
        name: data.name,
        address: data.address,
        zipCode: data.zipCode,
        propertyType: data.propertyType,
        purchasePrice: data.purchasePrice,
        estimatedCosts: data.estimatedCosts || 0,
        monthlyExpenses: data.monthlyExpenses || 0,
        estimatedSalePrice: data.estimatedSalePrice,
        estimatedTimeMonths: data.estimatedTimeMonths || 12,
        // Financing fields
        useFinancing: data.useFinancing ?? false,
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

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const deals = await prisma.deal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json({ deals });

  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}
