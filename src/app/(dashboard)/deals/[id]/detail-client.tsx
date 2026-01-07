"use client";

import { DealDetail, type Deal } from "@/components/deals/detail";

interface DealDetailClientProps {
  deal: Deal;
}

export function DealDetailClient({ deal }: DealDetailClientProps) {
  return <DealDetail deal={deal} />;
}
