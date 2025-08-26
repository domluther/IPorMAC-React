import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 p-5 flex flex-col justify-center items-center">
				<div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
					<main className="p-0">
						<Outlet />
					</main>
					<footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 text-center p-4 text-sm border-t border-gray-600">
						Copyright{" "}
						<a
							href="https://mrluthercodes.netlify.app/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-300 hover:text-white underline"
						>
							Mr Luther
						</a>{" "}
						2025
					</footer>
				</div>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
