'use client'
export default function Dashboard() {
	return (
		<>
			<div className="container mx-auto p-6">
				{/* <!-- Header --> */}
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
					<p className="text-gray-600 mt-2">
						Welcome back, <span className="font-semibold">John Doe</span>!
						Here's an overview of your activities.
					</p>
				</header>

				{/* <!-- Dashboard Stats --> */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-lg font-semibold text-gray-800">
							Documents Processed
						</h2>
						<p className="text-4xl font-bold text-blue-500 mt-4">120</p>
						<p className="text-sm text-gray-500">This Month</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-lg font-semibold text-gray-800">
							Pending Reviews
						</h2>
						<p className="text-4xl font-bold text-red-500 mt-4">8</p>
						<p className="text-sm text-gray-500">Requires Your Attention</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-lg font-semibold text-gray-800">
							Reports Generated
						</h2>
						<p className="text-4xl font-bold text-green-500 mt-4">15</p>
						<p className="text-sm text-gray-500">Last 7 Days</p>
					</div>
				</section>

				{/* <!-- Recent Activity --> */}
				<section className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Recent Activities
					</h2>
					<ul id="recent-activities" className="bg-white rounded-lg shadow p-6">
						{/* <!-- Recent activities will be dynamically loaded here --> */}
					</ul>
				</section>

				{/* <!-- Graphs Section --> */}
				<section>
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Activity Overview
					</h2>
					<div id="chart-container" className="bg-white rounded-lg shadow p-6">
						{/* <!-- Chart will be dynamically rendered here --> */}
					</div>
				</section>
			</div>
		</>
	);
}
