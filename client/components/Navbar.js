'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🧬</span>
          <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-900' : 'text-indigo-900'} tracking-tight`}>
            Heredity
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            How It Works
          </a>
          <a href="#why-us" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Why Us
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="px-5 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
