import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DealsPageClient } from "./deals-client";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
    sort?: string;
  }>;
}

export default async function DealsPage({ searchParams }: PageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  const { search, status, type: propertyType, sort = "createdAt-desc" } = params;

  // Parse sort parameter
  const [sortField, sortOrder] = sort.split("-") as [string, "asc" | "desc"];
  
  // Valid sort fields
  const validSortFields = ["createdAt", "purchasePrice", "estimatedROI", "name"];
  const orderByField = validSortFields.includes(sortField) ? sortField : "createdAt";

  // Build where clause
  const where: Prisma.DealWhereInput = {
    userId: session.user.id,
  };

  // Add status filter
  if (status && status !== "all") {
    where.status = status as Prisma.DealWhereInput["status"];
  }

  // Add property type filter
  if (propertyType && propertyType !== "all") {
    where.propertyType = propertyType as Prisma.DealWhereInput["propertyType"];
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

  // Serialize Decimal fields
  const serializedDeals = deals.map(deal => ({
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
  }));

  return <DealsPageClient deals={serializedDeals} />;
}
