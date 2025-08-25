import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { HintPanel } from "@/components/HintPanel";
import { ScoreModal } from "@/components/ScoreModal";
import type { AddressData, AddressType } from "@/lib/addressGenerator";
import { generateRandomAddress } from "@/lib/addressGenerator";
import { ScoreManager } from "@/lib/scoreManager";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	// Game state
	const [currentAddress, setCurrentAddress] = useState<AddressData | null>(
		null,
	);
	const [selectedAnswer, setSelectedAnswer] = useState<AddressType | null>(
		null,
	);
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [isCorrect, setIsCorrect] = useState(false);
	const [streak, setStreak] = useState(0);
	const [streakEmojis, setStreakEmojis] = useState("");
	const [scoreText, setScoreText] = useState("Scores (0%)");

	// UI state
	const [showScoreModal, setShowScoreModal] = useState(false);
	const [showHints, setShowHints] = useState(false);

	// Score manager
	const [scoreManager] = useState(() => new ScoreManager("network-addresses"));

	// Generate new question
	const generateNewQuestion = useCallback(() => {
		const newAddress = generateRandomAddress();
		setCurrentAddress(newAddress);
		setSelectedAnswer(null);
		setShowFeedback(false);
		setFeedbackMessage("");
	}, []);

	const updateStreakDisplay = useCallback(() => {
		const currentStreak = scoreManager.getStreak();
		setStreak(currentStreak);
		setStreakEmojis(scoreManager.formatStreakEmojis(currentStreak));
	}, [scoreManager]);

	const updateScoreButton = useCallback(() => {
		const stats = scoreManager.getOverallStats();
		const totalPoints = stats.totalCorrect;
		setScoreText(
			`${stats.level.emoji} ${stats.level.title} (${totalPoints} pts)`,
		);
	}, [scoreManager]);

	const handleAnswer = useCallback(
		(answer: AddressType) => {
			if (!currentAddress || showFeedback) return;

			setSelectedAnswer(answer);
			const correct = answer === currentAddress.type;
			setIsCorrect(correct);

			// Update streak
			scoreManager.updateStreak(correct);
			updateStreakDisplay();

			// Record score
			scoreManager.recordScore(
				"quiz",
				correct ? 100 : 0,
				100,
				currentAddress.type,
				currentAddress.address,
			);
			updateScoreButton();

			// Show feedback
			if (correct) {
				if (currentAddress.type === "none") {
					let message = `Correct! This is an invalid ${currentAddress.invalidType || "address"}.`;
					if (currentAddress.invalidReason) {
						message += ` It ${currentAddress.invalidReason}.`;
					}
					setFeedbackMessage(message);
				} else {
					const article =
						currentAddress.type === "IPv4" || currentAddress.type === "IPv6"
							? "an"
							: "a";
					setFeedbackMessage(
						`Correct! This is ${article} ${currentAddress.type} address.`,
					);
				}
			} else {
				if (currentAddress.type === "none") {
					let message = `Incorrect! This is an invalid ${currentAddress.invalidType || "address"}.`;
					if (currentAddress.invalidReason) {
						message += ` It ${currentAddress.invalidReason}.`;
					}
					setFeedbackMessage(message);
				} else {
					const article =
						currentAddress.type === "IPv4" || currentAddress.type === "IPv6"
							? "an"
							: "a";
					setFeedbackMessage(
						`Incorrect! This is ${article} ${currentAddress.type} address.`,
					);
				}
			}

			setShowFeedback(true);
		},
		[
			currentAddress,
			showFeedback,
			scoreManager,
			updateStreakDisplay,
			updateScoreButton,
		],
	);

	const handleNextQuestion = useCallback(() => {
		generateNewQuestion();
	}, [generateNewQuestion]);

	// Initialize first question
	useEffect(() => {
		generateNewQuestion();
		updateStreakDisplay();
		updateScoreButton();
	}, [generateNewQuestion, updateStreakDisplay, updateScoreButton]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (showFeedback) {
				if (event.key === "Enter" || event.key === " ") {
					handleNextQuestion();
					return;
				}
			}

			const key = event.key;
			if (key === "1") {
				handleAnswer("IPv4");
			} else if (key === "2") {
				handleAnswer("IPv6");
			} else if (key === "3") {
				handleAnswer("MAC");
			} else if (key === "4") {
				handleAnswer("none");
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [showFeedback, handleAnswer, handleNextQuestion]);

	if (!currentAddress) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-xl">Loading question...</div>
			</div>
		);
	}

	return (
		<>
			<button
				onClick={() => setShowScoreModal(true)}
				className="fixed top-5 right-8 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 z-10 max-w-xs text-sm whitespace-nowrap overflow-hidden text-ellipsis"
				type="button"
			>
				📊 {scoreText}
			</button>

			{/* Main Content */}
			<div className="bg-white rounded-b-xl p-6">
				<div className=" mx-auto">
					{/* Quiz Section */}
					<div className="bg-gray-50 rounded-lg p-6 mb-8 border-l-4 border-green-500">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">
							IP or MAC?
						</h2>

						{/* Streak Display */}
						<div className="text-center text-lg mb-6 font-semibold text-gray-700 p-3 bg-gray-100 rounded-lg border-2 border-gray-200">
							Current streak:{" "}
							<span className="text-yellow-600">{streakEmojis}</span> ({streak})
						</div>

						{/* Address Display */}
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-8 px-6 rounded-xl mb-6 font-mono text-3xl font-semibold tracking-wider border-4 border-indigo-600 shadow-lg break-all">
							{currentAddress.address}
						</div>

						{/* Options */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							{[
								{ type: "IPv4" as AddressType, shortcut: "1", label: "IPv4" },
								{ type: "IPv6" as AddressType, shortcut: "2", label: "IPv6" },
								{ type: "MAC" as AddressType, shortcut: "3", label: "MAC" },
								{ type: "none" as AddressType, shortcut: "4", label: "None" },
							].map(({ type, shortcut, label }) => (
								<button
									key={type}
									onClick={() => handleAnswer(type)}
									disabled={showFeedback}
									type="button"
									className={cn(
										"relative py-4 px-12 text-lg font-semibold rounded-lg border-2 transition-all duration-200 min-h-[60px] flex items-center justify-center shadow-sm",
										!showFeedback &&
											"hover:transform hover:-translate-y-1 hover:shadow-md",
										showFeedback &&
											selectedAnswer === type &&
											isCorrect &&
											"bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg",
										showFeedback &&
											selectedAnswer === type &&
											!isCorrect &&
											"bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-lg",
										showFeedback &&
											type === currentAddress.type &&
											selectedAnswer !== type &&
											"bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg",
										!showFeedback &&
											"bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:border-indigo-600",
										showFeedback && "cursor-not-allowed opacity-60",
									)}
								>
									<span
										className={cn(
											"absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm",
											showFeedback &&
												selectedAnswer === type &&
												isCorrect &&
												"bg-white text-green-600",
											showFeedback &&
												selectedAnswer === type &&
												!isCorrect &&
												"bg-white text-red-600",
											showFeedback &&
												type === currentAddress.type &&
												selectedAnswer !== type &&
												"bg-white text-green-600",
											!showFeedback && "bg-indigo-500 text-white",
										)}
									>
										{shortcut}
									</span>
									{label}
								</button>
							))}
						</div>

						{/* Feedback */}
						{showFeedback && (
							<div
								className={cn(
									"p-5 rounded-lg mb-6 text-center font-semibold",
									isCorrect
										? "bg-green-100 text-green-900 border border-green-300"
										: "bg-red-100 text-red-900 border border-red-300",
								)}
							>
								{feedbackMessage}
							</div>
						)}

						{/* Next Button */}
						{showFeedback && (
							<div className="text-center">
								<button
									onClick={handleNextQuestion}
									className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
									type="button"
								>
									Next Question
								</button>
							</div>
						)}
					</div>

					{/* Help Section */}
					<div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
						<h2 className="text-xl font-semibold mb-4 text-gray-800">
							Need Help?
						</h2>
						<button
							onClick={() => setShowHints(!showHints)}
							className="px-6 py-3 bg-gradient-to-r bg-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
							type="button"
						>
							{showHints ? "Hide" : "Show"} Address Format Rules
						</button>
						<HintPanel isVisible={showHints} />
					</div>
				</div>
			</div>

			{/* Score Modal */}
			<ScoreModal
				isOpen={showScoreModal}
				onClose={() => setShowScoreModal(false)}
				scoreManager={scoreManager}
			/>
		</>
	);
}
