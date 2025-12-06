// app/not-found.js
"use client";

import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Themed card matching the UserProfile style */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 sm:p-12 border border-gray-200 shadow-xl transform transition-all duration-500 hover:scale-[1.02]">
          {/* Large, thematic icon */}
          <Compass className="mx-auto w-24 h-24 text-blue-500 mb-6 animate-pulse" />

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            404 - Lost in the Fog
          </h1>

          {/* Helper message */}
          <p className="text-lg text-gray-600 mb-8">
            It seems you&apos;ve wandered off the beaten path. The page you&apos;re looking for doesn&apos;t exist.
          </p>

          {/* Call-to-action button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Return to Safe Territory
          </Link>
        </div>
      </div>
    </div>
  );
}
