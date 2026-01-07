"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  File, 
  Image as ImageIcon,
  ExternalLink,
  Download,
  FileWarning
} from "lucide-react";
import type { LocaleCode } from "@/contexts/locale-context";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

interface DocumentsSectionProps {
  documents: Document[];
  locale: LocaleCode;
  t: (key: string) => string;
}

export function DocumentsSection({ documents, locale, t }: DocumentsSectionProps) {
  // Don't render if no documents
  if (!documents || documents.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />;
    }
    if (mimeType?.includes("image")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    }
    return <File className="h-5 w-5 text-gray-500" aria-hidden="true" />;
  };

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, { ptBR: string; enUS: string }> = {
      PROPERTY_REGISTRY: { ptBR: "Matrícula", enUS: "Registry" },
      AUCTION_NOTICE: { ptBR: "Edital", enUS: "Notice" },
      CONTRACT: { ptBR: "Contrato", enUS: "Contract" },
      INSPECTION: { ptBR: "Vistoria", enUS: "Inspection" },
      OTHER: { ptBR: "Outro", enUS: "Other" },
    };
    return labels[type]?.[locale === "pt-BR" ? "ptBR" : "enUS"] || type;
  };

  const getDocumentTypeBadgeColor = (type: string): string => {
    const colors: Record<string, string> = {
      PROPERTY_REGISTRY: "bg-blue-100 text-blue-800",
      AUCTION_NOTICE: "bg-purple-100 text-purple-800",
      CONTRACT: "bg-green-100 text-green-800",
      INSPECTION: "bg-yellow-100 text-yellow-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" aria-hidden="true" />
          {locale === "pt-BR" ? "Documentos Anexados" : "Attached Documents"}
          <Badge variant="secondary" className="ml-2">
            {documents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              {/* File Icon */}
              <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                {getFileIcon(doc.mimeType)}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" title={doc.name}>
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.createdAt)}</span>
                </div>
              </div>
              
              {/* Document Type Badge */}
              <Badge className={getDocumentTypeBadgeColor(doc.type)}>
                {getDocumentTypeLabel(doc.type)}
              </Badge>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1"
                >
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={locale === "pt-BR" ? "Abrir documento" : "Open document"}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {locale === "pt-BR" ? "Abrir" : "Open"}
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

