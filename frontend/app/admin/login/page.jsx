"use client";
import { useState, useMemo } from "react";
import { Eye, EyeOff, Shield, Zap } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Generate fog particle styles once (prevents hydration mismatch)
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 100 + 50 + "px",
      height: Math.random() * 100 + 50 + "px",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      animationDelay: Math.random() * 4 + "s",
      animationDuration: Math.random() * 3 + 2 + "s",
    }));
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://fog-game.onrender.com/api/admin/adminLogin",
        { email, password }
      );

      if (res.data.success) {
        setSuccess("Login successful!");
        localStorage.setItem("adminToken", res.data.token);
        window.location.href = "/admin"; // redirect to admin dashboard
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ✅ Animated fog particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute bg-white bg-opacity-30 rounded-full animate-pulse"
            style={style}
          />
        ))}
      </div>

      {/* Floating tactical elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-bounce">
        <Shield size={32} className="text-gray-400" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 animate-pulse">
        <Zap size={28} className="text-gray-400" />
      </div>

      {/* Main login container */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 transform transition-all duration-1000 animate-in slide-in-from-top">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
            <Shield size={32} className="text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
            COMMAND CENTER
          </h1>
          <p className="text-gray-600 text-sm uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 transform transition-all duration-1000 animate-in slide-in-from-bottom">
          <div className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none ${
                  focusedField === "email"
                    ? "border-gray-400 shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="commander@fogofwar.com"
                required
              />
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-300 ${
                  focusedField === "email" ? "w-full" : "w-0"
                }`}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Security Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all duration-300 bg-gray-50 focus:bg-white focus:outline-none ${
                    focusedField === "password"
                      ? "border-gray-400 shadow-lg transform scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-300 ${
                  focusedField === "password" ? "w-full" : "w-0"
                }`}
              />
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-semibold text-white uppercase tracking-widest transition-all duration-300 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Accessing...</span>
                </div>
              ) : (
                "INITIATE ACCESS"
              )}
            </button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-center mt-2">{success}</p>
            )}
          </div>

          {/* Additional elements */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center uppercase tracking-wider">
              Secure Connection Established
            </p>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: i * 0.2 + "s" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 transform transition-all duration-1000 animate-in slide-in-from-bottom delay-500">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Strategic Operations Division
          </p>
        </div>
      </div>

      {/* Dynamic background elements */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .slide-in-from-top {
          animation-delay: 0.3s;
        }

        .slide-in-from-bottom {
          animation-delay: 0.6s;
        }

        .delay-500 {
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  );
}
