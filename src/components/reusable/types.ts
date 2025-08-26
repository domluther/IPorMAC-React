import type { ReactNode } from "react";
import type { ScoreManager } from "@/lib/scoreManager";
import type { NavMenuItem } from "@/lib/siteConfig";

// Quiz Framework Types
export interface QuizQuestion<T = any> {
	id: string;
	content: T;
	correctAnswer: number;
	explanation?: string;
}

export interface QuizAnswer {
	id: number;
	text: string;
	shortcut?: string;
}

export interface QuizFrameworkProps<T = any> {
	question: QuizQuestion<T> | null;
	answers: QuizAnswer[];
	questionRenderer: (content: T) => ReactNode;
	streak?: number;
	isLoading?: boolean;
	feedback?: {
		isCorrect: boolean;
		message: string;
		explanation?: string;
	} | null;
	onAnswerSelect: (answerId: number) => void;
	onNextQuestion: () => void;
	hintPanel?: ReactNode;
	showHints?: boolean;
	onToggleHints?: () => void;
	title?: string;
	instructions?: string;
}

// Stats Modal Types
export interface StatsModalProps {
	isOpen: boolean;
	onClose: () => void;
	scoreManager: ScoreManager;
	title?: string;
	headerIcon?: string;
}

// Site Navigation Types
export interface SiteNavigationProps {
	menuItems: NavMenuItem[];
	currentSiteId?: string;
	title?: string;
	icon?: string;
	compact?: boolean;
}

// Quiz Layout Types
export interface QuizLayoutProps {
	children: ReactNode;
	title: string;
	subtitle: string;
	scoreButton?: ReactNode;
	titleIcon?: string;
}
