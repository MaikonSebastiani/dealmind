import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeDeal, isGeminiConfigured, type DealForAnalysis } from "@/lib/services/gemini";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Custom rate limit for AI analysis (more restrictive)
const AI_RATE_LIMIT = { limit: 10, windowSec: 60 }; // 10 analyses per minute

export async function POST(request: Request, { params }: RouteParams) {
  const ip = getClientIdentifier(request);
  const rateLimit = checkRateLimit(`ai-${ip}`, AI_RATE_LIMIT);

  if (!rateLimit.success) {
    return new NextResponse(
      JSON.stringify({ 
        error: "TOO_MANY_REQUESTS", 
        message: "Too many analysis requests. Please wait a moment." 
      }),
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: "AI_NOT_CONFIGURED", message: "AI analysis is not configured. Add GEMINI_API_KEY to your environment." },
        { status: 503, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const { id } = await params;

    // Get deal with ownership check
    const deal = await prisma.deal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Check if analysis already exists
    const existingAnalysis = await prisma.analysis.findFirst({
      where: {
        dealId: id,
        type: "MARKET" as const,
      },
    });

    // Get locale from request body
    const body = await request.json().catch(() => ({}));
    const locale = body.locale || "en-US";

    // Prepare deal data for analysis
    const dealForAnalysis: DealForAnalysis = {
      name: deal.name,
      address: deal.address,
      zipCode: deal.zipCode,
      propertyType: deal.propertyType,
      area: deal.area ? Number(deal.area) : null,
      bedrooms: deal.bedrooms,
      bathrooms: deal.bathrooms,
      parkingSpaces: deal.parkingSpaces,
      lotSize: deal.lotSize ? Number(deal.lotSize) : null,
      yearBuilt: deal.yearBuilt,
      condition: deal.condition,
      // Acquisition
      acquisitionType: deal.acquisitionType,
      // Financial
      purchasePrice: Number(deal.purchasePrice),
      estimatedCosts: Number(deal.estimatedCosts),
      monthlyExpenses: Number(deal.monthlyExpenses),
      propertyDebts: Number(deal.propertyDebts || 0),
      estimatedSalePrice: Number(deal.estimatedSalePrice),
      estimatedTimeMonths: deal.estimatedTimeMonths,
      isFirstProperty: deal.isFirstProperty,
      // Financing
      useFinancing: deal.useFinancing,
      downPayment: deal.downPayment ? Number(deal.downPayment) : null,
      interestRate: deal.interestRate ? Number(deal.interestRate) : null,
      loanTermYears: deal.loanTermYears,
      closingCosts: deal.closingCosts ? Number(deal.closingCosts) : null,
    };

    // Run AI analysis
    const analysisResult = await analyzeDeal(dealForAnalysis, locale);

    // Prepare data for database (convert to JSON-compatible format)
    const risksJson = JSON.parse(JSON.stringify(analysisResult.risks));
    const insightsJson = JSON.parse(JSON.stringify([
      ...analysisResult.insights,
      { 
        type: "neutral", 
        title: "Market Analysis", 
        description: JSON.stringify(analysisResult.marketAnalysis) 
      }
    ]));
    const conservativeJson = JSON.parse(JSON.stringify(analysisResult.scenarios.conservative));
    const moderateJson = JSON.parse(JSON.stringify(analysisResult.scenarios.moderate));
    const optimisticJson = JSON.parse(JSON.stringify(analysisResult.scenarios.optimistic));

    // Save or update analysis in database
    const analysis = existingAnalysis
      ? await prisma.analysis.update({
          where: { id: existingAnalysis.id },
          data: {
            summary: analysisResult.summary,
            score: analysisResult.score,
            risks: risksJson,
            insights: insightsJson,
            conservative: conservativeJson,
            moderate: moderateJson,
            optimistic: optimisticJson,
          },
        })
      : await prisma.analysis.create({
          data: {
            dealId: id,
            type: "MARKET" as const,
            summary: analysisResult.summary,
            score: analysisResult.score,
            risks: risksJson,
            insights: insightsJson,
            conservative: conservativeJson,
            moderate: moderateJson,
            optimistic: optimisticJson,
          },
        });

    // Update deal status to ANALYSIS_COMPLETE
    await prisma.deal.update({
      where: { id },
      data: { status: "ANALYSIS_COMPLETE" },
    });

    return NextResponse.json({
      message: "Analysis completed successfully",
      analysis: {
        id: analysis.id,
        summary: analysisResult.summary,
        score: analysisResult.score,
        risks: analysisResult.risks,
        insights: analysisResult.insights,
        marketAnalysis: analysisResult.marketAnalysis,
        neighborhoodProfile: analysisResult.neighborhoodProfile,
        scenarios: analysisResult.scenarios,
        checkpoints: analysisResult.checkpoints,
        questionsToAsk: analysisResult.questionsToAsk,
        hiddenCosts: analysisResult.hiddenCosts,
        alerts: analysisResult.alerts,
      },
    }, { headers: getRateLimitHeaders(rateLimit) });

  } catch (error) {
    console.error("Error analyzing deal:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to analyze deal" },
      { status: 500 }
    );
  }
}

// GET existing analysis
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify deal ownership
    const deal = await prisma.deal.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404 }
      );
    }

    // Get existing analysis
    const analysis = await prisma.analysis.findFirst({
      where: {
        dealId: id,
        type: "MARKET" as const,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "NO_ANALYSIS", message: "No analysis found for this deal" },
        { status: 404 }
      );
    }

    // Parse market analysis from insights if stored there
    let marketAnalysis = null;
    if (analysis.insights && Array.isArray(analysis.insights)) {
      const marketInsight = (analysis.insights as { type: string; title: string; description: string }[])
        .find(i => i.title === "Market Analysis");
      if (marketInsight) {
        try {
          marketAnalysis = JSON.parse(marketInsight.description);
        } catch {
          // Ignore parse errors
        }
      }
    }

    return NextResponse.json({
      analysis: {
        id: analysis.id,
        summary: analysis.summary,
        score: analysis.score,
        risks: analysis.risks,
        insights: (analysis.insights as { type: string; title: string; description: string }[])
          ?.filter(i => i.title !== "Market Analysis") || [],
        marketAnalysis,
        scenarios: {
          conservative: analysis.conservative,
          moderate: analysis.moderate,
          optimistic: analysis.optimistic,
        },
        createdAt: analysis.createdAt,
      },
    });

  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
