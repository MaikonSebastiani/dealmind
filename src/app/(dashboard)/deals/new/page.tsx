"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDealSchema, type CreateDealInput } from "@/lib/validations/deal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "MIXED", label: "Mixed Use" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NewDealPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateDealInput>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      name: "",
      address: "",
      zipCode: "",
      propertyType: "RESIDENTIAL",
      purchasePrice: 0,
      estimatedCosts: 0,
      estimatedSalePrice: 0,
      estimatedTimeMonths: 12,
      notes: "",
    },
  });

  const purchasePrice = watch("purchasePrice") || 0;
  const estimatedCosts = watch("estimatedCosts") || 0;
  const estimatedSalePrice = watch("estimatedSalePrice") || 0;

  const totalInvestment = purchasePrice + estimatedCosts;
  const estimatedProfit = estimatedSalePrice - totalInvestment;
  const estimatedROI = totalInvestment > 0 ? (estimatedProfit / totalInvestment) * 100 : 0;

  const onSubmit = async (data: CreateDealInput) => {
    setGeneralError(null);

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setGeneralError(result.message || "Failed to create deal");
        return;
      }

      router.push("/deals");
      router.refresh();
    } catch {
      setGeneralError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/deals" aria-label="Back to deals">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Deal</h1>
          <p className="text-muted-foreground">
            Create a new real estate investment deal
          </p>
        </div>
      </div>

      {generalError && (
        <div 
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {generalError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6 lg:col-span-2"
          noValidate
        >
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="name"
                label="Deal Name"
                placeholder="e.g., Downtown Apartment Complex"
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Input
                    id="address"
                    label="Address"
                    placeholder="e.g., 123 Main St, City, State"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>
                <Input
                  id="zipCode"
                  label="ZIP Code"
                  placeholder="e.g., 12345-678"
                  error={errors.zipCode?.message}
                  {...register("zipCode")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  defaultValue="RESIDENTIAL"
                  onValueChange={(value) => setValue("propertyType", value as CreateDealInput["propertyType"])}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-sm text-destructive">{errors.propertyType.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <input
                    id="purchasePrice"
                    type="number"
                    min="0"
                    step="1000"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="250000"
                    {...register("purchasePrice", { valueAsNumber: true })}
                  />
                  {errors.purchasePrice && (
                    <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="estimatedCosts">Estimated Costs ($)</Label>
                  <input
                    id="estimatedCosts"
                    type="number"
                    min="0"
                    step="1000"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="50000"
                    {...register("estimatedCosts", { valueAsNumber: true })}
                  />
                  {errors.estimatedCosts && (
                    <p className="text-sm text-destructive">{errors.estimatedCosts.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="estimatedSalePrice">Estimated Sale Price ($)</Label>
                  <input
                    id="estimatedSalePrice"
                    type="number"
                    min="0"
                    step="1000"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="350000"
                    {...register("estimatedSalePrice", { valueAsNumber: true })}
                  />
                  {errors.estimatedSalePrice && (
                    <p className="text-sm text-destructive">{errors.estimatedSalePrice.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="estimatedTimeMonths">Timeline (months)</Label>
                  <input
                    id="estimatedTimeMonths"
                    type="number"
                    min="1"
                    max="120"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="12"
                    {...register("estimatedTimeMonths", { valueAsNumber: true })}
                  />
                  {errors.estimatedTimeMonths && (
                    <p className="text-sm text-destructive">{errors.estimatedTimeMonths.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about this deal..."
                  className="min-h-[100px]"
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/deals")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Investment Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span>{formatCurrency(purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">+ Estimated Costs</span>
                  <span>{formatCurrency(estimatedCosts)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Investment</span>
                  <span>{formatCurrency(totalInvestment)}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sale Price</span>
                  <span>{formatCurrency(estimatedSalePrice)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated Profit</span>
                  <span className={estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(estimatedProfit)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Estimated ROI</span>
                  <span 
                    className={`text-2xl font-bold ${estimatedROI >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {estimatedROI.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

