"use client";

import { DealForm } from "@/components/deals/form";

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDealPage({ params }: EditDealPageProps) {
  return <DealForm mode="edit" dealId={params} />;
}
