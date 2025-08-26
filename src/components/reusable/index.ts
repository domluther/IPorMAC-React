/**
 * GCSE CS Reusable Component Library
 * Export all reusable components for easy importing
 */

export type {
	QuizButtonProps,
	QuizButtonSize,
	QuizButtonVariant,
} from "./buttons";
export { QuizButton } from "./buttons";
// Interactive Components
export { QuizFramework } from "./QuizFramework";
// Layout Components
export { QuizLayout } from "./QuizLayout";
export type { QuizAnswer, SimpleQuizBodyProps } from "./SimpleQuizBody";
// Quiz Body Components
export { SimpleQuizBody } from "./SimpleQuizBody";
export { SiteNavigation } from "./SiteNavigation"; // Button Components
export { StatsModal } from "./StatsModal";

/**
 * Usage Example:
 *
 * import {
 *   QuizLayout,
 *   QuizFramework,
 *   StatsModal,
 *   QuizButton
 * } from "@/components/reusable";
 * } from "@/components/reusable";
 */
