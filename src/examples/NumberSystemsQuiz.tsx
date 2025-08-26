/**
 * GCSE CS Practice Sites - Reusable Component Library
 *
 * This file demonstrates how to use the reusable components for creating
 * consistent GCSE CS practice sites with minimal setup.
 */

import { useEffect, useState } from "react";
import { QuizFramework } from "../components/reusable/QuizFramework";
import { QuizLayout } from "../components/reusable/QuizLayout";
import { StatsModal } from "../components/reusable/StatsModal";
import { ScoreButton } from "../components/ScoreButton";
import { ScoreManager } from "../lib/scoreManager";
import { SITE_CONFIG } from "../lib/siteConfig";

// Example: Number Systems Quiz Implementation
interface NumberSystemQuestion {
	number: string;
	fromBase: number;
	toBase: number;
	type:
		| "binary-to-decimal"
		| "decimal-to-binary"
		| "hex-to-decimal"
		| "decimal-to-hex";
}

const QUIZ_ANSWERS = [
	{ id: 1, text: "Option A", shortcut: "1" },
	{ id: 2, text: "Option B", shortcut: "2" },
	{ id: 3, text: "Option C", shortcut: "3" },
	{ id: 4, text: "Option D", shortcut: "4" },
];

/**
 * Example implementation of a reusable GCSE CS quiz
 * This demonstrates the minimal code needed to create a new site
 */
export function NumberSystemsQuiz() {
	// 1. Get site configuration
	const siteConfig = SITE_CONFIG;

	// Score manager
	const [scoreManager] = useState(() => new ScoreManager(siteConfig.siteKey));
	const [overallStats, setOverallStats] = useState(() =>
		scoreManager.getOverallStats(),
	);

	// 3. Quiz state
	const [currentQuestion, setCurrentQuestion] =
		useState<NumberSystemQuestion | null>(null);
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean;
		message: string;
		explanation?: string;
	} | null>(null);
	const [showStatsModal, setShowStatsModal] = useState(false);
	const [showHints, setShowHints] = useState(false);
	const [streak, setStreak] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	// 4. Generate a new question (example logic)
	const generateQuestion = () => {
		setIsLoading(true);
		// Simulate loading
		setTimeout(() => {
			const types: NumberSystemQuestion["type"][] = [
				"binary-to-decimal",
				"decimal-to-binary",
				"hex-to-decimal",
				"decimal-to-hex",
			];
			const type = types[Math.floor(Math.random() * types.length)];

			let question: NumberSystemQuestion;
			switch (type) {
				case "binary-to-decimal":
					question = {
						number: Math.floor(Math.random() * 255).toString(2),
						fromBase: 2,
						toBase: 10,
						type,
					};
					break;
				case "decimal-to-binary":
					question = {
						number: Math.floor(Math.random() * 255).toString(),
						fromBase: 10,
						toBase: 2,
						type,
					};
					break;
				case "hex-to-decimal":
					question = {
						number: Math.floor(Math.random() * 255)
							.toString(16)
							.toUpperCase(),
						fromBase: 16,
						toBase: 10,
						type,
					};
					break;
				case "decimal-to-hex":
					question = {
						number: Math.floor(Math.random() * 255).toString(),
						fromBase: 10,
						toBase: 16,
						type,
					};
					break;
			}

			setCurrentQuestion(question);
			setIsLoading(false);
		}, 300);
	};

	// 5. Handle answer selection
	const handleAnswerSelect = (answerId: number) => {
		if (!currentQuestion) return;

		const isCorrect = answerId === 1; // For demo purposes, answer 1 is always correct

		// Update scores
		// For multiple choice quizzes: always use 100 as maxScore (binary correct/incorrect)
		// - Correct answer gets 100 points out of 100 (100% = marked as correct)
		// - Incorrect answer gets 0 points out of 100 (0% = marked as incorrect)
		//
		// Note: Trace table quizzes use different scoring (e.g., 4/20, 6/6) for partial credit
		// but simple quizzes like this are all-or-nothing
		scoreManager.recordScore(
			`${currentQuestion.type}-${Date.now()}`,
			isCorrect ? 100 : 0, // Score: 100 (correct) or 0 (incorrect)
			100, // MaxScore: Always 100 for multiple choice
			currentQuestion.type,
		);

		// Update streak
		const newStreak = isCorrect ? streak + 1 : 0;
		setStreak(newStreak);
		scoreManager.updateStreak(isCorrect);

		// Update overall stats
		setOverallStats(scoreManager.getOverallStats());

		// Show feedback
		setFeedback({
			isCorrect,
			message: isCorrect ? "Correct! Well done! 🎉" : "Incorrect. Try again!",
			explanation: isCorrect
				? `${currentQuestion.number} in base ${currentQuestion.fromBase} converts correctly to base ${currentQuestion.toBase}.`
				: `The correct answer is different. ${currentQuestion.number} in base ${currentQuestion.fromBase} needs careful conversion.`,
		});
	};

	// 6. Generate next question
	const handleNextQuestion = () => {
		setFeedback(null);
		generateQuestion();
	};

	// 7. Question renderer (custom for each quiz type)
	const questionRenderer = (content: NumberSystemQuestion) => (
		<div className="text-center p-8">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 inline-block">
				<div className="text-4xl font-mono font-bold mb-2">
					{content.number}
				</div>
				<div className="text-lg">
					Convert from base {content.fromBase} to base {content.toBase}
				</div>
			</div>
		</div>
	);

	// 8. Hint panel (custom for each quiz type)
	const hintPanel = (
		<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
			<h3 className="font-bold text-blue-800 mb-2">💡 Number Systems Hints</h3>
			<div className="text-sm space-y-2 text-blue-700">
				<p>
					<strong>Binary:</strong> Uses base 2 (0, 1)
				</p>
				<p>
					<strong>Decimal:</strong> Uses base 10 (0-9)
				</p>
				<p>
					<strong>Hexadecimal:</strong> Uses base 16 (0-9, A-F)
				</p>
				<p>
					<strong>Tip:</strong> Break down large numbers step by step
				</p>
			</div>
		</div>
	);

	// Initialize first question
	useEffect(() => {
		generateQuestion();
	}, []);

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
			<QuizFramework
				question={
					currentQuestion
						? {
								id: `${currentQuestion.type}-${Date.now()}`,
								content: currentQuestion,
								correctAnswer: 1, // For demo purposes
							}
						: null
				}
				answers={QUIZ_ANSWERS}
				questionRenderer={questionRenderer}
				streak={streak}
				isLoading={isLoading}
				feedback={feedback}
				onAnswerSelect={handleAnswerSelect}
				onNextQuestion={handleNextQuestion}
				hintPanel={hintPanel}
				showHints={showHints}
				onToggleHints={() => setShowHints(!showHints)}
				title="Number Systems Practice"
				instructions="Convert the number between different bases"
			/>

			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Your Progress"
			/>
		</QuizLayout>
	);
}

export default NumberSystemsQuiz;
