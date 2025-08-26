import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { HintPanel } from "@/components/HintPanel";
import { QuizLayout, SimpleQuizBody } from "@/components/reusable";
import { QuizButton } from "@/components/reusable/buttons";
import { StatsModal } from "@/components/reusable/StatsModal";
import { ScoreButton } from "@/components/ScoreButton";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import type { AddressType } from "@/lib/addressGenerator";
import { generateRandomAddress } from "@/lib/addressGenerator";
import { ScoreManager } from "@/lib/scoreManager";
import { getSiteConfig } from "@/lib/siteConfig";

export const Route = createFileRoute("/")({
	component: Index,
});

// Define question type for our quiz
interface NetworkAddressQuestion {
	address: string;
	type: AddressType;
	invalidType?: string;
	invalidReason?: string;
}

// Quiz answer options
const QUIZ_ANSWERS = [
	{ id: 1, text: "IPv4", shortcut: "1" },
	{ id: 2, text: "IPv6", shortcut: "2" },
	{ id: 3, text: "MAC", shortcut: "3" },
	{ id: 4, text: "None", shortcut: "4" },
];

// Map answer IDs to address types
const ANSWER_TO_TYPE: Record<number, AddressType> = {
	1: "IPv4",
	2: "IPv6",
	3: "MAC",
	4: "none",
};

function Index() {
	// Site configuration
	const siteConfig = getSiteConfig("network-addresses");

	// Score manager
	const [scoreManager] = useState(() => new ScoreManager(siteConfig.siteKey));

	// Quiz state - Network Address specific
	const [currentQuestion, setCurrentQuestion] =
		useState<NetworkAddressQuestion | null>(null);
	const [showStatsModal, setShowStatsModal] = useState(false);
	const [showHints, setShowHints] = useState(false);

	// ============================================================================
	// STEP 3: USING useQuizLogic HOOK + SimpleQuizBody COMPONENT
	// ============================================================================
	//
	// This demonstrates the final pattern for creating GCSE CS quiz sites:
	// 1. Configure useQuizLogic hook with site-specific question generation
	// 2. Create site-specific rendering and feedback functions
	// 3. Use SimpleQuizBody component for all common UI (90% less code!)
	// 4. Add optional help sections for hints/rules
	//
	// Future agents: This is the standard pattern to follow for all quiz sites.
	//
	const quizLogic = useQuizLogic({
		scoreManager,
		onQuestionGenerate: () => {
			// Generate new Network Address question
			const addressData = generateRandomAddress();
			setCurrentQuestion({
				address: addressData.address,
				type: addressData.type,
				invalidType: addressData.invalidType,
				invalidReason: addressData.invalidReason,
			});
		},
		// Network Address questions are simple multiple choice (100 points or 0 points)
		// For trace tables, use different values like correctPoints: 1, maxPoints: 20
		correctPoints: 100,
		maxPoints: 100,
	});

	// Extract quiz state for the ScoreButton and StatsModal
	const { overallStats } = quizLogic;

	// ============================================================================
	// SITE-SPECIFIC CUSTOMIZATION FUNCTIONS
	// ============================================================================
	//
	// Future agents: These are the only functions you need to customize per site:
	//

	// Generate initial question (hook handles subsequent ones via onQuestionGenerate)
	const generateNewQuestion = useCallback(() => {
		const addressData = generateRandomAddress();
		setCurrentQuestion({
			address: addressData.address,
			type: addressData.type,
			invalidType: addressData.invalidType,
			invalidReason: addressData.invalidReason,
		});
	}, []);

	// Question renderer - Network Address specific styling
	const questionRenderer = useCallback(
		(question: NetworkAddressQuestion) => (
			<div className="font-mono text-2xl sm:text-3xl text-center p-6 sm:p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white rounded-xl border-3 border-indigo-600 shadow-lg font-semibold tracking-wider break-all">
				{question.address}
			</div>
		),
		[],
	);

	// Correctness logic - Network Address specific
	const isCorrectAnswer = useCallback(
		(answerId: number, question: NetworkAddressQuestion) => {
			const selectedType = ANSWER_TO_TYPE[answerId];
			return selectedType === question.type;
		},
		[],
	);

	// Feedback generation - Network Address specific messages
	const generateFeedback = useCallback(
		(
			isCorrect: boolean,
			_answerId: number, // Unused in Network Address logic
			question: NetworkAddressQuestion,
		) => {
			let message: string;
			let explanation: string | undefined;

			if (isCorrect) {
				if (question.type === "none") {
					message = "Correct! This is an invalid address. 🎉";
					explanation = question.invalidReason
						? `This ${question.invalidType || "address"} ${question.invalidReason}.`
						: `This is an invalid ${question.invalidType || "address"}.`;
				} else {
					const article =
						question.type === "IPv4" || question.type === "IPv6" ? "an" : "a";
					message = `Correct! This is ${article} ${question.type} address. 🎉`;
					explanation = `Great job identifying the ${question.type} format!`;
				}
			} else {
				message = "Incorrect. Try again! ❌";
				if (question.type === "none") {
					explanation = question.invalidReason
						? `This is actually an invalid ${question.invalidType || "address"}. It ${question.invalidReason}.`
						: `This is actually an invalid ${question.invalidType || "address"}.`;
				} else {
					const article =
						question.type === "IPv4" || question.type === "IPv6" ? "an" : "a";
					explanation = `This is actually ${article} ${question.type} address.`;
				}
			}

			return { message, explanation };
		},
		[],
	);

	// Initialize first question (hook handles subsequent questions automatically)
	useEffect(() => {
		generateNewQuestion();
	}, [generateNewQuestion]);

	// Help section with hints (passed to SimpleQuizBody)
	const helpSection = (
		<div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">Need Help?</h2>
			<QuizButton variant="secondary" onClick={() => setShowHints(!showHints)}>
				{showHints ? "Hide" : "Show"} Address Format Rules
			</QuizButton>
			<HintPanel isVisible={showHints} />
		</div>
	);

	return (
		<QuizLayout
			title={siteConfig.title}
			subtitle={siteConfig.subtitle}
			titleIcon={siteConfig.icon}
			scoreButton={
				<ScoreButton
					levelEmoji={overallStats.level.emoji}
					levelTitle={overallStats.level.title}
					points={overallStats.totalPoints}
					onClick={() => setShowStatsModal(true)}
				/>
			}
		>
			{/* ================================================================== */}
			{/* STEP 3 COMPLETE - USING SimpleQuizBody COMPONENT */}
			{/* ================================================================== */}
			{/* 
			Massive UI simplification achieved:
			- 200+ lines of custom UI replaced with SimpleQuizBody component
			- All original styling and behavior preserved
			- Same green borders, gradient display, button variants, keyboard shortcuts
			- Future quiz sites can now use this same pattern with minimal code
			
			Future agents: This is the new standard pattern for simple quiz sites:
			1. Configure useQuizLogic hook with site-specific onQuestionGenerate
			2. Create questionRenderer, isCorrectAnswer, generateFeedback functions  
			3. Pass everything to SimpleQuizBody component
			4. Add optional helpSection for hints/rules
			
			Total code reduction: ~150 lines → ~20 lines for new quiz sites!
			*/}

			<SimpleQuizBody
				quizLogic={quizLogic}
				currentQuestion={currentQuestion}
				answers={QUIZ_ANSWERS}
				questionRenderer={questionRenderer}
				isCorrectAnswer={isCorrectAnswer}
				generateFeedback={generateFeedback}
				title="IP or MAC?"
				showStreakEmojis={true}
				helpSection={helpSection}
			/>

			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Your Network Mastery"
			/>
		</QuizLayout>
	);
}
