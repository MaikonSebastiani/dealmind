/**
 * Financial calculations for real estate investment deals
 * Focused on house flipping and auction purchases
 */

export interface FinancingInput {
  purchasePrice: number;
  estimatedCosts: number; // Renovation costs
  monthlyExpenses: number; // HOA, taxes, insurance
  estimatedSalePrice: number;
  estimatedTimeMonths: number; // Holding period
  
  // Financing (optional)
  useFinancing?: boolean;
  downPayment?: number;
  interestRate?: number; // Annual rate (e.g., 7.5)
  loanTermYears?: number;
  closingCosts?: number; // ITBI, title fees, etc.
}

export interface FinancingResult {
  // Loan details
  loanAmount: number;
  monthlyPayment: number;
  
  // Investment summary
  totalCashInvested: number; // What you need upfront
  totalHoldingCosts: number; // Costs during holding period
  totalCostAtSale: number; // Everything including loan payoff
  
  // Returns
  grossProceeds: number;
  estimatedProfit: number;
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
    estimatedSalePrice,
    estimatedTimeMonths,
    useFinancing = false,
    downPayment = 0,
    interestRate = 0,
    loanTermYears = 30,
    closingCosts = 0,
  } = input;

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
  const totalCashInvested = useFinancing
    ? downPayment + estimatedCosts + closingCosts
    : purchasePrice + estimatedCosts;

  // Total cost at sale (including loan payoff)
  // For flipping: you pay off the full remaining loan balance when you sell
  const totalCostAtSale = useFinancing
    ? totalCashInvested + totalHoldingCosts + loanAmount // Pay off full loan
    : totalCashInvested + totalHoldingCosts;

  // Profit calculation
  const grossProceeds = estimatedSalePrice;
  const estimatedProfit = grossProceeds - totalCostAtSale;

  // ROI = Profit / Cash Invested (Cash-on-Cash Return)
  // This is the true ROI for leveraged investments
  const estimatedROI = totalCashInvested > 0 
    ? (estimatedProfit / totalCashInvested) * 100 
    : 0;

  return {
    loanAmount,
    monthlyPayment,
    totalCashInvested,
    totalHoldingCosts,
    totalCostAtSale,
    grossProceeds,
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

