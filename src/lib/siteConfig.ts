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
	/** Scoring configuration */
	scoring: ScoringConfig;
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

/** Example site configurations */
export const SITE_CONFIGS: Record<string, SiteConfig> = {
	"network-addresses": {
		siteKey: "network-addresses",
		title: "Network Address Practice",
		subtitle: "Master the identification of IPv4, IPv6, and MAC addresses",
		icon: "🦆",
		primaryColor: "indigo",
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
		scoring: {
			pointsPerCorrect: 8,
			pointsPerIncorrect: -1,
		},
	},
};

/**
 * Get site configuration by key
 */
export function getSiteConfig(siteKey: string): SiteConfig {
	return SITE_CONFIGS[siteKey] || SITE_CONFIGS["network-addresses"];
}
