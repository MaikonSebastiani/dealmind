// Main form component
export { DealForm } from "./deal-form";

// Hook for custom implementations
export { useDealForm } from "./use-deal-form";

// Types
export type {
  DealFormProps,
  DealFormMode,
  DealFormValues,
  DealMetrics,
  PropertyType,
  PropertyCondition,
} from "./types";

// Individual sections (for advanced customization)
export {
  BasicInfoSection,
  CharacteristicsSection,
  FinancialSection,
  FinancingSection,
  NotesSection,
  PreviewPanel,
} from "./sections";

// Constants
export {
  PROPERTY_TYPE_VALUES,
  PROPERTY_CONDITION_VALUES,
  PROPERTY_TYPE_KEYS,
  PROPERTY_CONDITION_KEYS,
  getDefaultFormValues,
} from "./constants";
