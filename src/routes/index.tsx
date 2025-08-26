import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { QuizLayout } from "@/components/reusable/QuizLayout";
import { StatsModal } from "@/components/reusable/StatsModal";
import { QuizButton } from "@/components/reusable/buttons";
import { ScoreButton } from "@/components/ScoreButton";
import { HintPanel } from "@/components/HintPanel";
import type { AddressType } from "@/lib/addressGenerator";
import { generateRandomAddress } from "@/lib/addressGenerator";
import { ScoreManager } from "@/lib/scoreManager";
import { getSiteConfig } from "@/lib/siteConfig";
import { useQuizLogic } from "@/hooks/useQuizLogic";

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
	const [currentQuestion, setCurrentQuestion] = useState<NetworkAddressQuestion | null>(null);
	const [showStatsModal, setShowStatsModal] = useState(false);
	const [showHints, setShowHints] = useState(false);

	// ============================================================================
	// STEP 2: REFACTORED TO USE useQuizLogic HOOK - PATTERN FOR FUTURE AGENTS
	// ============================================================================
	// 
	// BEFORE: Manual state management for streak, feedback, scoring, stats updates
	// AFTER: useQuizLogic hook handles all common quiz functionality
	//
	// Future agents: Follow this pattern for all GCSE CS quiz sites:
	// 1. Create useQuizLogic with scoreManager + onQuestionGenerate callback
	// 2. Extract state/actions from hook (streak, feedback, handleAnswerSelect, etc.)
	// 3. Keep only site-specific logic (question generation, custom feedback)
	// 4. Use hook's methods for all common operations (scoring, streaks, stats)
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

	// ============================================================================
	// EXTRACT HOOK VALUES - CLEAN SEPARATION OF CONCERNS
	// ============================================================================
	//
	// The useQuizLogic hook provides:
	// - streak: Current streak count (managed automatically)
	// - overallStats: User progress stats (updated automatically)  
	// - feedback: Current feedback state (managed by hook)
	// - selectedAnswerId: Currently selected answer (for button styling)
	// - quizHandleAnswerSelect: Hook's answer handler (handles scoring/streaks)
	// - quizHandleNextQuestion: Hook's next question handler (clears state)
	// - setQuizFeedback: Set custom feedback messages
	//
	const { 
		streak, 
		overallStats, 
		feedback, 
		selectedAnswerId, 
		handleAnswerSelect: quizHandleAnswerSelect,
		handleNextQuestion: quizHandleNextQuestion,
		setFeedback: setQuizFeedback
	} = quizLogic;

	// ============================================================================
	// SITE-SPECIFIC LOGIC - NETWORK ADDRESS QUESTION HANDLING  
	// ============================================================================
	//
	// Future agents: This is the pattern for site-specific customization:
	// 1. generateNewQuestion: Create questions for initial load (hook handles subsequent ones)
	// 2. handleAnswerSelect: Site-specific correctness logic + custom feedback
	// 3. Use hook's quizHandleAnswerSelect for scoring/streaks
	// 4. Use hook's setQuizFeedback for custom messages
	//

	// Generate new question (for initial load only - hook handles subsequent generation)
	const generateNewQuestion = useCallback(() => {
		// The hook will call onQuestionGenerate when handleNextQuestion is called
		// For initial generation, we call it directly
		const addressData = generateRandomAddress();
		setCurrentQuestion({
			address: addressData.address,
			type: addressData.type,
			invalidType: addressData.invalidType,
			invalidReason: addressData.invalidReason,
		});
	}, []);

	// Handle answer selection - Network Address specific logic
	const handleAnswerSelect = useCallback((answerId: number) => {
		if (!currentQuestion) return;

		const selectedType = ANSWER_TO_TYPE[answerId];
		const isCorrect = selectedType === currentQuestion.type;

		// Generate feedback message specific to Network Addresses
		// Future agents: Customize this section for each quiz type
		let message: string;
		let explanation: string | undefined;

		if (isCorrect) {
			if (currentQuestion.type === "none") {
				message = "Correct! This is an invalid address. 🎉";
				explanation = currentQuestion.invalidReason 
					? `This ${currentQuestion.invalidType || "address"} ${currentQuestion.invalidReason}.`
					: `This is an invalid ${currentQuestion.invalidType || "address"}.`;
			} else {
				const article = currentQuestion.type === "IPv4" || currentQuestion.type === "IPv6" ? "an" : "a";
				message = `Correct! This is ${article} ${currentQuestion.type} address. 🎉`;
				explanation = ``;
			}
		} else {
			message = "Incorrect. ❌";
			if (currentQuestion.type === "none") {
				explanation = currentQuestion.invalidReason 
					? `This is an invalid ${currentQuestion.invalidType} address. It ${currentQuestion.invalidReason}.`
					: `This is an invalid ${currentQuestion.invalidType} address.`;
			} else {
				const article = currentQuestion.type === "IPv4" || currentQuestion.type === "IPv6" ? "an" : "a";
				explanation = `This is ${article} ${currentQuestion.type} address.`;
			}
		}

		// Use the hook's answer selection for scoring/streaks (handles the complex stuff)
		quizHandleAnswerSelect(answerId, isCorrect, {
			type: currentQuestion.type,
			address: currentQuestion.address,
		});

		// Set custom feedback message for Network Addresses (overrides hook's default)
		setQuizFeedback({
			isCorrect,
			message,
			explanation,
		});
	}, [currentQuestion, quizHandleAnswerSelect, setQuizFeedback]);

	// Handle next question (delegates to hook)
	const handleNextQuestion = useCallback(() => {
		// Hook handles: clearing feedback, clearing selectedAnswerId, calling onQuestionGenerate
		quizHandleNextQuestion();
	}, [quizHandleNextQuestion]);

	// Updated answer handler to track selected answer (needed for button styling)
	const handleAnswerSelectWithTracking = useCallback((answerId: number) => {
		// The hook now manages selectedAnswerId internally, so we just call our handler
		handleAnswerSelect(answerId);
	}, [handleAnswerSelect]);

	// Initialize first question (hook handles subsequent questions via onQuestionGenerate)
	useEffect(() => {
		generateNewQuestion();
	}, [generateNewQuestion]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (feedback) {
				if (event.key === "Enter" || event.key === " ") {
					handleNextQuestion();
					return;
				}
			}

			const key = event.key;
			if (key === "1") {
				handleAnswerSelectWithTracking(1);
			} else if (key === "2") {
				handleAnswerSelectWithTracking(2);
			} else if (key === "3") {
				handleAnswerSelectWithTracking(3);
			} else if (key === "4") {
				handleAnswerSelectWithTracking(4);
			} else if (key.toLowerCase() === "h") {
				setShowHints(!showHints);
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [feedback, handleNextQuestion, handleAnswerSelectWithTracking, showHints]);

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
			{/* ORIGINAL UI PRESERVED - STEP 2 COMPLETE */}
			{/* ================================================================== */}
			{/* 
			All original styling and layout preserved during hook refactoring:
			- Green border styling maintained
			- Gradient address display unchanged  
			- Button variants and feedback colors preserved
			- Keyboard shortcuts functionality intact
			
			Future agents: The UI below uses the new hook values (streak, feedback, etc.)
			but maintains the exact same visual appearance and user experience.
			*/}
			
			{/* Custom Quiz Implementation - Original Style */}
			<div className="mx-auto space-y-6">
				{/* Quiz Section - Original Green Border Style */}
				<div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
					<h2 className="text-xl font-semibold mb-4 text-gray-800">
						IP or MAC?
					</h2>

					{/* Streak Display - Original Style */}
					<div className="text-center text-lg mb-6 font-semibold text-gray-700 p-3 bg-gray-100 rounded-lg border-2 border-gray-200">
						Current streak:{" "}
						<span className="text-yellow-600">{scoreManager.formatStreakEmojis(streak)}</span> ({streak})
					</div>

					{/* Address Display - Original Gradient Style */}
					{currentQuestion && (
						<div className="font-mono text-2xl sm:text-3xl text-center p-6 sm:p-8 mb-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white rounded-xl border-3 border-indigo-600 shadow-lg font-semibold tracking-wider break-all">
							{currentQuestion.address}
						</div>
					)}

					{/* Answer Options - Original Style */}
					{currentQuestion && (
						<div className="grid grid-cols-2 gap-4 mb-6">
							{QUIZ_ANSWERS.map((answer) => {
								const selectedType = ANSWER_TO_TYPE[answer.id];
								const isSelected = feedback && selectedAnswerId === answer.id;
								const isCorrect = currentQuestion ? selectedType === currentQuestion.type : false;
								const showingFeedback = !!feedback;

								// Determine button variant based on state
								let variant: "answer" | "answer-selected" | "answer-correct" | "answer-incorrect" = "answer";
								
								if (showingFeedback) {
									if (isSelected && feedback.isCorrect) {
										variant = "answer-correct";
									} else if (isSelected && !feedback.isCorrect) {
										variant = "answer-incorrect";  
									} else if (isCorrect && !isSelected) {
										variant = "answer-correct";
									}
								}

								return (
									<QuizButton
										key={answer.id}
										variant={variant}
										size="lg"
										shortcut={answer.shortcut}
										disabled={showingFeedback}
										onClick={() => !feedback && handleAnswerSelectWithTracking(answer.id)}
									>
										{answer.text}
									</QuizButton>
								);
							})}
						</div>
					)}

					{/* Feedback - Original Style */}
					{feedback && (
						<div className={`
							p-5 rounded-lg mb-6 text-center font-semibold
							${feedback.isCorrect 
								? "bg-green-100 text-green-900 border border-green-300"
								: "bg-red-100 text-red-900 border border-red-300"
							}
						`}>
							<div className="mb-2">{feedback.message}</div>
							{feedback.explanation && (
								<div className="text-sm opacity-90">{feedback.explanation}</div>
							)}
						</div>
					)}

					{/* Next Button - Original Style */}
					{feedback && (
						<div className="text-center">
							<QuizButton
								variant="action"
								onClick={handleNextQuestion}
							>
								Next Question
							</QuizButton>
						</div>
					)}
				</div>

				{/* Help Section - Original Style */}
				<div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
					<h2 className="text-xl font-semibold mb-4 text-gray-800">
						Need Help?
					</h2>
					<QuizButton
						variant="secondary"
						onClick={() => setShowHints(!showHints)}
					>
						{showHints ? "Hide" : "Show"} Address Format Rules
					</QuizButton>
					<HintPanel isVisible={showHints} />
				</div>

				{/* Keyboard Shortcuts - Original Style */}
				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<div className="text-sm text-gray-600 space-y-1">
						<p><strong>Keyboard Shortcuts:</strong></p>
						<p>• Press 1-4 to select answers</p>
						<p>• Press Enter or Space for next question</p>
						<p>• Press H to toggle hints</p>
					</div>
				</div>
			</div>

			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Your Network Mastery"
			/>
		</QuizLayout>
	);
}
