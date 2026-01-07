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
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
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
    propertyDebts: deal.propertyDebts !== null ? Number(deal.propertyDebts) : null,
    estimatedSalePrice: Number(deal.estimatedSalePrice),
    estimatedProfit: deal.estimatedProfit ? Number(deal.estimatedProfit) : null,
    estimatedROI: deal.estimatedROI ? Number(deal.estimatedROI) : null,
    downPayment: deal.downPayment ? Number(deal.downPayment) : null,
    loanAmount: deal.loanAmount ? Number(deal.loanAmount) : null,
    interestRate: deal.interestRate ? Number(deal.interestRate) : null,
    monthlyPayment: deal.monthlyPayment ? Number(deal.monthlyPayment) : null,
    closingCosts: deal.closingCosts ? Number(deal.closingCosts) : null,
    // Documents
    documents: deal.documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      size: doc.size,
      mimeType: doc.mimeType,
      createdAt: doc.createdAt,
    })),
  };

  return <DealDetailClient deal={serializedDeal} />;
}
