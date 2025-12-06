"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react";

// The Modal component remains the same.
function Modal({ isOpen, onClose, title, message, isSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 text-center border">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-full text-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
            isSuccess ? "bg-gray-800 hover:bg-gray-700" : "bg-red-600 hover:bg-red-500"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  // ✨ 1. UPDATE: Add a callback to the modal state for actions on close.
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
    onCloseAction: null, // This will hold our navigation or form-switching logic.
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // ✨ 2. NEW: Create a handler that runs the action BEFORE closing the modal.
  const handleCloseModal = () => {
    if (modal.onCloseAction) {
      modal.onCloseAction(); // Run the stored action (e.g., navigate).
    }
    // Then, reset and close the modal.
    setModal({ isOpen: false, title: "", message: "", isSuccess: false, onCloseAction: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin
      ? "http://localhost:8000/api/userLogin"
      : "http://localhost:8000/api/userRegister";

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      // ✨ 3. FIX: Check `response.ok` for success instead of `res.token`.
      // This correctly handles both login and registration success.
      if (response.ok) {
        if (isLogin && res.token) {
          // --- Successful Login ---
          localStorage.setItem("token", res.token);
          localStorage.setItem("mongo_user_id", res.user.id);
          
          // Show the modal and set the navigation to happen only on close.
          setModal({
            isOpen: true,
            title: "Login Successful",
            message: "Welcome back! Taking you to the game...",
            isSuccess: true,
            onCloseAction: () => router.push("/game"), // The navigation is now a callback.
          });

        } else if (!isLogin) {
          // --- Successful Registration ---
          setModal({
            isOpen: true,
            title: "Registered Successfully",
            message: "Your account is created! Please log in to continue.",
            isSuccess: true,
            // As a bonus, we'll switch to the login form after they click OK.
            onCloseAction: () => setIsLogin(true),
          });
        }
      } else {
        // --- Handle Errors ---
        setModal({
          isOpen: true,
          title: "Error",
          message: res.message || "An unexpected error occurred.",
          isSuccess: false,
        });
      }

      setForm({ username: "", email: "", password: "" }); // Clear form fields.
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 text-gray-800 overflow-hidden flex items-center justify-center p-6">
      
      {/* ✨ 4. UPDATE: Pass the new close handler to the Modal component. */}
      <Modal 
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.title}
        message={modal.message}
        isSuccess={modal.isSuccess}
      />

      {/* --- The rest of your JSX remains the same --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-16 bg-white/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-12 bg-gray-200/40 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-20 bg-white/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-3xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>
      <div className="relative z-20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-md opacity-80"></div>
            </div>
            <span className="text-3xl font-bold text-gray-800">
              Fog Explorer
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Join the Adventure"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Continue your exploration through the mysterious lands"
              : "Begin your journey into the unknown territories"}
          </p>
        </div>
        <form
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
          <div className="relative z-10 space-y-6">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-900" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-900" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-900 hover:text-gray-900 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-900" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-900" />
                )}
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? "Enter the Fog" : "Begin Journey"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-gray-700 font-medium hover:text-gray-900 transition-colors hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in instead"}
          </button>
        </div>
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Fog Explorer Game. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}