import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavMenuItem {
	title: string;
	description: string;
	url: string;
	id: string;
	keywords: string[];
}

const NAV_MENU_DATA: NavMenuItem[] = [
	{
		title: "1.2 - Data Units",
		description: "Convert units and calculate file sizes",
		url: "https://convertdataunits.netlify.app/",
		id: "data-units",
		keywords: ["convertdataunits", "data", "units"],
	},
	{
		title: "1.3 - Network Addresses",
		description: "Identify IP addresses and MAC addresses",
		url: "https://ipormac.netlify.app/",
		id: "network-addresses",
		keywords: ["ipormac", "network", "ip", "mac"],
	},
	{
		title: "2.1 - Sorting Algorithms",
		description: "Visualize bubble, merge & insertion sorts",
		url: "https://ocrsortvisualiser.netlify.app/",
		id: "sort-algorithms",
		keywords: ["ocrsortvisualiser", "sort", "algorithm"],
	},
	{
		title: "2.1 - Trace Tables",
		description: "Practice OCR ERL algorithm tracing",
		url: "https://tracetablepractice.netlify.app/",
		id: "trace-tables",
		keywords: ["tracetablepractice", "trace"],
	},
	{
		title: "2.2 - Programming Practice",
		description: "Input/output and basic programming concepts",
		url: "https://input-output-practice.netlify.app/",
		id: "programming-practice",
		keywords: ["input-output-practice", "programming"],
	},
	{
		title: "2.4 - Boolean Algebra",
		description: "Logic gates and Boolean expressions",
		url: "https://booleanalgebrapractice.netlify.app/",
		id: "boolean-algebra",
		keywords: ["booleanalgebrapractice", "boolean", "logic"],
	},
];

export function SiteNavigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);

	useEffect(() => {
		// Detect current site based on URL
		const hostname = window.location.hostname.toLowerCase();
		const foundSite = NAV_MENU_DATA.find((item) =>
			item.keywords.some((keyword) => hostname.includes(keyword)),
		);
		setCurrentSiteId(foundSite?.id || null);

		// Close dropdown when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".nav-dropdown")) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<nav className="nav-dropdown absolute top-5 left-8 z-50">
			<button
				type="button"
				className={cn(
					"nav-toggle flex items-center gap-2 px-4 py-2 rounded-lg",
					"bg-white/10 hover:bg-white/20 backdrop-blur-sm",
					"text-white font-medium transition-all duration-200",
					"border border-white/20 hover:border-white/30",
				)}
				onClick={() => setIsOpen(!isOpen)}
				aria-haspopup="true"
				aria-expanded={isOpen}
			>
				🎓 GCSE CS Tools
				<ChevronDown
					className={cn(
						"h-4 w-4 transition-transform duration-200",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
					<div className="nav-menu-header bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-3 font-semibold uppercase">
						Computer Science Practice
					</div>
					<div className="max-h-96 overflow-y-auto">
						{NAV_MENU_DATA.map((item) => (
							<a
								key={item.id}
								href={item.url}
								className={cn(
									"block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors",
									"group text-gray-800",
									currentSiteId === item.id &&
										"bg-indigo-50 border-l-4 border-l-indigo-500",
								)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className="font-bold group-hover:text-indigo-600 transition-colors">
									{item.title}
								</div>
								<div className="text-sm text-gray-600 mt-1">
									{item.description}
								</div>
								{currentSiteId === item.id && (
									<div className="text-xs text-indigo-600 mt-1 font-medium">
										Current Site
									</div>
								)}
							</a>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
