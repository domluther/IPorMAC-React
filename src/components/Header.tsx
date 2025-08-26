import type { ReactNode } from "react";
import { SiteNavigation } from "./SiteNavigation";

interface HeaderProps {
	scoreButton?: ReactNode;
	title: string;
	subtitle: string;
}

export function Header({ 
	scoreButton, 
	title,
	subtitle,
}: HeaderProps) {
	return (
		<header className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 text-center relative">
			<SiteNavigation />
			{scoreButton && (
				<div className="absolute top-3 right-3 xl:top-5 xl:right-8">
					{scoreButton}
				</div>
			)}
			<h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-2 text-shadow">
				{title}
			</h1>
			<p className="text-indigo-100 text-base xl:text-lg">
				{subtitle}
			</p>
		</header>
	);
}
