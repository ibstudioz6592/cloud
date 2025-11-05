"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "./background-beams";
import { FaLinkedin, FaTwitter, FaGithub, FaLock } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (!isClient) return null;

  const footerLinks = [
    { icon: <FaLinkedin className="h-6 w-6" />, href: "https://www.linkedin.com/in/ankitnayaketh/" },
    { icon: <FaTwitter className="h-6 w-6" />, href: "https://x.com/AnkitNayak_eth" },
    { icon: <FaGithub className="h-6 w-6" />, href: "https://github.com/AnkitNayak-eth" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 relative font-mono py-12">
      <div className="absolute top-0 right-0 z-30 p-4">
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="w-full z-20 max-w-6xl p-4">
        <h1 className="text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold mb-4">
          AJ STUDIOZ
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg text-center mb-12">
          Advanced Secure File Storage & Document Verification System
        </p>
        
        <div className="flex flex-col items-center space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-indigo-500 transition">
              <div className="text-indigo-500 text-4xl mb-4">🔒</div>
              <h3 className="text-white font-semibold text-lg mb-2">Secure Storage</h3>
              <p className="text-neutral-400 text-sm">Military-grade encrypted file storage</p>
            </div>
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-purple-500 transition">
              <div className="text-purple-500 text-4xl mb-4">📱</div>
              <h3 className="text-white font-semibold text-lg mb-2">QR Verification</h3>
              <p className="text-neutral-400 text-sm">Instant document verification</p>
            </div>
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-pink-500 transition">
              <div className="text-pink-500 text-4xl mb-4">☁️</div>
              <h3 className="text-white font-semibold text-lg mb-2">Cloud Management</h3>
              <p className="text-neutral-400 text-sm">5GB free storage</p>
            </div>
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-green-500 transition">
              <div className="text-green-500 text-4xl mb-4">⚡</div>
              <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-neutral-400 text-sm">Up to 100MB per file</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-indigo-500/50 rounded-2xl p-12 w-full max-w-3xl">
            <div className="flex items-center justify-center mb-6">
              <FaLock className="text-indigo-400 text-6xl" />
            </div>
            <h2 className="text-white text-3xl font-bold text-center mb-4">Authentication Required</h2>
            <p className="text-neutral-300 text-center mb-8 text-lg">
              Sign up or log in to access file storage, QR verification, and document management with ID card generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition shadow-lg text-center">
                🚀 Create Free Account
              </Link>
              <Link href="/login" className="px-10 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg transition shadow-lg text-center">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-row mt-12 items-center justify-center gap-8">
          {footerLinks.map((link, index) => (
            <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-white transform hover:scale-150 transition-transform duration-300">
              {link.icon}
            </a>
          ))}
        </nav>
      </div>

      <BackgroundBeams />
    </div>
  );
}
