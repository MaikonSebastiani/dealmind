"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { 
  FileText, 
  Trash2, 
  FileUp, 
  Loader2,
  File,
  Image as ImageIcon,
  AlertCircle,
  Upload,
  CheckCircle2,
  ExternalLink,
  Database
} from "lucide-react";
import type { UploadedFile } from "../types";
import type { LocaleCode } from "@/contexts/locale-context";

// Document saved in database
export interface SavedDocument {
  id: string;
  name: string;
  url: string;
  type: UploadedFile["type"];
  size: number;
  fileKey: string;
}

interface DocumentsSectionProps {
  documents: UploadedFile[];
  onDocumentsChange: (documents: UploadedFile[]) => void;
  existingDocuments?: SavedDocument[];
  onDeleteExistingDocument?: (documentId: string) => Promise<void>;
  isAuction?: boolean;
  locale: LocaleCode;
  t: (key: string) => string;
}

export function DocumentsSection({ 
  documents, 
  onDocumentsChange,
  existingDocuments = [],
  onDeleteExistingDocument,
  isAuction = false,
  locale,
  t,
}: DocumentsSectionProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeletingExisting, setIsDeletingExisting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading: uploadingState } = useUploadThing("documentUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const newDocs: UploadedFile[] = res.map((file) => ({
          name: file.name,
          url: file.ufsUrl,
          key: file.key,
          size: file.size,
          type: detectDocumentType(file.name),
        }));
        onDocumentsChange([...documents, ...newDocs]);
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error) => {
      console.error("[Upload Error]", error);
      alert(`${t("documents.uploadError")}: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      startUpload(acceptedFiles);
    }
  }, [startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 16 * 1024 * 1024, // 16MB
    disabled: isUploading,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-red-500" />;
  };

  const getDocumentTypeLabel = (type: UploadedFile["type"]) => {
    const labels: Record<UploadedFile["type"], { en: string; pt: string }> = {
      PROPERTY_REGISTRY: { en: "Property Registry", pt: "Matrícula" },
      AUCTION_NOTICE: { en: "Auction Notice", pt: "Edital" },
      CONTRACT: { en: "Contract", pt: "Contrato" },
      INSPECTION: { en: "Inspection Report", pt: "Laudo de Vistoria" },
      OTHER: { en: "Other", pt: "Outro" },
    };
    return labels[type][locale === "pt-BR" ? "pt" : "en"];
  };

  const getDocumentTypeBadgeColor = (type: UploadedFile["type"]) => {
    const colors: Record<UploadedFile["type"], string> = {
      PROPERTY_REGISTRY: "bg-blue-100 text-blue-800",
      AUCTION_NOTICE: "bg-purple-100 text-purple-800",
      CONTRACT: "bg-green-100 text-green-800",
      INSPECTION: "bg-yellow-100 text-yellow-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type];
  };

  const handleRemoveDocument = async (key: string) => {
    setIsDeleting(key);
    
    try {
      const updated = documents.filter(doc => doc.key !== key);
      onDocumentsChange(updated);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteExistingDocument = async (documentId: string) => {
    if (!onDeleteExistingDocument) return;
    
    setIsDeletingExisting(documentId);
    try {
      await onDeleteExistingDocument(documentId);
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert(locale === "pt-BR" ? "Erro ao excluir documento" : "Error deleting document");
    } finally {
      setIsDeletingExisting(null);
    }
  };

  const detectDocumentType = (fileName: string): UploadedFile["type"] => {
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes("matricula") || lowerName.includes("registry") || lowerName.includes("certid")) {
      return "PROPERTY_REGISTRY";
    }
    if (lowerName.includes("edital") || lowerName.includes("auction") || lowerName.includes("leilao") || lowerName.includes("leilão")) {
      return "AUCTION_NOTICE";
    }
    if (lowerName.includes("contrato") || lowerName.includes("contract")) {
      return "CONTRACT";
    }
    if (lowerName.includes("vistoria") || lowerName.includes("inspection") || lowerName.includes("laudo")) {
      return "INSPECTION";
    }
    
    return "OTHER";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" aria-hidden="true" />
          {t("deal.section.documents")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info about required documents */}
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <p className="font-medium mb-1">{t("documents.recommended")}</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>{t("documents.registry")}</li>
            {isAuction && <li>{t("documents.auctionNotice")}</li>}
          </ul>
        </div>

        {/* Existing Documents from Database */}
        {existingDocuments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium">
                {locale === "pt-BR" ? "Documentos Salvos" : "Saved Documents"} ({existingDocuments.length})
              </p>
            </div>
            <div className="space-y-2">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50/50 border-blue-200 transition-colors"
                >
                  {getFileIcon(doc.name.endsWith(".pdf") ? "application/pdf" : "image/*")}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                  </div>
                  
                  <Badge className={getDocumentTypeBadgeColor(doc.type)}>
                    {getDocumentTypeLabel(doc.type)}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" title={locale === "pt-BR" ? "Abrir documento" : "Open document"}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    
                    {onDeleteExistingDocument && (
                      confirmDeleteId === doc.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteExistingDocument(doc.id)}
                            disabled={isDeletingExisting === doc.id}
                            className="text-xs h-7 px-2"
                          >
                            {isDeletingExisting === doc.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              locale === "pt-BR" ? "Confirmar" : "Confirm"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs h-7 px-2"
                          >
                            {locale === "pt-BR" ? "Não" : "No"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDeleteId(doc.id)}
                          className="text-destructive hover:text-destructive"
                          title={locale === "pt-BR" ? "Excluir documento" : "Delete document"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Upload Dropzone */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
            }
            ${isUploading ? "pointer-events-none" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            // Loading State
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {locale === "pt-BR" ? "Enviando arquivos..." : "Uploading files..."}
                </p>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : isDragActive ? (
            // Drag Active State
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-12 w-12 text-primary animate-bounce" />
              <p className="text-sm font-medium text-primary">
                {locale === "pt-BR" ? "Solte os arquivos aqui!" : "Drop files here!"}
              </p>
            </div>
          ) : (
            // Default State
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {t("documents.dropzone")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("documents.allowedTypes")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium">{t("documents.uploaded")} ({documents.length})</p>
            </div>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.key}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  {getFileIcon(doc.name.endsWith(".pdf") ? "application/pdf" : "image/*")}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                  </div>
                  
                  <Badge className={getDocumentTypeBadgeColor(doc.type)}>
                    {getDocumentTypeLabel(doc.type)}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <File className="h-4 w-4" />
                      </a>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.key)}
                      disabled={isDeleting === doc.key}
                      className="text-destructive hover:text-destructive"
                    >
                      {isDeleting === doc.key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning if auction but no notice */}
        {isAuction && !documents.some(d => d.type === "AUCTION_NOTICE") && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">{t("documents.missingAuctionNotice")}</p>
              <p className="text-amber-700">{t("documents.auctionNoticeHint")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
