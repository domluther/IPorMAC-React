import { useState, useEffect, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface QuizQuestion<T = any> {
	id: string;
	content: T;
	correctAnswer: number;
	explanation?: string;
}

interface QuizAnswer {
	id: number;
	text: string;
	shortcut?: string;
}

interface QuizFrameworkProps<T = any> {
	/** Current question data */
	question: QuizQuestion<T> | null;
	/** Available answer options */
	answers: QuizAnswer[];
	/** Custom component to render the question content */
	questionRenderer: (content: T) => ReactNode;
	/** Current streak count */
	streak?: number;
	/** Loading state */
	isLoading?: boolean;
	/** Feedback after answer selection */
	feedback?: {
		isCorrect: boolean;
		message: string;
		explanation?: string;
	} | null;
	/** Callback when answer is selected */
	onAnswerSelect: (answerId: number) => void;
	/** Callback to generate next question */
	onNextQuestion: () => void;
	/** Optional hint panel component */
	hintPanel?: ReactNode;
	/** Whether hints are visible */
	showHints?: boolean;
	/** Toggle hints visibility */
	onToggleHints?: () => void;
	/** Custom title for the quiz */
	title?: string;
	/** Custom instructions */
	instructions?: string;
}

/**
 * Reusable quiz framework for GCSE CS practice sites
 * Handles question display, answer selection, feedback, and keyboard shortcuts
 */
export function QuizFramework<T = any>({
	question,
	answers,
	questionRenderer,
	streak = 0,
	isLoading = false,
	feedback,
	onAnswerSelect,
	onNextQuestion,
	hintPanel,
	showHints = false,
	onToggleHints,
	title = "Practice Quiz",
	instructions = "Select the correct answer"
}: QuizFrameworkProps<T>) {
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Answer shortcuts (1-9)
			const num = parseInt(e.key);
			if (num >= 1 && num <= answers.length && !feedback) {
				onAnswerSelect(num);
				return;
			}

			// Next question shortcuts
			if ((e.key === "Enter" || e.key === " ") && feedback) {
				e.preventDefault();
				onNextQuestion();
				return;
			}

			// Toggle hints
			if (e.key.toLowerCase() === "h" && onToggleHints) {
				onToggleHints();
				return;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [answers.length, feedback, onAnswerSelect, onNextQuestion, onToggleHints]);

	const handleAnswerClick = (answerId: number) => {
		if (feedback) return; // Prevent clicks during feedback
		setSelectedAnswer(answerId);
		onAnswerSelect(answerId);
	};

	const handleNextQuestion = () => {
		setSelectedAnswer(null);
		onNextQuestion();
	};

	if (isLoading || !question) {
		return (
			<div className="text-center py-12">
				<div className="animate-spin text-4xl mb-4">🦆</div>
				<p className="text-gray-600">Loading question...</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Quiz Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">{title}</CardTitle>
						{streak > 0 && (
							<Badge variant="secondary" className="text-lg">
								🔥 {streak} streak
							</Badge>
						)}
					</div>
					{instructions && (
						<p className="text-gray-600">{instructions}</p>
					)}
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				{/* Main Quiz Content */}
				<div className="xl:col-span-2 space-y-6">
					{/* Question Display */}
					<Card>
						<CardHeader>
							<CardTitle>Question</CardTitle>
						</CardHeader>
						<CardContent>
							{questionRenderer(question.content)}
						</CardContent>
					</Card>

					{/* Answer Options */}
					<Card>
						<CardHeader>
							<CardTitle>Select your answer:</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{answers.map((answer) => (
									<Button
										key={answer.id}
										variant={selectedAnswer === answer.id ? "default" : "outline"}
										className={cn(
											"h-auto p-4 text-left justify-start",
											feedback && question.correctAnswer === answer.id && "bg-green-100 border-green-500 text-green-800",
											feedback && selectedAnswer === answer.id && question.correctAnswer !== answer.id && "bg-red-100 border-red-500 text-red-800"
										)}
										onClick={() => handleAnswerClick(answer.id)}
										disabled={!!feedback}
									>
										<div className="flex items-center gap-3 w-full">
											<Badge variant="secondary">
												{answer.shortcut || answer.id}
											</Badge>
											<span className="flex-1">{answer.text}</span>
										</div>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Feedback Display */}
					{feedback && (
						<Card className={cn(
							"border-2",
							feedback.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
						)}>
							<CardContent className="pt-6">
								<div className="flex items-start gap-3">
									<div className="text-2xl">
										{feedback.isCorrect ? "✅" : "❌"}
									</div>
									<div className="flex-1">
										<p className={cn(
											"font-semibold mb-2",
											feedback.isCorrect ? "text-green-800" : "text-red-800"
										)}>
											{feedback.message}
										</p>
										{feedback.explanation && (
											<p className="text-gray-700 mb-4">
												{feedback.explanation}
											</p>
										)}
										<Button onClick={handleNextQuestion}>
											Next Question →
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Keyboard Shortcuts Help */}
					<Card className="bg-gray-50">
						<CardContent className="pt-4">
							<div className="text-sm text-gray-600 space-y-1">
								<p><strong>Keyboard Shortcuts:</strong></p>
								<p>• Press 1-{answers.length} to select answers</p>
								<p>• Press Enter or Space for next question</p>
								{onToggleHints && <p>• Press H to toggle hints</p>}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="xl:col-span-1 space-y-6">
					{onToggleHints && (
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Need Help?</CardTitle>
									<Button
										variant="outline"
										onClick={onToggleHints}
									>
										{showHints ? "Hide" : "Show"} Hints
									</Button>
								</div>
							</CardHeader>
						</Card>
					)}

					{/* Hint Panel */}
					{hintPanel && showHints && (
						<div>
							{hintPanel}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
