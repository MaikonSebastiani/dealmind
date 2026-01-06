// Auth validations
export { 
  loginSchema, 
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "./auth";

// Deal validations
export {
  createDealSchema,
  updateDealSchema,
  updateDealStatusSchema,
  type CreateDealInput,
  type UpdateDealInput,
  type UpdateDealStatusInput,
} from "./deal";

