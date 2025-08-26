import { X } from "lucide-react";
import { useEffect } from "react";
import type { ScoreManager } from "@/lib/scoreManager";
import { cn } from "@/lib/utils";

interface ScoreModalProps {
	isOpen: boolean;
	onClose: () => void;
	scoreManager: ScoreManager;
}

export function ScoreModal({ isOpen, onClose, scoreManager }: ScoreModalProps) {
	// Handle Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const overallStats = scoreManager.getOverallStats();
	const typeStats = scoreManager.getScoresByType();

	const handleResetScores = () => {
		if (
			confirm(
				"Are you sure you want to reset all scores? This cannot be undone.",
			)
		) {
			scoreManager.resetAllScores();
			window.location.reload(); // Refresh to update all displays
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						🏆 Your Progress
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-white hover:text-gray-200 transition-colors text-2xl w-8 h-8 flex items-center justify-center"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
					{overallStats.totalAttempts > 0 ? (
						<div className="space-y-6">
							{/* Level Info */}
							<div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-5 text-white">
								<div className="flex items-center gap-4">
									<div className="text-5xl animate-gentle-bounce">
										{overallStats.level.emoji}
									</div>
									<div className="flex-1 text-left">
										<h3 className="text-2xl font-bold">
											{overallStats.level.title}
										</h3>
										<p className="text-indigo-100 mt-1">
											{overallStats.level.description}
										</p>
									</div>
								</div>

								{overallStats.nextLevel ? (
									<div className="mt-4">
										<div className="flex justify-between items-center mb-2 text-sm font-semibold">
											<span>Progress to {overallStats.nextLevel.title}</span>
											<span>{Math.round(overallStats.progress)}%</span>
										</div>
										<div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden mb-3">
											<div
												className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300"
												style={{ width: `${overallStats.progress}%` }}
											/>
										</div>
										{/* Detailed requirements */}
										<div className="text-sm text-indigo-100 space-y-1">
											{overallStats.totalPoints <
												overallStats.nextLevel.minPoints && (
												<div>
													📊{" "}
													{overallStats.nextLevel.minPoints -
														overallStats.totalPoints}{" "}
													more points needed ({overallStats.totalPoints}/
													{overallStats.nextLevel.minPoints})
												</div>
											)}
											{overallStats.accuracy <
												overallStats.nextLevel.minAccuracy && (
												<div>
													🎯 {Math.round(overallStats.nextLevel.minAccuracy)}%
													accuracy required (currently{" "}
													{Math.round(overallStats.accuracy)}%)
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="mt-4 text-center">
										<div className="bg-white bg-opacity-20 rounded-lg p-3">
											<p className="font-semibold text-lg">
												🎉 Maximum Level Reached!
											</p>
											<p className="text-sm text-indigo-100">
												You&apos;re the ultimate network address master!
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Overall Statistics */}
							<div>
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									📈 Overall Statistics
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="bg-blue-50 rounded-lg p-4 text-center border-l-4 border-blue-500">
										<div className="text-2xl font-bold text-blue-600">
											{overallStats.totalAttempts}
										</div>
										<div className="text-sm text-gray-600">Total Attempts</div>
									</div>
									<div className="bg-green-50 rounded-lg p-4 text-center border-l-4 border-green-500">
										<div className="text-2xl font-bold text-green-600">
											{overallStats.totalCorrect}
										</div>
										<div className="text-sm text-gray-600">Correct</div>
									</div>
									<div className="bg-purple-50 rounded-lg p-4 text-center border-l-4 border-purple-500">
										<div className="text-2xl font-bold text-purple-600">
											{Math.round(overallStats.accuracy)}%
										</div>
										<div className="text-sm text-gray-600">Accuracy</div>
									</div>
									<div className="bg-yellow-50 rounded-lg p-4 text-center border-l-4 border-yellow-500">
										<div className="text-2xl font-bold text-yellow-600">
											{overallStats.totalPoints}
										</div>
										<div className="text-sm text-gray-600">Points</div>
									</div>
								</div>
							</div>

							{/* Breakdown by Address Type */}
							<div>
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									📋 Breakdown by Address Type
								</h3>
								<div className="space-y-3">
									{Object.entries(typeStats).map(([type, stats]) => (
										<div
											key={type}
											className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
										>
											<div>
												<div className="font-semibold text-lg">
													{type === "none" ? "Invalid Addresses" : type}
												</div>
												<div className="text-sm text-gray-600">
													{stats.correct} correct out of {stats.attempts}{" "}
													attempts
												</div>
											</div>
											<div className="text-right">
												<div
													className={cn(
														"text-2xl font-bold",
														stats.accuracy >= 80
															? "text-green-600"
															: stats.accuracy >= 60
																? "text-yellow-600"
																: "text-red-600",
													)}
												>
													{Math.round(stats.accuracy)}%
												</div>
												<div className="text-xs text-gray-500">accuracy</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🦆</div>
							<p className="text-xl text-gray-600 mb-2">
								No scores recorded yet
							</p>
							<p className="text-gray-500">
								Start practicing to see your progress!
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 bg-gray-50 flex justify-between items-center gap-4">
					<button
						type="button"
						onClick={handleResetScores}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
					>
						Reset All Scores
					</button>
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
