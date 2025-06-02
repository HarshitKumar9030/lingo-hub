"use client";

import { signIn, signUp, getProviders } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Chrome,
  Slack,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  const handleOAuthSignIn = async (providerId: string) => {
    setLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };
  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || (isSignUp && !formData.name)) {
      setError("Please fill in all fields");
      return;
    }

    setLoading("credentials");

    try {
      if (isSignUp) {
        // First create the account
        await signUp(formData.name, formData.email, formData.password);
        // Then sign in with the new credentials
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/",
        });
      } else {
        // Direct sign in
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/",
        });
      }
    } catch (error: any) {
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return <Chrome className="w-4 h-4" />;
      case "slack":
        return <Slack className="w-4 h-4" />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen flex bg-[#fafafa] dark:bg-[#191919]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white dark:bg-[#1a1a1a] relative overflow-hidden border-r border-[#e5e5e5] dark:border-[#333]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e5e5 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-[#1a1a1a] dark:text-[#e5e5e5]">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white dark:text-[#1a1a1a]" />
            </div>
            <span className="text-3xl font-semibold">LingoHub</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Transform how you learn languages
          </h1>

          <p className="text-xl text-[#888] leading-relaxed mb-8 max-w-md">
            Immerse yourself in AI-powered stories that make vocabulary stick
            naturally. Learn at your own pace, anytime, anywhere.
          </p>

          <div className="flex items-center space-x-6 text-[#888]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-full" />
              <span className="text-sm">500+ Interactive Stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-full" />
              <span className="text-sm">25+ Languages</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#fafafa] dark:bg-[#191919] p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white dark:text-[#1a1a1a]" />
              </div>
              <span className="text-2xl font-semibold text-[#1a1a1a] dark:text-[#e5e5e5]">
                LingoHub
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#333] rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] dark:text-[#e5e5e5] mb-2">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-[#888]">
                {isSignUp
                  ? "Start your language learning journey today"
                  : "Continue your learning adventure"}
              </p>
            </div>
            {providers && (
              <div className="space-y-3 mb-6">
                {Object.values(providers)
                  .filter((provider: any) => provider.id !== "credentials")
                  .map((provider: any) => (
                    <Button
                      key={provider.name}
                      variant="outline"
                      className="w-full h-11 border border-[#e5e5e5] dark:border-[#333] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] transition-all duration-200 text-[#1a1a1a] dark:text-[#e5e5e5]"
                      onClick={() => handleOAuthSignIn(provider.id)}
                      disabled={loading === provider.id}
                    >
                      {loading === provider.id ? (
                        <div className="w-4 h-4 border-2 border-[#888] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {getProviderIcon(provider.id)}
                          <span className="ml-2 font-medium">
                            Continue with {provider.name}
                          </span>
                        </>
                      )}
                    </Button>
                  ))}
              </div>
            )}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5] dark:border-[#333]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-[#1a1a1a] text-[#888]">
                  or continue with email
                </span>
              </div>
            </div>
            <form onSubmit={handleCredentialAuth} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888]" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-[#e5e5e5] dark:border-[#333] rounded-lg bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-[#e5e5e5] focus:border-transparent transition-all duration-200 text-[#1a1a1a] dark:text-[#e5e5e5] placeholder-[#888]"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888]" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-[#e5e5e5] dark:border-[#333] rounded-lg bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-[#e5e5e5] focus:border-transparent transition-all duration-200 text-[#1a1a1a] dark:text-[#e5e5e5] placeholder-[#888]"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#888]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-12 py-3 border border-[#e5e5e5] dark:border-[#333] rounded-lg bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] dark:focus:ring-[#e5e5e5] focus:border-transparent transition-all duration-200 text-[#1a1a1a] dark:text-[#e5e5e5] placeholder-[#888]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>{" "}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-[#1a1a1a] hover:bg-[#333] dark:bg-[#e5e5e5] dark:hover:bg-[#d0d0d0] text-white dark:text-[#1a1a1a] font-medium rounded-lg transition-all duration-200"
                disabled={loading === "credentials"}
              >
                {loading === "credentials" ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>{" "}
            {/* Toggle Sign Up/Sign In */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-sm text-[#1a1a1a] hover:text-[#888] dark:text-[#e5e5e5] dark:hover:text-[#888] font-medium transition-colors duration-200"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
            {/* Terms */}
            <div className="text-center text-xs text-[#888] mt-6">
              <p>
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors duration-200"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
