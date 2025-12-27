import Link from "next/link"; // Next.js Link use করুন

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center px-4">
        <h1 className="text-6xl lg:text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-white/70 mb-8 text-lg">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-theme-50 to-theme-100 text-theme-900 font-bold text-lg hover:opacity-90 transition-opacity">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}