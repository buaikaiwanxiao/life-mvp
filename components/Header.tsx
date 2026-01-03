import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
            Life
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="/#how-it-works" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              How It Works
            </Link>
            <Link href="/submit" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
