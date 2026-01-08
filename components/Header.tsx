'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#0F172A]">
              DP-GUILD
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${isActive('/') && !pathname.startsWith('/results') && !pathname.startsWith('/about') && !pathname.startsWith('/blog') ? 'text-[#0F172A] font-medium' : 'text-[#7F7F7F] hover:text-[#0F172A]'}`}
            >
              TOP
            </Link>
            <Link
              href="/results"
              className={`transition-colors ${isActive('/results') ? 'text-[#0F172A] font-medium' : 'text-[#7F7F7F] hover:text-[#0F172A]'}`}
            >
              実績・事例
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${isActive('/about') ? 'text-[#0F172A] font-medium' : 'text-[#7F7F7F] hover:text-[#0F172A]'}`}
            >
              会社概要
            </Link>
            <Link
              href="/blog"
              className={`transition-colors ${isActive('/blog') ? 'text-[#0F172A] font-medium' : 'text-[#7F7F7F] hover:text-[#0F172A]'}`}
            >
              ブログ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Desktop CTA */}
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-5 py-2 bg-[#0F172A] text-white rounded-md font-medium hover:bg-[#1e293b] transition-colors"
            >
              相談する
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#0F172A] p-2"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <span className="text-xl font-bold text-[#0F172A]">メニュー</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-[#0F172A] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-4">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/'
                      ? 'bg-gray-100 text-[#0F172A] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  TOP
                </Link>
              </li>

              <li>
                <Link
                  href="/results"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/results')
                      ? 'bg-gray-100 text-[#0F172A] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  実績・事例
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/about')
                      ? 'bg-gray-100 text-[#0F172A] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  会社概要
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/blog')
                      ? 'bg-gray-100 text-[#0F172A] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ブログ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive('/contact')
                      ? 'bg-gray-100 text-[#0F172A] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="p-6 border-t border-gray-100">
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#0F172A] text-white text-center rounded-lg font-medium hover:bg-[#1e293b] transition-all"
              onClick={() => setIsOpen(false)}
            >
              相談する
            </a>
            <p className="text-center text-gray-500 text-sm mt-3">
              まず30分、状況を整理
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
