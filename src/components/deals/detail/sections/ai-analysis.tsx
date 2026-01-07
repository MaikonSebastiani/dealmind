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
  ClipboardCheck
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

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-muted/30 border border-muted text-center">
        <p className="text-xs text-muted-foreground">
          {t("analysis.disclaimer")}
        </p>
      </div>
    </div>
  );
}

