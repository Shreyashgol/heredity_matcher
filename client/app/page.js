'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <span className="text-4xl">🧬</span>
            <h1 className="text-2xl font-bold text-indigo-900">Heredity</h1>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Visualize Your Family's
            <span className="text-indigo-600"> Health History</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Build interactive family trees, track medical conditions, and calculate genetic risks
            using advanced data science. Know your health future before it arrives.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg text-lg font-semibold"
            >
              Start Building Your Tree
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg text-lg font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Build Family Trees
            </h3>
            <p className="text-gray-600">
              Create detailed family trees with unlimited generations. Add parents, children,
              and extended family members with ease.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Track Health Conditions
            </h3>
            <p className="text-gray-600">
              Document medical conditions across generations. From diabetes to heart disease,
              keep a comprehensive health record.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Calculate Genetic Risk
            </h3>
            <p className="text-gray-600">
              Get statistical probability of inheriting conditions based on family history.
              Make informed health decisions.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">Create your free account in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Add Family</h4>
              <p className="text-gray-600 text-sm">Build your family tree with relatives</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Tag Conditions</h4>
              <p className="text-gray-600 text-sm">Add health conditions to family members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">View Insights</h4>
              <p className="text-gray-600 text-sm">Get risk analysis and visual tree</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Heredity?</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start space-x-3 bg-white p-6 rounded-lg shadow">
              <span className="text-2xl">🔒</span>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-1">Privacy First</h4>
                <p className="text-gray-600 text-sm">Your data stays private. No sharing with third parties.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-6 rounded-lg shadow">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-1">Accurate Predictions</h4>
                <p className="text-gray-600 text-sm">Based on proven genetic inheritance models.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-6 rounded-lg shadow">
              <span className="text-2xl">💡</span>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-1">Easy to Use</h4>
                <p className="text-gray-600 text-sm">Intuitive interface that anyone can navigate.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white p-6 rounded-lg shadow">
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <h4 className="font-semibold text-lg mb-1">Always Accessible</h4>
                <p className="text-gray-600 text-sm">Access your family tree from any device.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families taking control of their health future
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg font-semibold"
          >
            Create Free Account
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-600">
          <p className="text-sm">
            Built with Next.js, PostgreSQL Recursive CTEs, and React Flow
          </p>
          <p className="text-xs mt-2">
            © 2024 Heredity. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
