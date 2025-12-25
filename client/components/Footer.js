'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🧬</span>
              <span className="text-2xl font-bold text-white">Heredity</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Empowering families to understand their health history through advanced genetic visualization and risk assessment.
            </p>
            <div className="flex space-x-4">
              {/* Social Placeholders */}
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <span className="text-lg">𝕏</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <span className="text-lg">in</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                <span className="text-lg">IG</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Product</h4>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="text-xl">📍</span>
                <span>Rajendra Nagar<br />Khandwa Road, Indore</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <span>+91 9479601267</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-xl">✉️</span>
                <a href="mailto:support@heredity.app" className="hover:text-indigo-400 transition-colors">
                  support@heredity.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Email Query Section */}
        <div className="border-t border-gray-800 pt-12 pb-8">
          <div className="bg-gray-800/50 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Have specific questions?</h3>
            <p className="text-gray-400 mb-6">
              For any detailed queries or partnership opportunities, please don't hesitate to reach out directly via email.
              We typically respond within 24 hours.
            </p>
            <a 
              href="mailto:queries@heredity.app"
              className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-semibold text-lg transition-colors"
            >
              <span>Send us an email at queries@heredity.app</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Heredity Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
