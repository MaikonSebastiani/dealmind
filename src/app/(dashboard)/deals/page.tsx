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
import { formatCurrency as formatCurrencyBase } from "@/lib/i18n/currency";

const STATUS_CONFIG = {
  ANALYZING: { label: "Analyzing", variant: "secondary" as const },
  APPROVED: { label: "Approved", variant: "default" as const },
  REJECTED: { label: "Rejected", variant: "destructive" as const },
  PURCHASED: { label: "Purchased", variant: "default" as const },
  RENOVATING: { label: "Renovating", variant: "secondary" as const },
  FOR_SALE: { label: "For Sale", variant: "default" as const },
  SOLD: { label: "Sold", variant: "default" as const },
};

const PROPERTY_TYPE_LABELS = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  LAND: "Land",
  INDUSTRIAL: "Industrial",
  MIXED: "Mixed",
};

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return formatCurrencyBase(value);
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${value.toFixed(1)}%`;
}

export default async function DealsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">
            Manage your real estate investment deals
          </p>
        </div>
        <Button asChild>
          <Link href="/deals/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Deal
          </Link>
        </Button>
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Plus className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No deals yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Get started by creating your first deal to analyze potential real estate investments.
          </p>
          <Button asChild className="mt-4">
            <Link href="/deals/new">Create your first deal</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Est. ROI</TableHead>
                <TableHead className="text-right">Est. Profit</TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const statusConfig = STATUS_CONFIG[deal.status];
                return (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/deals/${deal.id}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                      >
                        {deal.name}
                      </Link>
                      {deal.address && (
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {deal.address}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {PROPERTY_TYPE_LABELS[deal.propertyType]}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(deal.purchasePrice))}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={Number(deal.estimatedROI) >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatPercent(Number(deal.estimatedROI))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={Number(deal.estimatedProfit) >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(Number(deal.estimatedProfit))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link 
                            href={`/deals/${deal.id}`}
                            aria-label={`View ${deal.name}`}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link 
                            href={`/deals/${deal.id}/edit`}
                            aria-label={`Edit ${deal.name}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
