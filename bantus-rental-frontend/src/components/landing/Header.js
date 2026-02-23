"use client";

import Link from "next/link";
import { FeaturesDropdown } from "./FeaturesDropdown";

export const Header = () => {
  return (
    <header className="bg-[#3A2A1A] text-white shadow-md relative z-50">
      <nav className="flex h-20 w-full items-center px-8 lg:px-12">
        
        {/* Extreme LEFT: Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/bantus-logo-white.svg"
            alt="Bantus Rental"
            className="h-20 w-auto"
          />
        </Link>

        {/* Push everything else to the right */}
        <div className="flex-1" />

        {/* Features + About */}
        <div className="flex items-center gap-x-8 mr-8">

          {/* --- THIS IS THE CORRECTED DROPDOWN --- */}
          {/* We add the `group` class here */}
          <div className="relative group">
            {/* The trigger for the hover */}
            <span className="cursor-pointer text-base font-semibold hover:text-orange-400 flex items-center">
              Features
              <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>

            {/* The FeaturesDropdown will now be controlled by the parent's group-hover state */}
            <FeaturesDropdown />
          </div>
          
          {/* About Link */}
          <Link href="/#about" className="text-base font-semibold hover:text-orange-400">
            About
          </Link>
          
        </div>

        {/* Extreme RIGHT: Auth buttons */}
        <div className="flex items-center gap-x-4">
          <Link
            href="/login"
            className="rounded-md border border-white/60 px-5 py-2.5 text-base font-semibold hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-orange-500 px-6 py-2.5 text-base font-semibold text-white hover:bg-orange-600"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};
