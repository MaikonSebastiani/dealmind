import enUS from "./locales/en-US.json";
import ptBR from "./locales/pt-BR.json";

export type LocaleCode = "en-US" | "pt-BR";

// Type for nested translation objects
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

// All translations indexed by locale
export const translations: Record<LocaleCode, Translations> = {
  "en-US": enUS,
  "pt-BR": ptBR,
};

/**
 * Get a nested translation value using dot notation
 * Example: getNestedValue(translations, "deal.title.new") => "New Deal"
 */
function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split(".");
  let current: TranslationValue | undefined = obj;

  for (const key of keys) {
    if (current === undefined || typeof current === "string") {
      return undefined;
    }
    current = current[key];
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Create a translation function for a specific locale
 */
export function createTranslator(locale: LocaleCode) {
  const localeTranslations = translations[locale];

  return function t(key: string, params?: Record<string, string | number>): string {
    let value = getNestedValue(localeTranslations, key);

    // Fallback to English if key not found
    if (value === undefined && locale !== "en-US") {
      value = getNestedValue(translations["en-US"], key);
    }

    // Return key if no translation found
    if (value === undefined) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }

    // Replace parameters like {count}, {name}, etc.
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        value = value.replace(`{${paramKey}}`, String(paramValue));
      }
    }

    return value;
  };
}

/**
 * Flat key mapping for backward compatibility
 * Maps old flat keys to new nested keys
 */
export const keyMapping: Record<string, string> = {
  // Navigation
  "nav.dashboard": "nav.dashboard",
  "nav.deals": "nav.deals",
  "nav.settings": "nav.settings",
  "nav.logout": "nav.logout",

  // Common
  "common.save": "common.save",
  "common.cancel": "common.cancel",
  "common.delete": "common.delete",
  "common.edit": "common.edit",
  "common.create": "common.create",
  "common.back": "common.back",
  "common.loading": "common.loading",
  "common.saving": "common.saving",
  "common.creating": "common.creating",
  "common.yes": "common.yes",
  "common.no": "common.no",
  "common.error": "common.error",

  // Deal
  "deal.notFound": "deal.notFound",
  "deal.title.new": "deal.title.new",
  "deal.title.edit": "deal.title.edit",
  "deal.subtitle.new": "deal.subtitle.new",
  "deal.subtitle.edit": "deal.subtitle.edit",
  "deal.section.basicInfo": "deal.section.basicInfo",
  "deal.section.financial": "deal.section.financial",
  "deal.section.financing": "deal.section.financing",
  "deal.section.notes": "deal.section.notes",
  "deal.section.preview": "deal.section.preview",
  "deal.section.characteristics": "deal.section.characteristics",
  "deal.name": "deal.name",
  "deal.name.placeholder": "deal.namePlaceholder",
  "deal.address": "deal.address",
  "deal.address.placeholder": "deal.addressPlaceholder",
  "deal.address.waitingCep": "deal.addressWaitingCep",
  "deal.address.cepHint": "deal.addressCepHint",
  "deal.zipCode": "deal.zipCode",
  "deal.propertyType": "deal.propertyType.label",
  "deal.propertyType.select": "deal.propertyType.select",
  "deal.propertyType.residential": "deal.propertyType.residential",
  "deal.propertyType.commercial": "deal.propertyType.commercial",
  "deal.propertyType.land": "deal.propertyType.land",
  "deal.propertyType.industrial": "deal.propertyType.industrial",
  "deal.propertyType.mixed": "deal.propertyType.mixed",
  "deal.purchasePrice": "deal.purchasePrice",
  "deal.renovationCosts": "deal.renovationCosts",
  "deal.renovationCosts.description": "deal.renovationCostsDescription",
  "deal.monthlyExpenses": "deal.monthlyExpenses",
  "deal.monthlyExpenses.description": "deal.monthlyExpensesDescription",
  "deal.estimatedSalePrice": "deal.estimatedSalePrice",
  "deal.timeline": "deal.timeline",
  "deal.timeline.description": "deal.timelineDescription",
  "deal.financing.enabled": "deal.financing.enabled",
  "deal.financing.downPayment": "deal.financing.downPayment",
  "deal.financing.downPayment.description": "deal.financing.downPaymentDescription",
  "deal.financing.loanAmount": "deal.financing.loanAmount",
  "deal.financing.interestRate": "deal.financing.interestRate",
  "deal.financing.interestRate.description": "deal.financing.interestRateDescription",
  "deal.financing.loanTerm": "deal.financing.loanTerm",
  "deal.financing.monthlyPayment": "deal.financing.monthlyPayment",
  "deal.financing.closingCosts": "deal.financing.closingCosts",
  "deal.financing.closingCosts.description": "deal.financing.closingCostsDescription",
  "deal.notes": "deal.notes",
  "deal.notes.placeholder": "deal.notesPlaceholder",
  "deal.action.create": "deal.action.create",
  "deal.action.save": "deal.action.save",
  "deal.area": "deal.area",
  "deal.area.placeholder": "deal.areaPlaceholder",
  "deal.area.unit": "deal.areaUnit",
  "deal.area.unitUS": "deal.areaUnit",
  "deal.bedrooms": "deal.bedrooms",
  "deal.bathrooms": "deal.bathrooms",
  "deal.parkingSpaces": "deal.parkingSpaces",
  "deal.lotSize": "deal.lotSize",
  "deal.lotSize.description": "deal.lotSizeDescription",
  "deal.yearBuilt": "deal.yearBuilt",
  "deal.condition": "deal.condition.label",
  "deal.condition.select": "deal.condition.select",
  "deal.condition.new": "deal.condition.new",
  "deal.condition.excellent": "deal.condition.excellent",
  "deal.condition.good": "deal.condition.good",
  "deal.condition.fair": "deal.condition.fair",
  "deal.condition.needsWork": "deal.condition.needsWork",

  // Preview
  "preview.purchasePrice": "preview.purchasePrice",
  "preview.renovationCosts": "preview.renovationCosts",
  "preview.monthlyExpenses": "preview.monthlyExpenses",
  "preview.financing": "preview.financing",
  "preview.totalInvestment": "preview.totalInvestment",
  "preview.salePrice": "preview.salePrice",
  "preview.loanPayoff": "preview.loanPayoff",
  "preview.estimatedProfit": "preview.estimatedProfit",
  "preview.roi": "preview.roi",
  "preview.monthlyPayment": "preview.monthlyPayment",

  // Status
  "status.analyzing": "status.analyzing",
  "status.analysisComplete": "status.analysisComplete",
  "status.approved": "status.approved",
  "status.rejected": "status.rejected",
  "status.purchased": "status.purchased",
  "status.renovating": "status.renovating",
  "status.forSale": "status.forSale",
  "status.sold": "status.sold",

  // Deals list
  "deals.title": "deals.title",
  "deals.empty": "deals.empty",
  "deals.newDeal": "deals.newDeal",
  "deals.table.name": "deals.table.name",
  "deals.table.type": "deals.table.type",
  "deals.table.investment": "deals.table.investment",
  "deals.table.profit": "deals.table.profit",
  "deals.table.roi": "deals.table.roi",
  "deals.table.status": "deals.table.status",
  "deals.table.actions": "deals.table.actions",

  // Detail
  "detail.totalInvestment": "detail.totalInvestment",
  "detail.estimatedSalePrice": "detail.estimatedSalePrice",
  "detail.estimatedProfit": "detail.estimatedProfit",
  "detail.estimatedROI": "detail.estimatedROI",
  "detail.financialBreakdown": "detail.financialBreakdown",
  "detail.dealInfo": "detail.dealInfo",
  "detail.propertyType": "detail.propertyType",
  "detail.timeline": "detail.timeline",
  "detail.created": "detail.created",
  "detail.lastUpdated": "detail.lastUpdated",
  "detail.months": "detail.months",

  // Filters
  "filter.search.placeholder": "filter.searchPlaceholder",
  "filter.clearSearch": "filter.clearSearch",
  "filter.status": "filter.status",
  "filter.status.all": "filter.statusAll",
  "filter.type": "filter.type",
  "filter.type.all": "filter.typeAll",
  "filter.sort": "filter.sort",
  "filter.sort.newest": "filter.sortNewest",
  "filter.sort.oldest": "filter.sortOldest",
  "filter.sort.priceHigh": "filter.sortPriceHigh",
  "filter.sort.priceLow": "filter.sortPriceLow",
  "filter.sort.roiHigh": "filter.sortRoiHigh",
  "filter.sort.roiLow": "filter.sortRoiLow",
  "filter.sort.nameAZ": "filter.sortNameAZ",
  "filter.sort.nameZA": "filter.sortNameZA",
  "filter.clear": "filter.clear",
  "filter.results": "filter.results",
  "filter.noResults": "filter.noResults",
};

