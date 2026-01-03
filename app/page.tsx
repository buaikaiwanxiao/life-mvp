import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-neutral-50 to-white py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                Turn Tacit Lab Knowledge into Reusable SOPs
              </h1>
              <p className="text-xl text-neutral-600 leading-relaxed mb-4">
                Transform your lab experience into personalized templates and evidence-linked outputs.
              </p>
              <p className="text-lg text-neutral-500 leading-relaxed mb-10 max-w-3xl mx-auto">
                Searchable memory. Private by default. Designed for life scientists who value rigor and reproducibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/submit">
                  <Button size="lg" className="w-full sm:w-auto min-w-[240px]">
                    Start the 7-Day Challenge
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-16">
                Why Life?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Personalized Templates</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Your SOPs reflect your actual workflow, not generic best practices. Start from where you are.
                  </p>
                </div>

                <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Evidence-Linked Outputs</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Every recommendation traces back to your source materials. Full transparency, full control.
                  </p>
                </div>

                <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Searchable Memory</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Find that protocol tweak from 6 months ago. Your experience becomes institutional knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-6">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 text-center mb-16 max-w-3xl mx-auto">
                A simple three-step process to transform your raw lab materials into structured, reusable knowledge.
              </p>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Upload Your Materials</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Share your protocols, lab notebooks, audio recordings from experiments, or paste links to papers.
                      Any format, any structure. We handle the messy parts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">We Structure & Analyze</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Our team reviews your materials and structures them into templates tailored to your workflow.
                      Every insight is evidence-linked back to your source.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Receive Your Outputs</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Get personalized SOPs, protocol deltas, and experience cards you can search and reuse.
                      Your knowledge, now accessible and actionable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-16">
                What You Get
              </h2>

              <div className="space-y-8">
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Daily Summary Reports</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Concise overviews of your day&apos;s work, capturing key decisions, observations, and next steps.
                    Perfect for handoffs and continuity.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">SOP Deltas</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Track how your protocols evolve. See what changed, why it changed, and when.
                    Build living documentation that grows with your expertise.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Experience Cards</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Bite-sized insights from your work. Troubleshooting tips, optimization notes, and hard-won lessons,
                    all linked to the evidence and searchable by topic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-primary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Private by Default
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                Your data is yours. We never share, sell, or train models on your materials without explicit consent.
                Request deletion anytime. Full transparency, always.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-neutral-600 mb-10">
                Join the 7-day challenge and see how Life transforms your lab knowledge.
              </p>
              <Link href="/submit">
                <Button size="lg" className="min-w-[240px]">
                  Start the 7-Day Challenge
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
