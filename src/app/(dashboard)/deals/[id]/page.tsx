import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, MapPin, Calendar, Building } from "lucide-react";
import { DeleteDealButton } from "./delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

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
  MIXED: "Mixed Use",
};

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${value.toFixed(1)}%`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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

  const statusConfig = STATUS_CONFIG[deal.status];
  const totalInvestment = Number(deal.purchasePrice) + Number(deal.estimatedCosts);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/deals" aria-label="Back to deals">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{deal.name}</h1>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            {deal.address && (
              <p className="mt-1 text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {deal.address}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/deals/${deal.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </Button>
          <DeleteDealButton dealId={deal.id} dealName={deal.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalInvestment)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Sale Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(Number(deal.estimatedSalePrice))}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${Number(deal.estimatedProfit) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(Number(deal.estimatedProfit))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${Number(deal.estimatedROI) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatPercent(Number(deal.estimatedROI))}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Purchase Price</span>
              <span className="font-medium">{formatCurrency(Number(deal.purchasePrice))}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Estimated Costs</span>
              <span className="font-medium">{formatCurrency(Number(deal.estimatedCosts))}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Investment</span>
              <span className="font-bold">{formatCurrency(totalInvestment)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Estimated Sale Price</span>
              <span className="font-medium">{formatCurrency(Number(deal.estimatedSalePrice))}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Estimated Profit</span>
              <span className={`font-bold ${Number(deal.estimatedProfit) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(Number(deal.estimatedProfit))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 py-2 border-b">
              <Building className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-medium">{PROPERTY_TYPE_LABELS[deal.propertyType]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-medium">{deal.estimatedTimeMonths} months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(deal.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(deal.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {deal.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

