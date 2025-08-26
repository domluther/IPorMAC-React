/**
 * GCSE CS Reusable Component Library
 * Export all reusable components for easy importing
 */

export type {
	QuizButtonProps,
	QuizButtonSize,
	QuizButtonVariant,
} from "./QuizButton";
export { QuizButton } from "./QuizButton";
// Layout Components
export { QuizLayout } from "./QuizLayout";
export { Header } from "./Header";
export { Footer } from "./Footer";
export type { QuizAnswer, SimpleQuizBodyProps } from "./SimpleQuizBody";
// Quiz Body Components
export { SimpleQuizBody } from "./SimpleQuizBody";
export { SiteNavigation } from "./SiteNavigation"; 
// Utility Components
export { ScoreButton } from "./ScoreButton";
export type { HintItem } from "./GenericHintPanel";
export { GenericHintPanel } from "./GenericHintPanel";
// Modal Components
export { StatsModal } from "./StatsModal";

/**
 * Usage Example:
 *
 * import {
 *   QuizLayout,
 *   SimpleQuizBody,
 *   StatsModal,
 *   QuizButton,
 *   ScoreButton,
 *   GenericHintPanel,
 *   Header,
 *   Footer
 * } from "@/components/reusable";
 */
