// Main component
export { DealDetail } from "./deal-detail";

// Types
export type { Deal, DealDetailProps, DealMetrics } from "./types";

// Individual sections (for advanced customization)
export {
  DetailHeader,
  MetricsCards,
  PropertyCharacteristics,
  FinancialBreakdown,
  DealInfo,
  NotesSection,
} from "./sections";

// Constants
export {
  STATUS_KEYS,
  PROPERTY_TYPE_KEYS,
  CONDITION_KEYS,
  getStatusConfig,
  getPropertyTypeLabel,
  getConditionLabel,
} from "./constants";

