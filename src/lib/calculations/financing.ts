/**
 * Financial calculations for real estate investment deals
 * Focused on house flipping and auction purchases
 */

export interface FinancingInput {
  purchasePrice: number;
  estimatedCosts: number; // Renovation costs
  monthlyExpenses: number; // HOA, taxes, insurance
  propertyDebts?: number; // Property debts (IPTU, condo fees)
  estimatedSalePrice: number;
  estimatedTimeMonths: number; // Holding period
  
  // Acquisition type
  acquisitionType?: "TRADITIONAL" | "AUCTION" | "AUCTION_NO_FEE";
  
  // Financing (optional)
  useFinancing?: boolean;
  downPayment?: number;
  interestRate?: number; // Annual rate (e.g., 7.5)
  loanTermYears?: number;
  closingCosts?: number; // ITBI, title fees, etc.
  
  // Tax considerations
  isFirstProperty?: boolean; // First property = no capital gains tax in Brazil
  locale?: string; // For country-specific tax calculations
}

export interface FinancingResult {
  // Loan details
  loanAmount: number;
  monthlyPayment: number;
  
  // Auction fees
  auctioneerFee: number; // Comissão do leiloeiro (5% for AUCTION, 0 for others)
  
  // Investment summary
  totalCashInvested: number; // What you need upfront
  totalHoldingCosts: number; // Costs during holding period
  totalCostAtSale: number; // Everything including loan payoff
  
  // Returns
  grossProceeds: number;
  capitalGainsTax: number; // Tax on profit (if applicable)
  estimatedProfit: number; // Net profit after taxes
  estimatedROI: number; // ROI on cash invested (Cash-on-Cash)
}

/**
 * Calculate monthly mortgage payment using PMT formula
 * P = L[c(1 + c)^n]/[(1 + c)^n – 1]
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number,
  termYears: number
): number {
  if (loanAmount <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  const payment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return isFinite(payment) ? Math.round(payment * 100) / 100 : 0;
}

/**
 * Calculate capital gains tax based on locale
 * Brazil (pt-BR): Progressive rates from 15% to 22.5%
 * USA (en-US): Variable, but we don't auto-calculate (just show warning)
 */
export function calculateCapitalGainsTax(
  profit: number, 
  locale: string = "en-US",
  isFirstProperty: boolean = false
): number {
  // First property exemption (Brazil) or just show warning (USA)
  if (isFirstProperty) return 0;
  
  // No tax on losses
  if (profit <= 0) return 0;
  
  // Brazil: Progressive tax on capital gains
  if (locale === "pt-BR") {
    // Simplified: most flips will fall in 15% bracket
    // Progressive rates:
    // Up to R$ 5M: 15%
    // R$ 5M to R$ 10M: 17.5%
    // R$ 10M to R$ 30M: 20%
    // Above R$ 30M: 22.5%
    if (profit <= 5000000) {
      return profit * 0.15;
    } else if (profit <= 10000000) {
      return 750000 + (profit - 5000000) * 0.175;
    } else if (profit <= 30000000) {
      return 750000 + 875000 + (profit - 10000000) * 0.20;
    } else {
      return 750000 + 875000 + 4000000 + (profit - 30000000) * 0.225;
    }
  }
  
  // USA: Don't auto-calculate (complex rules based on holding period, income, etc.)
  // Just return 0 and show warning in UI
  return 0;
}

/**
 * Calculate all financial metrics for a deal
 * 
 * For house flipping/auction:
 * - Short holding period (3-18 months typically)
 * - Full loan payoff at sale
 * - ROI = profit / cash invested
 */
export function calculateDealMetrics(input: FinancingInput): FinancingResult {
  const {
    purchasePrice,
    estimatedCosts,
    monthlyExpenses,
    propertyDebts = 0,
    estimatedSalePrice,
    estimatedTimeMonths,
    acquisitionType = "TRADITIONAL",
    useFinancing = false,
    downPayment = 0,
    interestRate = 0,
    loanTermYears = 30,
    closingCosts = 0,
    isFirstProperty = false,
    locale = "en-US",
  } = input;

  // Calculate auctioneer fee (5% for AUCTION with auctioneer, 0 for others)
  const auctioneerFee = acquisitionType === "AUCTION" 
    ? purchasePrice * 0.05 
    : 0;

  // Calculate loan amount (purchase price - down payment)
  const loanAmount = useFinancing 
    ? Math.max(0, purchasePrice - downPayment) 
    : 0;

  // Calculate monthly mortgage payment
  const monthlyPayment = useFinancing 
    ? calculateMonthlyPayment(loanAmount, interestRate, loanTermYears)
    : 0;

  // Holding costs during investment period
  const totalMonthlyExpenses = monthlyExpenses * estimatedTimeMonths;
  const totalMortgagePayments = monthlyPayment * estimatedTimeMonths;
  const totalHoldingCosts = totalMonthlyExpenses + totalMortgagePayments;

  // Cash invested upfront (what you need to start)
  // Include property debts and auctioneer fee as part of acquisition costs
  const totalCashInvested = useFinancing
    ? downPayment + estimatedCosts + closingCosts + propertyDebts + auctioneerFee
    : purchasePrice + estimatedCosts + propertyDebts + auctioneerFee;

  // Total cost at sale (including loan payoff)
  // For flipping: you pay off the full remaining loan balance when you sell
  const totalCostAtSale = useFinancing
    ? totalCashInvested + totalHoldingCosts + loanAmount // Pay off full loan
    : totalCashInvested + totalHoldingCosts;

  // Gross profit calculation (before taxes)
  const grossProceeds = estimatedSalePrice;
  const grossProfit = grossProceeds - totalCostAtSale;

  // Calculate capital gains tax (only for non-first-property in Brazil)
  const capitalGainsTax = calculateCapitalGainsTax(grossProfit, locale, isFirstProperty);

  // Net profit after taxes
  const estimatedProfit = grossProfit - capitalGainsTax;

  // ROI = Profit / Cash Invested (Cash-on-Cash Return)
  // This is the true ROI for leveraged investments
  const estimatedROI = totalCashInvested > 0 
    ? (estimatedProfit / totalCashInvested) * 100 
    : 0;

  return {
    loanAmount,
    monthlyPayment,
    auctioneerFee,
    totalCashInvested,
    totalHoldingCosts,
    totalCostAtSale,
    grossProceeds,
    capitalGainsTax,
    estimatedProfit,
    estimatedROI: Math.round(estimatedROI * 100) / 100,
  };
}

/**
 * Get default interest rate by country
 * Based on typical mortgage rates for investment properties
 */
export function getDefaultInterestRate(locale: string): number {
  switch (locale) {
    case "pt-BR":
      return 11.5; // Taxa média Brasil (investimento)
    case "en-US":
    default:
      return 7.5; // US investment property rate
  }
}

/**
 * Get loan term options by country
 */
export function getLoanTermOptions(locale: string): number[] {
  switch (locale) {
    case "pt-BR":
      // Brasil: máximo 30 anos, comum 20-25
      return [5, 10, 15, 20, 25, 30];
    case "en-US":
    default:
      // USA: típico 15 ou 30 anos
      return [10, 15, 20, 25, 30];
  }
}

