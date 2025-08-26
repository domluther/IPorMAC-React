import type { HintItem } from "@/components/reusable/GenericHintPanel";

/**
 * Network Address Practice specific hint data
 * Define the help content for IPv4, IPv6, and MAC addresses
 */
export const NETWORK_ADDRESS_HINTS: HintItem[] = [
	{
		title: "IPv4",
		description: "4 decimal numbers (0-255) separated by dots",
		examples: ["Example: 192.168.1.1"],
		color: "blue",
	},
	{
		title: "IPv6", 
		description: "8 groups of 4 hex digits separated by colons. Groups can be empty or compressed.",
		examples: [
			"Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
			"Compressed: 2001:db8::8a2e:370:7334"
		],
		color: "purple",
	},
	{
		title: "MAC",
		description: "6 pairs of hex digits separated by colons or dashes",
		examples: ["Example: 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E"],
		color: "green",
	},
];
