"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Minus,
  RefreshCw,
  Sparkles,
  MapPin,
  HelpCircle,
  DollarSign,
  Info,
  ClipboardCheck,
  FileText,
  Gavel,
  User,
  Home,
  Calendar,
  CreditCard,
  ShieldAlert,
  Ban
} from "lucide-react";
import { formatCurrency } from "@/lib/i18n/currency";
import type { LocaleCode } from "@/contexts/locale-context";

interface Risk {
  level: "low" | "medium" | "high";
  title: string;
  description: string;
}

interface Insight {
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
}

interface MarketAnalysis {
  estimatedMarketValue: number;
  pricePerSqMeter: number;
  regionTrend: "rising" | "stable" | "falling";
  demandLevel: "high" | "medium" | "low";
  averageDaysOnMarket: number;
  typicalBuyerProfile?: string;
  nearbyInfrastructure?: string;
}

interface NeighborhoodProfile {
  description: string;
  strengths: string[];
  challenges: string[];
  recentDevelopments?: string;
}

interface Scenario {
  roi: number;
  profit: number;
  timeline: number;
  probability: number;
  assumptions?: string;
}

interface HiddenCost {
  item: string;
  estimatedRange: string;
}

interface PropertyRegistryExtraction {
  registryNumber?: string;
  taxpayerNumber?: string;
  lastOwnerName?: string;
  lastOwnerCpf?: string;
  propertyAddress?: string;
  propertyArea?: number;
  registrationDate?: string;
  encumbrances: string[];
  restrictions: string[];
  previousTransfers: string[];
  alerts: string[];
}

interface AuctionNoticeExtraction {
  auctioneerName?: string;
  auctionDates?: string[];
  minimumBid?: number;
  appraisalValue?: number;
  paymentMethods: string[];
  paymentDeadlines: string[];
  auctioneerFee?: string;
  propertyDebts?: string[];
  occupationStatus?: string;
  evictionResponsibility?: string;
  importantClauses: string[];
  penaltiesAndFines: string[];
  alerts: string[];
}

interface DocumentExtractions {
  propertyRegistry?: PropertyRegistryExtraction;
  auctionNotice?: AuctionNoticeExtraction;
}

interface Analysis {
  id: string;
  summary: string;
  score: number;
  risks: Risk[];
  insights: Insight[];
  marketAnalysis: MarketAnalysis | null;
  neighborhoodProfile?: NeighborhoodProfile;
  scenarios: {
    conservative: Scenario;
    moderate: Scenario;
    optimistic: Scenario;
  };
  checkpoints?: string[];
  questionsToAsk?: string[];
  hiddenCosts?: HiddenCost[];
  alerts?: string[];
  documentExtractions?: DocumentExtractions;
  createdAt?: string;
}

interface AIAnalysisSectionProps {
  dealId: string;
  dealStatus: string;
  locale: LocaleCode;
  t: (key: string) => string;
}

export function AIAnalysisSection({ dealId, dealStatus, locale, t }: AIAnalysisSectionProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing analysis on mount
  useEffect(() => {
    fetchAnalysis();
  }, [dealId]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/deals/${dealId}/analyze`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      } else if (response.status !== 404) {
        // 404 is expected when no analysis exists
        const data = await response.json();
        setError(data.message);
      }
    } catch {
      // Silently fail on fetch error - analysis might not exist yet
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    console.log("[AI Analysis] Starting analysis for deal:", dealId);
    
    try {
      const response = await fetch(`/api/deals/${dealId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      
      console.log("[AI Analysis] Response status:", response.status);
      
      const data = await response.json();
      console.log("[AI Analysis] Response data:", data);
      
      if (response.ok) {
        setAnalysis(data.analysis);
        // Don't reload - just update the state
      } else {
        setError(data.message || t("analysis.error"));
      }
    } catch (err) {
      console.error("[AI Analysis] Error:", err);
      setError(t("analysis.error"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fmt = (value: number) => formatCurrency(value, locale);

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100";
    if (score >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  // Risk level styling
  const getRiskStyle = (level: Risk["level"]) => {
    switch (level) {
      case "high": return { color: "text-red-600", bg: "bg-red-50", icon: AlertTriangle };
      case "medium": return { color: "text-yellow-600", bg: "bg-yellow-50", icon: AlertTriangle };
      case "low": return { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 };
    }
  };

  // Insight type styling
  const getInsightStyle = (type: Insight["type"]) => {
    switch (type) {
      case "positive": return { color: "text-green-600", icon: TrendingUp };
      case "negative": return { color: "text-red-600", icon: TrendingDown };
      case "neutral": return { color: "text-gray-600", icon: Minus };
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Show analyze button if no analysis exists
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" aria-hidden="true" />
            {t("analysis.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              {t("analysis.noAnalysis")}
            </p>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <Button 
              onClick={runAnalysis} 
              disabled={isAnalyzing}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("analysis.analyzing")}
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  {t("analysis.runAnalysis")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detect if this is a fallback analysis (AI didn't respond)
  const isFallbackAnalysis = analysis.summary?.includes("Análise automática não disponível") || 
                            analysis.summary?.includes("Automatic analysis not available") ||
                            analysis.summary?.includes("análise foi gerada sem IA") ||
                            analysis.summary?.includes("generated without AI");

  // Show analysis results
  return (
    <div className="space-y-6">
      {/* Fallback Warning Banner */}
      {isFallbackAnalysis && (
        <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">
                {locale === "pt-BR" 
                  ? "⚠️ Análise Básica (IA Indisponível)" 
                  : "⚠️ Basic Analysis (AI Unavailable)"}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {locale === "pt-BR" 
                  ? "A IA não está disponível no momento (limite de requisições atingido). Os dados abaixo são cálculos básicos, não uma análise inteligente. Tente novamente mais tarde clicando em \"Atualizar\"." 
                  : "AI is currently unavailable (rate limit reached). The data below are basic calculations, not an intelligent analysis. Try again later by clicking \"Refresh\"."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Card */}
      <Card className={isFallbackAnalysis ? "border-amber-300 bg-amber-50/30" : ""}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className={`h-5 w-5 ${isFallbackAnalysis ? "text-amber-600" : ""}`} aria-hidden="true" />
            {t("analysis.title")}
            {isFallbackAnalysis && (
              <Badge variant="outline" className="ml-2 border-amber-400 text-amber-700 bg-amber-100">
                {locale === "pt-BR" ? "Modo Básico" : "Basic Mode"}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant={isFallbackAnalysis ? "default" : "outline"}
            size="sm" 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={isFallbackAnalysis ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">
              {isFallbackAnalysis 
                ? (locale === "pt-BR" ? "Tentar IA Novamente" : "Retry AI Analysis")
                : t("analysis.refresh")
              }
            </span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score and Summary */}
          <div className="flex items-start gap-6">
            <div className={`flex-shrink-0 w-20 h-20 rounded-full ${isFallbackAnalysis ? "bg-amber-100" : getScoreBg(analysis.score)} flex items-center justify-center`}>
              <span className={`text-3xl font-bold ${isFallbackAnalysis ? "text-amber-600" : getScoreColor(analysis.score)}`}>
                {isFallbackAnalysis ? "?" : analysis.score}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{t("analysis.summary")}</h3>
              <p className={`${isFallbackAnalysis ? "text-amber-700" : "text-muted-foreground"}`}>
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Risks */}
          {analysis.risks && analysis.risks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">{t("analysis.risks")}</h3>
              <div className="space-y-2">
                {analysis.risks.map((risk, index) => {
                  const style = getRiskStyle(risk.level);
                  const Icon = style.icon;
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${style.bg} flex items-start gap-3`}
                    >
                      <Icon className={`h-5 w-5 ${style.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className={`font-medium ${style.color}`}>{risk.title}</p>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">{t("analysis.insights")}</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {analysis.insights.map((insight, index) => {
                  const style = getInsightStyle(insight.type);
                  const Icon = style.icon;
                  return (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg bg-muted/50 flex items-start gap-3"
                    >
                      <Icon className={`h-5 w-5 ${style.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="font-medium">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Analysis Card */}
      {analysis.marketAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>{t("analysis.marketAnalysis")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t("analysis.marketValue")}</p>
                <p className="text-xl font-bold">{fmt(analysis.marketAnalysis.estimatedMarketValue)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t("analysis.pricePerArea")}</p>
                <p className="text-xl font-bold">
                  {fmt(analysis.marketAnalysis.pricePerSqMeter)}
                  <span className="text-sm font-normal">/{locale === "pt-BR" ? "m²" : "sqft"}</span>
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t("analysis.regionTrend")}</p>
                <Badge variant={
                  analysis.marketAnalysis.regionTrend === "rising" ? "default" :
                  analysis.marketAnalysis.regionTrend === "falling" ? "destructive" : "secondary"
                }>
                  {t(`analysis.trend.${analysis.marketAnalysis.regionTrend}`)}
                </Badge>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t("analysis.daysOnMarket")}</p>
                <p className="text-xl font-bold">{analysis.marketAnalysis.averageDaysOnMarket} {t("detail.days")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenarios Card */}
      {analysis.scenarios && (
        <Card>
          <CardHeader>
            <CardTitle>{t("analysis.scenarios")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Conservative */}
              <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50/50">
                <h4 className="font-semibold text-yellow-700 mb-3">{t("analysis.conservative")}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-medium">{analysis.scenarios.conservative.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.profit")}</span>
                    <span className="font-medium">{fmt(analysis.scenarios.conservative.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.timeline")}</span>
                    <span className="font-medium">{analysis.scenarios.conservative.timeline} {t("detail.months")}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{t("analysis.probability")}: {analysis.scenarios.conservative.probability}%</span>
                  </div>
                </div>
              </div>

              {/* Moderate */}
              <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                <h4 className="font-semibold text-primary mb-3">{t("analysis.moderate")}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-medium">{analysis.scenarios.moderate.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.profit")}</span>
                    <span className="font-medium">{fmt(analysis.scenarios.moderate.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.timeline")}</span>
                    <span className="font-medium">{analysis.scenarios.moderate.timeline} {t("detail.months")}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{t("analysis.probability")}: {analysis.scenarios.moderate.probability}%</span>
                  </div>
                </div>
              </div>

              {/* Optimistic */}
              <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50/50">
                <h4 className="font-semibold text-green-700 mb-3">{t("analysis.optimistic")}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-medium">{analysis.scenarios.optimistic.roi.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.profit")}</span>
                    <span className="font-medium">{fmt(analysis.scenarios.optimistic.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("analysis.timeline")}</span>
                    <span className="font-medium">{analysis.scenarios.optimistic.timeline} {t("detail.months")}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">{t("analysis.probability")}: {analysis.scenarios.optimistic.probability}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Assumptions */}
            {(analysis.scenarios.conservative.assumptions || 
              analysis.scenarios.moderate.assumptions || 
              analysis.scenarios.optimistic.assumptions) && (
              <div className="mt-4 p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium text-sm mb-2">{t("analysis.assumptions")}</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {analysis.scenarios.conservative.assumptions && (
                    <p><strong className="text-yellow-700">{t("analysis.conservative")}:</strong> {analysis.scenarios.conservative.assumptions}</p>
                  )}
                  {analysis.scenarios.moderate.assumptions && (
                    <p><strong className="text-primary">{t("analysis.moderate")}:</strong> {analysis.scenarios.moderate.assumptions}</p>
                  )}
                  {analysis.scenarios.optimistic.assumptions && (
                    <p><strong className="text-green-700">{t("analysis.optimistic")}:</strong> {analysis.scenarios.optimistic.assumptions}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Neighborhood Profile Card */}
      {analysis.neighborhoodProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              {t("analysis.neighborhoodProfile")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{analysis.neighborhoodProfile.description}</p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Strengths */}
              {analysis.neighborhoodProfile.strengths && analysis.neighborhoodProfile.strengths.length > 0 && (
                <div className="p-4 rounded-lg bg-green-50/50 border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-2">{t("analysis.strengths")}</h4>
                  <ul className="space-y-1">
                    {analysis.neighborhoodProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {analysis.neighborhoodProfile.challenges && analysis.neighborhoodProfile.challenges.length > 0 && (
                <div className="p-4 rounded-lg bg-yellow-50/50 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700 mb-2">{t("analysis.challenges")}</h4>
                  <ul className="space-y-1">
                    {analysis.neighborhoodProfile.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recent Developments */}
            {analysis.neighborhoodProfile.recentDevelopments && (
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">{t("analysis.recentDevelopments")}</h4>
                <p className="text-sm">{analysis.neighborhoodProfile.recentDevelopments}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extended Market Info */}
      {analysis.marketAnalysis && (analysis.marketAnalysis.typicalBuyerProfile || analysis.marketAnalysis.nearbyInfrastructure) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("analysis.marketContext")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.marketAnalysis.typicalBuyerProfile && (
              <div>
                <h4 className="font-semibold text-sm mb-1">{t("analysis.buyerProfile")}</h4>
                <p className="text-muted-foreground text-sm">{analysis.marketAnalysis.typicalBuyerProfile}</p>
              </div>
            )}
            {analysis.marketAnalysis.nearbyInfrastructure && (
              <div>
                <h4 className="font-semibold text-sm mb-1">{t("analysis.infrastructure")}</h4>
                <p className="text-muted-foreground text-sm">{analysis.marketAnalysis.nearbyInfrastructure}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Checkpoints and Questions Card */}
      {((analysis.checkpoints && analysis.checkpoints.length > 0) || (analysis.questionsToAsk && analysis.questionsToAsk.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              {t("analysis.verification")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Checkpoints */}
            {analysis.checkpoints && analysis.checkpoints.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t("analysis.checkpoints")}
                </h4>
                <ul className="space-y-2">
                  {analysis.checkpoints.map((checkpoint, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm">{checkpoint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions to Ask */}
            {analysis.questionsToAsk && analysis.questionsToAsk.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  {t("analysis.questionsToAsk")}
                </h4>
                <ul className="space-y-2">
                  {analysis.questionsToAsk.map((question, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                      <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hidden Costs Card */}
      {analysis.hiddenCosts && analysis.hiddenCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" aria-hidden="true" />
              {t("analysis.hiddenCosts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.hiddenCosts.map((cost, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-orange-50/50 border border-orange-200">
                  <span className="text-sm font-medium">{cost.item}</span>
                  <span className="text-sm text-orange-700 font-semibold">{cost.estimatedRange}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Card */}
      {analysis.alerts && analysis.alerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Info className="h-5 w-5" aria-hidden="true" />
              {t("analysis.alerts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.alerts.map((alert, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-100/50">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-amber-900">{alert}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Document Extractions */}
      {analysis.documentExtractions && (
        <>
          {/* Property Registry Extraction */}
          {analysis.documentExtractions.propertyRegistry && (
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  {locale === "pt-BR" ? "📋 Dados Extraídos da Matrícula" : "📋 Property Registry Data"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Basic Info */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.documentExtractions.propertyRegistry.registryNumber && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        {locale === "pt-BR" ? "Nº da Matrícula" : "Registry Number"}
                      </p>
                      <p className="font-semibold">{analysis.documentExtractions.propertyRegistry.registryNumber}</p>
                    </div>
                  )}
                  {analysis.documentExtractions.propertyRegistry.taxpayerNumber && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        {locale === "pt-BR" ? "Nº do Contribuinte (IPTU)" : "Taxpayer Number"}
                      </p>
                      <p className="font-semibold">{analysis.documentExtractions.propertyRegistry.taxpayerNumber}</p>
                    </div>
                  )}
                  {analysis.documentExtractions.propertyRegistry.propertyArea && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        {locale === "pt-BR" ? "Área" : "Area"}
                      </p>
                      <p className="font-semibold">{analysis.documentExtractions.propertyRegistry.propertyArea} m²</p>
                    </div>
                  )}
                </div>

                {/* Last Owner Info */}
                {(analysis.documentExtractions.propertyRegistry.lastOwnerName || 
                  analysis.documentExtractions.propertyRegistry.lastOwnerCpf) && (
                  <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {locale === "pt-BR" ? "Último Proprietário (antes da retomada)" : "Last Owner (before foreclosure)"}
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {analysis.documentExtractions.propertyRegistry.lastOwnerName && (
                        <div>
                          <p className="text-xs text-muted-foreground">{locale === "pt-BR" ? "Nome" : "Name"}</p>
                          <p className="font-medium">{analysis.documentExtractions.propertyRegistry.lastOwnerName}</p>
                        </div>
                      )}
                      {analysis.documentExtractions.propertyRegistry.lastOwnerCpf && (
                        <div>
                          <p className="text-xs text-muted-foreground">CPF/CNPJ</p>
                          <p className="font-medium">{analysis.documentExtractions.propertyRegistry.lastOwnerCpf}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Property Address */}
                {analysis.documentExtractions.propertyRegistry.propertyAddress && (
                  <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-3">
                    <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {locale === "pt-BR" ? "Endereço Completo" : "Full Address"}
                      </p>
                      <p className="text-sm">{analysis.documentExtractions.propertyRegistry.propertyAddress}</p>
                    </div>
                  </div>
                )}

                {/* Encumbrances (Ônus) - CRITICAL */}
                {analysis.documentExtractions.propertyRegistry.encumbrances && 
                 analysis.documentExtractions.propertyRegistry.encumbrances.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-50 border-2 border-red-300">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      {locale === "pt-BR" ? "⚠️ Ônus e Gravames Encontrados" : "⚠️ Encumbrances Found"}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.documentExtractions.propertyRegistry.encumbrances.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-900">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Restrictions - CRITICAL */}
                {analysis.documentExtractions.propertyRegistry.restrictions && 
                 analysis.documentExtractions.propertyRegistry.restrictions.length > 0 && (
                  <div className="p-4 rounded-lg bg-orange-50 border-2 border-orange-300">
                    <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Ban className="h-5 w-5" />
                      {locale === "pt-BR" ? "🚫 Restrições Encontradas" : "🚫 Restrictions Found"}
                    </h4>
                    <p className="text-xs text-orange-700 mb-2">
                      {locale === "pt-BR" 
                        ? "Nua propriedade, usufruto, cláusulas restritivas podem IMPEDIR a transferência"
                        : "Bare ownership, usufruct, restrictive clauses may PREVENT transfer"}
                    </p>
                    <ul className="space-y-2">
                      {analysis.documentExtractions.propertyRegistry.restrictions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-orange-900">
                          <Ban className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Previous Transfers */}
                {analysis.documentExtractions.propertyRegistry.previousTransfers && 
                 analysis.documentExtractions.propertyRegistry.previousTransfers.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {locale === "pt-BR" ? "Histórico de Transferências" : "Transfer History"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.documentExtractions.propertyRegistry.previousTransfers.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Registry Alerts */}
                {analysis.documentExtractions.propertyRegistry.alerts && 
                 analysis.documentExtractions.propertyRegistry.alerts.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {locale === "pt-BR" ? "🚨 Alertas Críticos da Matrícula" : "🚨 Critical Registry Alerts"}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.documentExtractions.propertyRegistry.alerts.map((alert, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-900 font-medium">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Auction Notice Extraction */}
          {analysis.documentExtractions.auctionNotice && (
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50/50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Gavel className="h-5 w-5" aria-hidden="true" />
                  {locale === "pt-BR" ? "📜 Dados Extraídos do Edital" : "📜 Auction Notice Data"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Basic Auction Info */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.documentExtractions.auctionNotice.minimumBid && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-xs text-green-700 mb-1">
                        {locale === "pt-BR" ? "Lance Mínimo" : "Minimum Bid"}
                      </p>
                      <p className="font-bold text-green-800 text-lg">{fmt(analysis.documentExtractions.auctionNotice.minimumBid)}</p>
                    </div>
                  )}
                  {analysis.documentExtractions.auctionNotice.appraisalValue && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">
                        {locale === "pt-BR" ? "Valor de Avaliação" : "Appraisal Value"}
                      </p>
                      <p className="font-bold text-blue-800 text-lg">{fmt(analysis.documentExtractions.auctionNotice.appraisalValue)}</p>
                    </div>
                  )}
                  {analysis.documentExtractions.auctionNotice.auctioneerFee && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 mb-1">
                        {locale === "pt-BR" ? "Comissão do Leiloeiro" : "Auctioneer Fee"}
                      </p>
                      <p className="font-bold text-amber-800">{analysis.documentExtractions.auctionNotice.auctioneerFee}</p>
                    </div>
                  )}
                </div>

                {/* Auctioneer and Dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {analysis.documentExtractions.auctionNotice.auctioneerName && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">
                        {locale === "pt-BR" ? "Leiloeiro" : "Auctioneer"}
                      </p>
                      <p className="font-medium">{analysis.documentExtractions.auctionNotice.auctioneerName}</p>
                    </div>
                  )}
                  {analysis.documentExtractions.auctionNotice.auctionDates && 
                   analysis.documentExtractions.auctionNotice.auctionDates.length > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {locale === "pt-BR" ? "Datas do Leilão" : "Auction Dates"}
                      </p>
                      <div className="space-y-1">
                        {analysis.documentExtractions.auctionNotice.auctionDates.map((date, index) => (
                          <p key={index} className="font-medium text-sm">
                            {index === 0 ? "1ª Praça: " : "2ª Praça: "}{date}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Occupation Status - CRITICAL */}
                {analysis.documentExtractions.auctionNotice.occupationStatus && (
                  <div className={`p-4 rounded-lg border-2 ${
                    analysis.documentExtractions.auctionNotice.occupationStatus.toLowerCase().includes("ocupado") ||
                    analysis.documentExtractions.auctionNotice.occupationStatus.toLowerCase().includes("occupied")
                      ? "bg-red-50 border-red-300"
                      : "bg-green-50 border-green-300"
                  }`}>
                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                      analysis.documentExtractions.auctionNotice.occupationStatus.toLowerCase().includes("ocupado") ||
                      analysis.documentExtractions.auctionNotice.occupationStatus.toLowerCase().includes("occupied")
                        ? "text-red-800"
                        : "text-green-800"
                    }`}>
                      <Home className="h-4 w-4" />
                      {locale === "pt-BR" ? "Situação de Ocupação" : "Occupation Status"}
                    </h4>
                    <p className="font-bold">{analysis.documentExtractions.auctionNotice.occupationStatus}</p>
                    {analysis.documentExtractions.auctionNotice.evictionResponsibility && (
                      <p className="text-sm mt-2">
                        <strong>{locale === "pt-BR" ? "Responsável pela desocupação:" : "Eviction responsibility:"}</strong>{" "}
                        {analysis.documentExtractions.auctionNotice.evictionResponsibility}
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Methods */}
                {analysis.documentExtractions.auctionNotice.paymentMethods && 
                 analysis.documentExtractions.auctionNotice.paymentMethods.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {locale === "pt-BR" ? "Formas de Pagamento" : "Payment Methods"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.documentExtractions.auctionNotice.paymentMethods.map((method, index) => (
                        <Badge key={index} variant="secondary">{method}</Badge>
                      ))}
                    </div>
                    {analysis.documentExtractions.auctionNotice.paymentDeadlines && 
                     analysis.documentExtractions.auctionNotice.paymentDeadlines.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {locale === "pt-BR" ? "Prazos:" : "Deadlines:"}
                        </p>
                        <ul className="space-y-1">
                          {analysis.documentExtractions.auctionNotice.paymentDeadlines.map((deadline, index) => (
                            <li key={index} className="text-sm">• {deadline}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Property Debts */}
                {analysis.documentExtractions.auctionNotice.propertyDebts && 
                 analysis.documentExtractions.auctionNotice.propertyDebts.length > 0 && (
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {locale === "pt-BR" ? "Dívidas Mencionadas" : "Property Debts Mentioned"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.documentExtractions.auctionNotice.propertyDebts.map((debt, index) => (
                        <li key={index} className="text-sm text-orange-900">• {debt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Important Clauses */}
                {analysis.documentExtractions.auctionNotice.importantClauses && 
                 analysis.documentExtractions.auctionNotice.importantClauses.length > 0 && (
                  <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {locale === "pt-BR" ? "📌 Cláusulas Importantes" : "📌 Important Clauses"}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.documentExtractions.auctionNotice.importantClauses.map((clause, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{clause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Penalties and Fines */}
                {analysis.documentExtractions.auctionNotice.penaltiesAndFines && 
                 analysis.documentExtractions.auctionNotice.penaltiesAndFines.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-50/50 border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {locale === "pt-BR" ? "⚖️ Multas e Penalidades" : "⚖️ Penalties and Fines"}
                    </h4>
                    <ul className="space-y-1">
                      {analysis.documentExtractions.auctionNotice.penaltiesAndFines.map((penalty, index) => (
                        <li key={index} className="text-sm text-red-900">• {penalty}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Auction Alerts */}
                {analysis.documentExtractions.auctionNotice.alerts && 
                 analysis.documentExtractions.auctionNotice.alerts.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300">
                    <h4 className="font-semibold text-red-800 mb-2">
                      {locale === "pt-BR" ? "🚨 Alertas do Edital" : "🚨 Auction Notice Alerts"}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.documentExtractions.auctionNotice.alerts.map((alert, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-900 font-medium">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-muted/30 border border-muted text-center">
        <p className="text-xs text-muted-foreground">
          {t("analysis.disclaimer")}
        </p>
      </div>
    </div>
  );
}

