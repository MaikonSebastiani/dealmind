import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil } from "lucide-react";
import { DealsPageClient } from "./deals-client";

export default async function DealsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Decimal fields
  const serializedDeals = deals.map(deal => ({
    ...deal,
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
  }));

  return <DealsPageClient deals={serializedDeals} />;
}
