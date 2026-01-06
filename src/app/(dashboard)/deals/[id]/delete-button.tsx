"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteDealButtonProps {
  dealId: string;
  dealName: string;
}

export function DeleteDealButton({ dealId, dealName }: DeleteDealButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/deals");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete deal:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delete?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-busy={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setShowConfirm(true)}
      aria-label={`Delete ${dealName}`}
    >
      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
      Delete
    </Button>
  );
}

