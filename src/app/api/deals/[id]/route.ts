import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateDealSchema, updateDealStatusSchema } from "@/lib/validations/deal";
import { calculateDealMetrics } from "@/lib/calculations/financing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        analyses: true,
        documents: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404 }
      );
    }

    if (deal.userId !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You don't have access to this deal" },
        { status: 403 }
      );
    }

    return NextResponse.json({ deal });

  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404 }
      );
    }

    if (existingDeal.userId !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You don't have access to this deal" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if it's a status-only update
    if (body.status && Object.keys(body).length === 1) {
      const statusResult = updateDealStatusSchema.safeParse(body);
      
      if (!statusResult.success) {
        return NextResponse.json(
          { error: "VALIDATION_ERROR", message: "Invalid status" },
          { status: 400 }
        );
      }

      const deal = await prisma.deal.update({
        where: { id },
        data: { status: statusResult.data.status },
      });

      return NextResponse.json({ deal });
    }

    // Full update validation
    const result = updateDealSchema.safeParse(body);
    
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

    // Merge with existing data for calculation
    const purchasePrice = data.purchasePrice ?? Number(existingDeal.purchasePrice);
    const estimatedCosts = data.estimatedCosts ?? Number(existingDeal.estimatedCosts);
    const monthlyExpenses = data.monthlyExpenses ?? Number(existingDeal.monthlyExpenses);
    const propertyDebts = data.propertyDebts ?? Number(existingDeal.propertyDebts || 0);
    const estimatedSalePrice = data.estimatedSalePrice ?? Number(existingDeal.estimatedSalePrice);
    const estimatedTimeMonths = data.estimatedTimeMonths ?? existingDeal.estimatedTimeMonths;
    const acquisitionType = data.acquisitionType ?? existingDeal.acquisitionType ?? "TRADITIONAL";
    const isFirstProperty = data.isFirstProperty ?? existingDeal.isFirstProperty ?? false;
    const useFinancing = data.useFinancing ?? existingDeal.useFinancing;
    const amortizationType = data.amortizationType ?? existingDeal.amortizationType ?? "SAC";
    const downPayment = data.downPayment ?? (existingDeal.downPayment ? Number(existingDeal.downPayment) : 0);
    const interestRate = data.interestRate ?? (existingDeal.interestRate ? Number(existingDeal.interestRate) : 0);
    const loanTermYears = data.loanTermYears ?? existingDeal.loanTermYears ?? 30;
    const closingCosts = data.closingCosts ?? (existingDeal.closingCosts ? Number(existingDeal.closingCosts) : 0);

    // Use centralized calculation utility
    const metrics = calculateDealMetrics({
      purchasePrice,
      estimatedCosts,
      monthlyExpenses,
      propertyDebts,
      estimatedSalePrice,
      estimatedTimeMonths,
      acquisitionType,
      useFinancing,
      amortizationType,
      downPayment,
      interestRate,
      loanTermYears,
      closingCosts,
      isFirstProperty,
      locale: "pt-BR",
    });

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        ...data,
        // Financing fields (only if using financing)
        loanAmount: useFinancing ? metrics.loanAmount : null,
        monthlyPayment: useFinancing ? metrics.monthlyPayment : null,
        // Calculated fields
        estimatedProfit: metrics.estimatedProfit,
        estimatedROI: metrics.estimatedROI,
      },
    });

    return NextResponse.json({ deal });

  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404 }
      );
    }

    if (existingDeal.userId !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You don't have access to this deal" },
        { status: 403 }
      );
    }

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deal deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
