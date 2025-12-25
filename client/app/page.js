'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              Now with AI Risk Analysis
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
              Visualize Your Family's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Health Legacy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Build interactive family trees, track medical conditions, and calculate genetic risks
              using advanced data science. Know your health future before it arrives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg font-bold"
              >
                Start Building Free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-full hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg text-lg font-bold"
              >
                View Live Demo
              </Link>
            </div>
          </div>
          
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-pink-200 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to track heredity
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful tools designed for medical accuracy and ease of use.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <span className="text-3xl group-hover:text-white transition-colors">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Interactive Trees
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Create detailed family trees with unlimited generations. Our recursive algorithm handles complex relationships seamlessly.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <span className="text-3xl group-hover:text-white transition-colors">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Medical Tracking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Document medical conditions across generations. From diabetes to heart disease, keep a comprehensive health record.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                  <span className="text-3xl group-hover:text-white transition-colors">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Risk Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get statistical probability of inheriting conditions based on family history using our proprietary algorithm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0"></div>

              {[
                { step: 1, title: 'Sign Up', desc: 'Create your secure account' },
                { step: 2, title: 'Add Family', desc: 'Build your tree structure' },
                { step: 3, title: 'Tag Health', desc: 'Add medical conditions' },
                { step: 4, title: 'Get Insights', desc: 'View risk analysis' },
              ].map((item) => (
                <div key={item.step} className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-indigo-50">
                    <span className="text-3xl font-bold text-indigo-600">{item.step}</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-gray-900">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="why-us" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="p-12 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-6">Why Choose Heredity?</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Privacy First</h4>
                      <p className="text-indigo-200 text-sm mt-1">Your genetic data is encrypted and stored locally. We never sell your data.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Scientific Accuracy</h4>
                      <p className="text-indigo-200 text-sm mt-1">Based on proven Mendelian inheritance models and statistical analysis.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-indigo-800 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">10k+</div>
                  <div className="text-indigo-200 mb-8">Families Analyzed</div>
                  
                  <div className="text-6xl font-bold text-white mb-2">99%</div>
                  <div className="text-indigo-200">User Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 md:p-20 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to decode your history?</h3>
                <p className="text-xl mb-10 text-indigo-100 max-w-2xl mx-auto">
                  Join thousands of families taking control of their health future today.
                  It's free to get started.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-12 py-5 bg-white text-indigo-600 rounded-full hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg font-bold"
                >
                  Create Free Account
                </Link>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
