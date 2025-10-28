export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Welcome to PunchCard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Routes */}
          <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl border border-gray-200/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Routes</h2>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">/join/[programId]</code>
                <p className="text-gray-600 mt-1">Customer onboarding via QR scan</p>
              </div>
              <div>
                <code className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">/card/[cardId]</code>
                <p className="text-gray-600 mt-1">Card page with download options</p>
              </div>
              <div>
                <code className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">/dashboard</code>
                <p className="text-gray-600 mt-1">Customer dashboard with cards</p>
              </div>
            </div>
          </div>

          {/* Auth Routes */}
          <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl border border-gray-200/60 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Auth Routes</h2>
            <div className="space-y-3 text-sm">
              <div>
                <code className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">/login</code>
                <p className="text-gray-600 mt-1">Universal login (role-based redirect)</p>
              </div>
              <div>
                <code className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">/signup</code>
                <p className="text-gray-600 mt-1">Universal signup</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Flow</h3>
            <p className="text-sm text-gray-600">
              Scan QR → Join Program → View Card → Download to Wallet
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
