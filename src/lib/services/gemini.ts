/**
 * Google Gemini AI Service
 * Free tier: 60 req/min, 1500 req/day
 * https://ai.google.dev/
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Types for deal analysis
export interface DealForAnalysis {
  name: string;
  address: string | null;
  zipCode: string | null;
  propertyType: string;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  condition: string | null;
  // Acquisition
  acquisitionType: string;
  // Financial
  purchasePrice: number;
  estimatedCosts: number;
  monthlyExpenses: number;
  propertyDebts: number;
  estimatedSalePrice: number;
  estimatedTimeMonths: number;
  isFirstProperty: boolean;
  // Financing
  useFinancing: boolean;
  downPayment: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  closingCosts: number | null;
  // Documents
  hasPropertyRegistry?: boolean;
  hasAuctionNotice?: boolean;
}

export interface AnalysisResult {
  summary: string;
  score: number; // 0-100
  risks: Risk[];
  insights: Insight[];
  marketAnalysis: MarketAnalysis;
  neighborhoodProfile: NeighborhoodProfile;
  scenarios: {
    conservative: Scenario;
    moderate: Scenario;
    optimistic: Scenario;
  };
  checkpoints: string[];
  questionsToAsk: string[];
  hiddenCosts: HiddenCost[];
  alerts: string[];
}

export interface Risk {
  level: "low" | "medium" | "high";
  title: string;
  description: string;
}

export interface Insight {
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
}

export interface MarketAnalysis {
  estimatedMarketValue: number;
  pricePerSqMeter: number;
  regionTrend: "rising" | "stable" | "falling";
  demandLevel: "high" | "medium" | "low";
  averageDaysOnMarket: number;
  typicalBuyerProfile?: string;
  nearbyInfrastructure?: string;
}

export interface NeighborhoodProfile {
  description: string;
  strengths: string[];
  challenges: string[];
  recentDevelopments?: string;
}

export interface Scenario {
  roi: number;
  profit: number;
  timeline: number; // months
  probability: number; // percentage
  assumptions?: string;
}

export interface HiddenCost {
  item: string;
  estimatedRange: string;
}

/**
 * Generate analysis prompt for Gemini
 */
function generatePrompt(deal: DealForAnalysis, locale: string): string {
  const isBrazil = locale === "pt-BR";
  const currency = isBrazil ? "BRL" : "USD";
  const areaUnit = isBrazil ? "m²" : "sq ft";
  const isAuction = deal.acquisitionType === "AUCTION";
  
  // Calculate total investment for context
  const totalInvestment = deal.purchasePrice + deal.estimatedCosts + deal.propertyDebts +
    (deal.monthlyExpenses * deal.estimatedTimeMonths);
  const estimatedProfit = deal.estimatedSalePrice - totalInvestment;
  const capitalGainsTax = !deal.isFirstProperty && isBrazil ? estimatedProfit * 0.15 : 0;
  const netProfit = estimatedProfit - capitalGainsTax;
  
  const propertyInfo = `
=== PROPERTY INFORMATION ===
- Name: ${deal.name}
- Address: ${deal.address || "Not provided"}
- ZIP Code: ${deal.zipCode || "Not provided"}
- Type: ${deal.propertyType}
- Area: ${deal.area ? `${deal.area} ${areaUnit}` : "Not provided"}
- Bedrooms: ${deal.bedrooms ?? "Not provided"}
- Bathrooms: ${deal.bathrooms ?? "Not provided"}
- Parking Spaces: ${deal.parkingSpaces ?? "Not provided"}
- Lot Size: ${deal.lotSize ? `${deal.lotSize} ${areaUnit}` : "Not provided"}
- Year Built: ${deal.yearBuilt ?? "Not provided"}
- Condition: ${deal.condition ?? "Not provided"}

=== ACQUISITION TYPE ===
- Type: ${isAuction ? "AUCTION" : "TRADITIONAL MARKET"}
${isAuction ? `
*** AUCTION CONTEXT (${isBrazil ? "BRAZIL" : "USA"}) ***
- In ${isBrazil ? "Brazil" : "the USA"}, auction properties often allow down payments as low as 5%
- This is NORMAL and should NOT be flagged as a risk
- Auction properties may have occupation issues that need to be verified
- The auction notice (edital) contains all legal terms
` : ""}

=== FINANCIAL DETAILS ===
- Purchase Price: ${currency} ${deal.purchasePrice.toLocaleString()}
- Renovation/Repair Costs: ${currency} ${deal.estimatedCosts.toLocaleString()}
- Property Debts (IPTU, condo fees in arrears): ${currency} ${deal.propertyDebts.toLocaleString()}
- Monthly Expenses: ${currency} ${deal.monthlyExpenses.toLocaleString()}
- Estimated Sale Price: ${currency} ${deal.estimatedSalePrice.toLocaleString()}
- Timeline: ${deal.estimatedTimeMonths} months

=== FINANCING ===
- Using Financing: ${deal.useFinancing ? "Yes" : "No (Cash purchase)"}
${deal.useFinancing ? `- Down Payment: ${currency} ${deal.downPayment?.toLocaleString() || 0}${isAuction ? " (5% down payment is normal for auctions)" : ""}
- Interest Rate: ${deal.interestRate}% per year
- Loan Term: ${deal.loanTermYears} years
- Closing Costs: ${currency} ${deal.closingCosts?.toLocaleString() || 0}` : ""}

=== TAX CONTEXT ===
- First Property in Owner's Name: ${deal.isFirstProperty ? "Yes" : "No"}
${isBrazil ? `- Capital Gains Tax: ${deal.isFirstProperty ? "EXEMPT (first property)" : "15% on profit (~" + currency + " " + capitalGainsTax.toLocaleString() + ")"}` : "- Capital Gains Tax: Varies by state and holding period"}
- Estimated Net Profit (after taxes): ${currency} ${netProfit.toLocaleString()}

=== DOCUMENTS PROVIDED ===
- Property Registry (Matrícula): ${deal.hasPropertyRegistry ? "Yes - ATTACHED" : "Not provided"}
- Auction Notice (Edital): ${deal.hasAuctionNotice ? "Yes - ATTACHED" : isAuction ? "NOT PROVIDED - Important for auction" : "N/A"}
`;

  const auctionSpecificGuidelines = isAuction ? `
AUCTION-SPECIFIC GUIDELINES:
1. DO NOT flag low down payments (5-10%) as a risk - this is standard for auctions
2. Check for occupation status - is the property occupied?
3. Consider eviction costs and timeline if occupied
4. Verify if there are debts from the previous owner
5. The auction notice (edital) is the primary legal document
6. Consider auctioneer fees (usually 5% of purchase price)
` : "";

  return `You are a real estate market research analyst specializing in ${isBrazil ? "Brazilian" : "US"} property investments, including ${isAuction ? "AUCTION" : "traditional market"} purchases.

Your role is to INFORM with data and observations, NOT to make investment decisions. The final decision always belongs to the investor.

${propertyInfo}

RESEARCH THE FOLLOWING and provide your analysis in JSON format (respond ONLY with valid JSON, no markdown):

{
  "summary": "2-3 sentence overview of your findings. DO NOT recommend buying or not buying. Focus on data and market context.",
  "score": <0-100 score based on data alignment and risk factors, NOT a buy recommendation>,
  "risks": [
    {
      "level": "low|medium|high",
      "title": "Risk factor title",
      "description": "Factual description of the risk"
    }
  ],
  "insights": [
    {
      "type": "positive|negative|neutral",
      "title": "Finding title",
      "description": "Data-based observation"
    }
  ],
  "marketAnalysis": {
    "estimatedMarketValue": <estimated fair market value based on comparable properties>,
    "pricePerSqMeter": <typical price per ${areaUnit} in this area>,
    "regionTrend": "rising|stable|falling",
    "demandLevel": "high|medium|low",
    "averageDaysOnMarket": <typical days to sell in this area>,
    "typicalBuyerProfile": "Description of who typically buys in this area",
    "nearbyInfrastructure": "Notable infrastructure (metro, schools, commerce)"
  },
  "neighborhoodProfile": {
    "description": "Brief description of the neighborhood characteristics",
    "strengths": ["strength 1", "strength 2"],
    "challenges": ["challenge 1", "challenge 2"],
    "recentDevelopments": "Any recent or planned infrastructure projects"
  },
  "scenarios": {
    "conservative": {
      "roi": <ROI percentage>,
      "profit": <profit amount AFTER taxes if applicable>,
      "timeline": <months>,
      "probability": <percentage>,
      "assumptions": "What conditions lead to this scenario"
    },
    "moderate": {
      "roi": <ROI percentage>,
      "profit": <profit amount AFTER taxes if applicable>,
      "timeline": <months>,
      "probability": <percentage>,
      "assumptions": "What conditions lead to this scenario"
    },
    "optimistic": {
      "roi": <ROI percentage>,
      "profit": <profit amount AFTER taxes if applicable>,
      "timeline": <months>,
      "probability": <percentage>,
      "assumptions": "What conditions lead to this scenario"
    }
  },
  "checkpoints": [
    "Document or item the investor should verify before proceeding"
  ],
  "questionsToAsk": [
    "Question the investor should ask the seller/auctioneer"
  ],
  "hiddenCosts": [
    {
      "item": "Potential hidden cost",
      "estimatedRange": "${currency} X - ${currency} Y or percentage"
    }
  ],
  "alerts": [
    "Important consideration or warning about this deal"
  ]
}

RESEARCH GUIDELINES:
1. Search for typical property values in the ZIP code area (${deal.zipCode || "area not specified"})
2. Consider the neighborhood profile and typical buyer
3. Analyze if the numbers provided by the user are realistic for the market
4. Identify what the investor should verify independently
5. List potential hidden costs common in this type of operation
6. Provide questions the investor should ask
7. Consider the tax implications based on first property status
${auctionSpecificGuidelines}

IMPORTANT RULES:
- DO NOT make buy/sell recommendations - only provide information
- DO NOT flag 5% down payment on auctions as risky - it's standard practice
- All values should be based on market research, not speculation
- Be specific about the location when possible
- All text MUST be in ${isBrazil ? "Brazilian Portuguese" : "English"}
- This is for the ${isBrazil ? "Brazilian" : "US"} real estate market
- Consider property debts (${currency} ${deal.propertyDebts.toLocaleString()}) in your analysis

DISCLAIMER: This analysis is informational only and does not constitute investment advice.`;
}

/**
 * Analyze a deal using Gemini AI
 */
export async function analyzeDeal(
  deal: DealForAnalysis,
  locale: string = "en-US"
): Promise<AnalysisResult> {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = generatePrompt(deal, locale);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response (remove markdown code blocks if present)
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    // Log raw AI response for debugging
    console.log("[Gemini] Raw response:", cleanedText);
    
    // Parse JSON response
    const analysis: AnalysisResult = JSON.parse(cleanedText);
    
    // Log parsed response
    console.log("[Gemini] Parsed analysis:", JSON.stringify(analysis, null, 2));
    
    // Validate required fields
    if (typeof analysis.score !== "number" || analysis.score < 0 || analysis.score > 100) {
      analysis.score = 50; // Default to neutral if invalid
    }
    
    return analysis;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    
    // Return a fallback analysis on error
    return generateFallbackAnalysis(deal, locale);
  }
}

/**
 * Generate fallback analysis when AI fails
 */
function generateFallbackAnalysis(deal: DealForAnalysis, locale: string = "pt-BR"): AnalysisResult {
  const isBrazil = locale === "pt-BR";
  const totalInvestment = deal.purchasePrice + deal.estimatedCosts + deal.propertyDebts +
    (deal.monthlyExpenses * deal.estimatedTimeMonths);
  const profit = deal.estimatedSalePrice - totalInvestment;
  const capitalGainsTax = !deal.isFirstProperty && isBrazil ? profit * 0.15 : 0;
  const netProfit = profit - capitalGainsTax;
  const roi = (netProfit / totalInvestment) * 100;
  
  const isAuction = deal.acquisitionType === "AUCTION";
  
  return {
    summary: isBrazil 
      ? "Análise automática não disponível. Os cálculos básicos foram realizados com base nos dados fornecidos."
      : "Automatic analysis not available. Basic calculations were performed based on the provided data.",
    score: roi > 20 ? 70 : roi > 10 ? 50 : 30,
    risks: [
      {
        level: "medium",
        title: isBrazil ? "Análise Limitada" : "Limited Analysis",
        description: isBrazil 
          ? "Esta análise foi gerada sem IA. Recomenda-se uma análise manual detalhada."
          : "This analysis was generated without AI. A detailed manual analysis is recommended."
      },
      ...(isAuction ? [{
        level: "medium" as const,
        title: isBrazil ? "Imóvel de Leilão" : "Auction Property",
        description: isBrazil
          ? "Verifique o edital, situação de ocupação e dívidas do antigo proprietário."
          : "Verify the auction notice, occupation status, and previous owner debts."
      }] : [])
    ],
    insights: [
      {
        type: roi > 15 ? "positive" : roi > 5 ? "neutral" : "negative",
        title: isBrazil ? "ROI Calculado" : "Calculated ROI",
        description: isBrazil
          ? `ROI estimado de ${roi.toFixed(1)}% baseado nos valores informados${!deal.isFirstProperty ? " (já considerando 15% de imposto sobre ganho de capital)" : ""}.`
          : `Estimated ROI of ${roi.toFixed(1)}% based on provided values.`
      },
      ...(deal.propertyDebts > 0 ? [{
        type: "negative" as const,
        title: isBrazil ? "Dívidas do Imóvel" : "Property Debts",
        description: isBrazil
          ? `O imóvel possui R$ ${deal.propertyDebts.toLocaleString()} em dívidas que devem ser quitadas.`
          : `The property has $${deal.propertyDebts.toLocaleString()} in debts that must be paid.`
      }] : [])
    ],
    marketAnalysis: {
      estimatedMarketValue: deal.estimatedSalePrice,
      pricePerSqMeter: deal.area ? deal.purchasePrice / deal.area : 0,
      regionTrend: "stable",
      demandLevel: "medium",
      averageDaysOnMarket: 90
    },
    neighborhoodProfile: {
      description: isBrazil 
        ? "Informações do bairro não disponíveis sem análise de IA."
        : "Neighborhood information not available without AI analysis.",
      strengths: [],
      challenges: []
    },
    scenarios: {
      conservative: {
        roi: roi * 0.7,
        profit: netProfit * 0.7,
        timeline: Math.ceil(deal.estimatedTimeMonths * 1.3),
        probability: 70,
        assumptions: isBrazil 
          ? "Mercado desaquecido, maior tempo de venda"
          : "Slow market, longer selling time"
      },
      moderate: {
        roi: roi,
        profit: netProfit,
        timeline: deal.estimatedTimeMonths,
        probability: 50,
        assumptions: isBrazil
          ? "Mercado estável, conforme planejado"
          : "Stable market, as planned"
      },
      optimistic: {
        roi: roi * 1.3,
        profit: netProfit * 1.3,
        timeline: Math.floor(deal.estimatedTimeMonths * 0.8),
        probability: 30,
        assumptions: isBrazil
          ? "Mercado aquecido, venda rápida"
          : "Hot market, quick sale"
      }
    },
    checkpoints: isBrazil ? [
      "Verificar documentação do imóvel (matrícula, certidões)",
      "Confirmar valores de mercado com comparativos",
      "Inspecionar o imóvel pessoalmente",
      ...(isAuction ? ["Analisar edital do leilão completamente", "Verificar situação de ocupação"] : [])
    ] : [
      "Verify property documentation",
      "Confirm market values with comparables",
      "Inspect the property in person",
      ...(isAuction ? ["Review auction terms completely", "Check occupation status"] : [])
    ],
    questionsToAsk: isBrazil ? [
      "Qual o motivo da venda?",
      "Há pendências ou dívidas no imóvel além das informadas?",
      "Há reformas recentes realizadas?",
      ...(isAuction ? ["O imóvel está ocupado?", "Quais as dívidas do antigo proprietário?"] : [])
    ] : [
      "What is the reason for selling?",
      "Are there any pending debts beyond those informed?",
      "Have any recent renovations been done?",
      ...(isAuction ? ["Is the property occupied?", "What are the previous owner's debts?"] : [])
    ],
    hiddenCosts: isBrazil ? [
      { item: "ITBI", estimatedRange: "2-3% do valor" },
      { item: "Escritura e Registro", estimatedRange: "1-2% do valor" },
      ...(isAuction ? [{ item: "Comissão do Leiloeiro", estimatedRange: "5% do valor arrematado" }] : [])
    ] : [
      { item: "Transfer Tax", estimatedRange: "1-2% of value" },
      { item: "Title and Recording", estimatedRange: "0.5-1% of value" },
      ...(isAuction ? [{ item: "Auctioneer Fee", estimatedRange: "5-10% of winning bid" }] : [])
    ],
    alerts: isBrazil ? [
      "Esta é uma análise básica gerada automaticamente. Recomenda-se executar uma análise completa com IA.",
      ...(isAuction ? ["Leilão: entrada de 5% é normal e não representa risco adicional."] : []),
      ...(!deal.isFirstProperty ? ["Considere o imposto de 15% sobre ganho de capital na sua análise."] : [])
    ] : [
      "This is a basic automatically generated analysis. Running a complete AI analysis is recommended.",
      ...(isAuction ? ["Auction: 5% down payment is standard and does not represent additional risk."] : [])
    ]
  };
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
