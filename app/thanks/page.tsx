'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { Suspense } from 'react';

function ThanksContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('sid');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-neutral-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Submission Received
              </h1>

              {submissionId && (
                <p className="text-sm text-neutral-500 mb-6 font-mono">
                  Submission ID: {submissionId}
                </p>
              )}

              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                Thank you for sharing your materials with us. Our team will review your submission
                and structure it into personalized templates and experience cards.
              </p>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">What happens next?</h2>
                <ol className="space-y-3 text-neutral-700">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary-600">1.</span>
                    <span>We&apos;ll review your materials and identify key insights.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary-600">2.</span>
                    <span>Our team will structure them into reusable SOPs and experience cards.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary-600">3.</span>
                    <span>You&apos;ll receive your personalized outputs via email within 7 days.</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-3">
                <p className="text-neutral-600">
                  Questions? Contact us at{' '}
                  <a href="mailto:contact@life-app.com" className="text-primary-600 hover:text-primary-700 font-medium">
                    contact@life-app.com
                  </a>
                </p>

                <Link href="/">
                  <Button variant="outline" size="lg">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThanksContent />
    </Suspense>
  );
}
