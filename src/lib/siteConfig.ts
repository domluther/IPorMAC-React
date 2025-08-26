/** Configuration interface for GCSE CS practice sites */
export interface SiteConfig {
	/** Unique site identifier for score tracking */
	siteKey: string;
	/** Site title displayed in header */
	title: string;
	/** Site subtitle/description */
	subtitle: string;
	/** Site icon/emoji */
	icon: string;
	/** Primary color theme */
	primaryColor?: "blue" | "indigo" | "purple" | "green" | "red" | "yellow";
	/** Navigation menu data */
	navigation: NavMenuItem[];
	/** Scoring configuration */
	scoring: ScoringConfig;
}

export interface NavMenuItem {
	title: string;
	description: string;
	url: string;
	id: string;
	keywords: string[];
}

export interface ScoringConfig {
	/** Points awarded for correct answers */
	pointsPerCorrect: number;
	/** Points deducted for incorrect answers */
	pointsPerIncorrect: number;
	/** Custom level system (optional, falls back to duck levels) */
	customLevels?: Level[];
}

export interface Level {
	emoji: string;
	title: string;
	description: string;
	minPoints: number;
	minAccuracy: number;
}

/** Default GCSE CS site navigation menu */
export const DEFAULT_NAVIGATION: NavMenuItem[] = [
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
		title: "1.1 - Number Systems",
		description: "Binary, hex & denary conversions",
		url: "https://numbersystemsquiz.netlify.app/",
		id: "number-systems",
		keywords: ["numbersystemsquiz", "binary", "hex", "number"],
	},
	{
		title: "2.2 - Searching Algorithms",
		description: "Linear & binary search comparisons",
		url: "https://searchingalgorithmsquiz.netlify.app/",
		id: "searching-algorithms",
		keywords: ["searchingalgorithmsquiz", "search", "linear", "binary"],
	},
];

/** Example site configurations */
export const SITE_CONFIGS: Record<string, SiteConfig> = {
	"network-addresses": {
		siteKey: "network-addresses",
		title: "Network Address Practice",
		subtitle: "Master the identification of IPv4, IPv6, and MAC addresses",
		icon: "🦆",
		primaryColor: "indigo",
		navigation: DEFAULT_NAVIGATION,
		scoring: {
			pointsPerCorrect: 10,
			pointsPerIncorrect: -2,
		},
	},
	"data-units": {
		siteKey: "data-units",
		title: "Data Units Converter",
		subtitle: "Convert between bytes, KB, MB, GB and calculate file sizes",
		icon: "💾",
		primaryColor: "blue",
		navigation: DEFAULT_NAVIGATION,
		scoring: {
			pointsPerCorrect: 8,
			pointsPerIncorrect: -1,
		},
	},
	"sort-algorithms": {
		siteKey: "sort-algorithms",
		title: "Sorting Algorithm Visualizer",
		subtitle: "Learn and visualize bubble, merge, and insertion sorts",
		icon: "📊",
		primaryColor: "purple",
		navigation: DEFAULT_NAVIGATION,
		scoring: {
			pointsPerCorrect: 15,
			pointsPerIncorrect: -3,
		},
	},
	"number-systems": {
		siteKey: "number-systems",
		title: "Number Systems Quiz",
		subtitle: "Master binary, hexadecimal, and denary conversions",
		icon: "🔢",
		primaryColor: "green",
		navigation: DEFAULT_NAVIGATION,
		scoring: {
			pointsPerCorrect: 12,
			pointsPerIncorrect: -2,
		},
	},
};

/**
 * Get site configuration by key
 */
export function getSiteConfig(siteKey: string): SiteConfig {
	return SITE_CONFIGS[siteKey] || SITE_CONFIGS["network-addresses"];
}

/**
 * Detect current site from URL
 */
export function detectCurrentSite(): string {
	const hostname = window.location.hostname.toLowerCase();
	const url = window.location.href.toLowerCase();
	
	// Check each site's keywords
	for (const [siteKey, config] of Object.entries(SITE_CONFIGS)) {
		for (const navItem of config.navigation) {
			if (navItem.id === siteKey) {
				for (const keyword of navItem.keywords) {
					if (hostname.includes(keyword) || url.includes(keyword)) {
						return siteKey;
					}
				}
			}
		}
	}
	
	return "network-addresses"; // Default fallback
}
