import { CATEGORY_GRADIENTS } from "@/constants/services.constants";

export const getCategoryGradient = (category: string): string => {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.OTHER;
};
