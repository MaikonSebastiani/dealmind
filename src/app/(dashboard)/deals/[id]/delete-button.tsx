"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";
import { useToast } from "@/components/ui/toast";

interface DeleteDealButtonProps {
  dealId: string;
  dealName: string;
}

export function DeleteDealButton({ dealId, dealName }: DeleteDealButtonProps) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addToast(
          locale === "pt-BR" 
            ? `"${dealName}" excluído com sucesso!`
            : `"${dealName}" deleted successfully!`,
          "success"
        );
        router.push("/deals");
        router.refresh();
      } else {
        addToast(
          locale === "pt-BR"
            ? "Erro ao excluir negócio"
            : "Failed to delete deal",
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to delete deal:", error);
      addToast(
        locale === "pt-BR"
          ? "Erro ao excluir negócio"
          : "Failed to delete deal",
        "error"
      );
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {locale === "pt-BR" ? "Excluir?" : "Delete?"}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-busy={isDeleting}
        >
          {isDeleting 
            ? (locale === "pt-BR" ? "Excluindo..." : "Deleting...") 
            : t("common.yes")
          }
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          {t("common.no")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setShowConfirm(true)}
      aria-label={`${t("common.delete")} ${dealName}`}
    >
      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
      {t("common.delete")}
    </Button>
  );
}
