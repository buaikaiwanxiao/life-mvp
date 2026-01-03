import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Life</h3>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
              Transform tacit lab knowledge into reusable SOPs and experience cards.
              Private-by-default, evidence-linked, and searchable.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:contact@life-app.com" className="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-neutral-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
