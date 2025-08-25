import { cn } from "@/lib/utils";

interface HintPanelProps {
	isVisible: boolean;
}

export function HintPanel({ isVisible }: HintPanelProps) {
	if (!isVisible) return null;

	return (
		<div
			className={cn(
				"mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6",
				"transition-all duration-300 ease-in-out",
				isVisible
					? "opacity-100 max-h-96"
					: "opacity-0 max-h-0 overflow-hidden",
			)}
		>
			<h3 className="text-lg font-bold text-yellow-800 mb-4">
				📝 Address Format Rules:
			</h3>
			<ul className="space-y-4 text-gray-700">
				<li className="flex flex-col gap-1">
					<div className="font-semibold text-blue-700">IPv4:</div>
					<div className="text-sm">
						4 decimal numbers (0-255) separated by dots
					</div>
					<div className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 font-mono">
						Example: 192.168.1.1
					</div>
				</li>
				<li className="flex flex-col gap-1">
					<div className="font-semibold text-purple-700">IPv6:</div>
					<div className="text-sm">
						8 groups of 4 hex digits separated by colons. Groups can be empty or
						compressed.
					</div>
					<div className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 font-mono">
						Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
					</div>
					<div className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 font-mono">
						Compressed: 2001:db8::8a2e:370:7334
					</div>
				</li>
				<li className="flex flex-col gap-1">
					<div className="font-semibold text-green-700">MAC:</div>
					<div className="text-sm">
						6 pairs of hex digits separated by colons or dashes
					</div>
					<div className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 font-mono">
						Example: 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E
					</div>
				</li>
			</ul>
		</div>
	);
}
