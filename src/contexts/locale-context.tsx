"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LocaleCode = "en-US" | "pt-BR";

interface LocaleContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translations
const translations: Record<LocaleCode, Record<string, string>> = {
  "en-US": {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.deals": "Deals",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.saving": "Saving...",
    "common.creating": "Creating...",
    "common.yes": "Yes",
    "common.no": "No",
    "common.error": "Something went wrong. Please try again.",
    
    // Deal errors
    "deal.notFound": "Deal not found",
    "deal.propertyType.select": "Select property type",
    
    // Deal Form - Basic Info
    "deal.title.new": "New Deal",
    "deal.title.edit": "Edit Deal",
    "deal.subtitle.new": "Create a new real estate investment deal",
    "deal.subtitle.edit": "Update deal information",
    "deal.section.basicInfo": "Basic Information",
    "deal.section.financial": "Financial Details",
    "deal.section.financing": "Financing",
    "deal.section.notes": "Notes",
    "deal.section.preview": "Investment Preview",
    
    // Deal Fields
    "deal.name": "Deal Name",
    "deal.name.placeholder": "e.g., Downtown Apartment Complex",
    "deal.address": "Address",
    "deal.address.placeholder": "e.g., 123 Main St, City, State",
    "deal.zipCode": "ZIP Code",
    "deal.propertyType": "Property Type",
    "deal.propertyType.residential": "Residential",
    "deal.propertyType.commercial": "Commercial",
    "deal.propertyType.land": "Land",
    "deal.propertyType.industrial": "Industrial",
    "deal.propertyType.mixed": "Mixed Use",
    
    // Financial Fields
    "deal.purchasePrice": "Purchase Price",
    "deal.renovationCosts": "Renovation/Repair Costs",
    "deal.renovationCosts.description": "One-time costs (renovation, repairs, closing)",
    "deal.monthlyExpenses": "Monthly Expenses",
    "deal.monthlyExpenses.description": "HOA, taxes, insurance, maintenance",
    "deal.estimatedSalePrice": "Estimated Sale Price",
    "deal.timeline": "Timeline (months)",
    "deal.timeline.description": "Used to calculate total monthly expenses",
    
    // Financing Fields (US)
    "deal.financing.enabled": "Include Financing",
    "deal.financing.downPayment": "Down Payment",
    "deal.financing.downPayment.description": "Initial payment (typically 20-25%)",
    "deal.financing.loanAmount": "Loan Amount",
    "deal.financing.interestRate": "Interest Rate (APR)",
    "deal.financing.interestRate.description": "Annual percentage rate",
    "deal.financing.loanTerm": "Loan Term (years)",
    "deal.financing.monthlyPayment": "Monthly Payment",
    "deal.financing.closingCosts": "Closing Costs",
    "deal.financing.closingCosts.description": "Title, escrow, origination fees (2-5%)",
    
    // Preview
    "preview.purchasePrice": "Purchase Price",
    "preview.renovationCosts": "+ Renovation Costs",
    "preview.monthlyExpenses": "+ Monthly Expenses",
    "preview.financing": "- Financing (Loan)",
    "preview.totalInvestment": "Total Cash Needed",
    "preview.salePrice": "Sale Price",
    "preview.loanPayoff": "- Loan Payoff",
    "preview.estimatedProfit": "Estimated Profit",
    "preview.roi": "Cash-on-Cash ROI",
    "preview.monthlyPayment": "Monthly Payment",
    
    // Notes
    "deal.notes": "Additional Notes",
    "deal.notes.placeholder": "Any additional information about this deal...",
    
    // Actions
    "deal.action.create": "Create Deal",
    "deal.action.save": "Save Changes",
    
    // Status
    "status.analyzing": "Analyzing",
    "status.approved": "Approved",
    "status.rejected": "Rejected",
    "status.purchased": "Purchased",
    "status.renovating": "Renovating",
    "status.forSale": "For Sale",
    "status.sold": "Sold",
    
    // Deal List
    "deals.title": "Deals",
    "deals.empty": "No deals yet. Create your first deal to get started!",
    "deals.newDeal": "New Deal",
    "deals.table.name": "Name",
    "deals.table.type": "Type",
    "deals.table.investment": "Investment",
    "deals.table.profit": "Profit",
    "deals.table.roi": "ROI",
    "deals.table.status": "Status",
    "deals.table.actions": "Actions",
    
    // Detail Page
    "detail.totalInvestment": "Total Investment",
    "detail.estimatedSalePrice": "Estimated Sale Price",
    "detail.estimatedProfit": "Estimated Profit",
    "detail.estimatedROI": "Estimated ROI",
    "detail.financialBreakdown": "Financial Breakdown",
    "detail.dealInfo": "Deal Information",
    "detail.propertyType": "Property Type",
    "detail.timeline": "Timeline",
    "detail.created": "Created",
    "detail.lastUpdated": "Last Updated",
    "detail.months": "months",
  },
  
  "pt-BR": {
    // Navigation
    "nav.dashboard": "Painel",
    "nav.deals": "Negócios",
    "nav.settings": "Configurações",
    "nav.logout": "Sair",
    
    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.create": "Criar",
    "common.back": "Voltar",
    "common.loading": "Carregando...",
    "common.saving": "Salvando...",
    "common.creating": "Criando...",
    "common.yes": "Sim",
    "common.no": "Não",
    "common.error": "Algo deu errado. Por favor, tente novamente.",
    
    // Deal errors
    "deal.notFound": "Negócio não encontrado",
    "deal.propertyType.select": "Selecione o tipo de imóvel",
    
    // Deal Form - Basic Info
    "deal.title.new": "Novo Negócio",
    "deal.title.edit": "Editar Negócio",
    "deal.subtitle.new": "Criar um novo investimento imobiliário",
    "deal.subtitle.edit": "Atualizar informações do negócio",
    "deal.section.basicInfo": "Informações Básicas",
    "deal.section.financial": "Detalhes Financeiros",
    "deal.section.financing": "Financiamento",
    "deal.section.notes": "Observações",
    "deal.section.preview": "Prévia do Investimento",
    
    // Deal Fields
    "deal.name": "Nome do Negócio",
    "deal.name.placeholder": "ex: Apartamento Centro",
    "deal.address": "Endereço",
    "deal.address.placeholder": "ex: Rua Principal, 123, Cidade, Estado",
    "deal.zipCode": "CEP",
    "deal.propertyType": "Tipo de Imóvel",
    "deal.propertyType.residential": "Residencial",
    "deal.propertyType.commercial": "Comercial",
    "deal.propertyType.land": "Terreno",
    "deal.propertyType.industrial": "Industrial",
    "deal.propertyType.mixed": "Uso Misto",
    
    // Financial Fields
    "deal.purchasePrice": "Preço de Compra",
    "deal.renovationCosts": "Custos de Reforma",
    "deal.renovationCosts.description": "Custos únicos (reforma, reparos, cartório)",
    "deal.monthlyExpenses": "Despesas Mensais",
    "deal.monthlyExpenses.description": "Condomínio, IPTU, seguro, manutenção",
    "deal.estimatedSalePrice": "Preço de Venda Estimado",
    "deal.timeline": "Prazo (meses)",
    "deal.timeline.description": "Usado para calcular despesas mensais totais",
    
    // Financing Fields (BR)
    "deal.financing.enabled": "Incluir Financiamento",
    "deal.financing.downPayment": "Entrada",
    "deal.financing.downPayment.description": "Pagamento inicial (geralmente 20-30%)",
    "deal.financing.loanAmount": "Valor Financiado",
    "deal.financing.interestRate": "Taxa de Juros (a.a.)",
    "deal.financing.interestRate.description": "Taxa anual (ex: 10.5%)",
    "deal.financing.loanTerm": "Prazo (anos)",
    "deal.financing.monthlyPayment": "Parcela Mensal",
    "deal.financing.closingCosts": "Custos de Fechamento",
    "deal.financing.closingCosts.description": "ITBI, escritura, registro (3-5%)",
    
    // Preview
    "preview.purchasePrice": "Preço de Compra",
    "preview.renovationCosts": "+ Custos de Reforma",
    "preview.monthlyExpenses": "+ Despesas Mensais",
    "preview.financing": "- Financiamento",
    "preview.totalInvestment": "Capital Necessário",
    "preview.salePrice": "Preço de Venda",
    "preview.loanPayoff": "- Quitação do Financiamento",
    "preview.estimatedProfit": "Lucro Estimado",
    "preview.roi": "ROI sobre Capital",
    "preview.monthlyPayment": "Parcela Mensal",
    
    // Notes
    "deal.notes": "Observações Adicionais",
    "deal.notes.placeholder": "Informações adicionais sobre este negócio...",
    
    // Actions
    "deal.action.create": "Criar Negócio",
    "deal.action.save": "Salvar Alterações",
    
    // Status
    "status.analyzing": "Analisando",
    "status.approved": "Aprovado",
    "status.rejected": "Rejeitado",
    "status.purchased": "Comprado",
    "status.renovating": "Em Reforma",
    "status.forSale": "À Venda",
    "status.sold": "Vendido",
    
    // Deal List
    "deals.title": "Negócios",
    "deals.empty": "Nenhum negócio ainda. Crie seu primeiro negócio para começar!",
    "deals.newDeal": "Novo Negócio",
    "deals.table.name": "Nome",
    "deals.table.type": "Tipo",
    "deals.table.investment": "Investimento",
    "deals.table.profit": "Lucro",
    "deals.table.roi": "ROI",
    "deals.table.status": "Status",
    "deals.table.actions": "Ações",
    
    // Detail Page
    "detail.totalInvestment": "Investimento Total",
    "detail.estimatedSalePrice": "Preço de Venda Estimado",
    "detail.estimatedProfit": "Lucro Estimado",
    "detail.estimatedROI": "ROI Estimado",
    "detail.financialBreakdown": "Detalhamento Financeiro",
    "detail.dealInfo": "Informações do Negócio",
    "detail.propertyType": "Tipo de Imóvel",
    "detail.timeline": "Prazo",
    "detail.created": "Criado em",
    "detail.lastUpdated": "Última Atualização",
    "detail.months": "meses",
  },
};

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>("en-US");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locale") as LocaleCode;
    if (saved && (saved === "en-US" || saved === "pt-BR")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  // Save locale to localStorage when changed
  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

