"use client";
import React, { useState, useEffect } from "react";
import { Lock, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const PasswordLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow" : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">SafePass</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Store your passwords securely.
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          SafePass keeps all your credentials safe and accessible across
          devices. No clutter, just security.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:text-indigo-600 transition"
          >
            Sign In
          </button>
        </div>

        {/* Features */}
        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-left">
          {[
            {
              icon: Lock,
              title: "Encrypted Storage",
              desc: "All your passwords are encrypted locally and in transit.",
            },
            {
              icon: Check,
              title: "Easy Access",
              desc: "Quickly access your passwords from any device.",
            },
            {
              icon: Lock,
              title: "Zero Knowledge",
              desc: "We never see your passwords—your data is yours alone.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="bg-indigo-100 p-3 rounded-full">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-24 py-12 border-t border-gray-200 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SafePass. Secure & Simple.
      </footer>
    </div>
  );
};

export default PasswordLanding;
