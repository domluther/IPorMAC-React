import { SiteNavigation } from "./SiteNavigation";

export function Header() {
	return (
		<header className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 text-center relative">
			<SiteNavigation />
			<h1 className="text-4xl font-bold mb-2 text-shadow">
				🦆 Network Address Practice 🦆
			</h1>
			<p className="text-indigo-100 text-lg">
				Master the identification of IPv4, IPv6, and MAC addresses
			</p>
		</header>
	);
}
