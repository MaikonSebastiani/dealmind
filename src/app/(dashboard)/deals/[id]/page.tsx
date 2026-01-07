import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DealDetailClient } from "./detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DealPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id },
  });

  if (!deal) {
    notFound();
  }

  if (deal.userId !== session.user.id) {
    notFound();
  }

  // Serialize Decimal fields
  const serializedDeal = {
    ...deal,
    // Property characteristics (Decimal fields)
    area: deal.area ? Number(deal.area) : null,
    lotSize: deal.lotSize ? Number(deal.lotSize) : null,
    // Financial fields
    purchasePrice: Number(deal.purchasePrice),
    estimatedCosts: Number(deal.estimatedCosts),
    monthlyExpenses: Number(deal.monthlyExpenses),
    estimatedSalePrice: Number(deal.estimatedSalePrice),
    estimatedProfit: deal.estimatedProfit ? Number(deal.estimatedProfit) : null,
    estimatedROI: deal.estimatedROI ? Number(deal.estimatedROI) : null,
    downPayment: deal.downPayment ? Number(deal.downPayment) : null,
    loanAmount: deal.loanAmount ? Number(deal.loanAmount) : null,
    interestRate: deal.interestRate ? Number(deal.interestRate) : null,
    monthlyPayment: deal.monthlyPayment ? Number(deal.monthlyPayment) : null,
    closingCosts: deal.closingCosts ? Number(deal.closingCosts) : null,
  };

  return <DealDetailClient deal={serializedDeal} />;
}
