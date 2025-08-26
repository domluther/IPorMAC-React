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

/** Network Address Practice site configuration */
export const SITE_CONFIG: SiteConfig = {
	siteKey: "network-addresses",
	title: "Network Address Practice",
	subtitle: "Master the identification of IPv4, IPv6, and MAC addresses",
	icon: "🦆",
	scoring: {
		pointsPerCorrect: 10,
		pointsPerIncorrect: -2,
	},
};
