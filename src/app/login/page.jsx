"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackgroundBeams } from "../background-beams";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBeams />
      
      <div className="w-full max-w-md z-10">
        <div className="bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-neutral-800">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
              Welcome Back
            </h1>
            <p className="text-neutral-400 mt-2">Sign in to AJ STUDIOZ</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900 text-neutral-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
          >
            <FaGoogle className="h-5 w-5" />
            Google
          </button>

          <p className="text-center text-neutral-400 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>

          <p className="text-center text-neutral-500 mt-4">
            <Link href="/" className="hover:text-neutral-300">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
