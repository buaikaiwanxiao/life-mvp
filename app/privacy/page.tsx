import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-neutral-500 mb-12">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-neutral max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Our Commitment</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  At Life, we take your privacy seriously. Your lab data, protocols, and materials are yours.
                  We are committed to protecting your information and ensuring you maintain full control over your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">What We Collect</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  When you submit materials through our platform, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                  <li>Contact information (email address, organization, role)</li>
                  <li>Files, documents, and media you upload</li>
                  <li>Text content you paste into our forms</li>
                  <li>Links you provide to external resources</li>
                  <li>Notes and instructions about your submission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">How We Use Your Data</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  We use your submitted materials solely to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                  <li>Review and structure your lab knowledge into SOPs and experience cards</li>
                  <li>Create personalized templates based on your workflow</li>
                  <li>Communicate with you about your submission and deliverables</li>
                  <li>Improve our service based on aggregated, anonymized feedback</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-4">
                  <strong>We will never:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                  <li>Share your data with third parties without your explicit consent</li>
                  <li>Sell your information to anyone</li>
                  <li>Train machine learning models on your materials without permission</li>
                  <li>Use your data for purposes other than providing our service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Data Storage and Security</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Your data is stored securely using industry-standard encryption and access controls.
                  We use Supabase for our database and file storage, which provides enterprise-grade security
                  and compliance with data protection regulations.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  Access to your submission data is restricted to authorized team members who need it to
                  provide our service. All file storage is private by default.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Your Rights</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                  <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                  <li><strong>Correction:</strong> Request corrections to any inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data at any time</li>
                  <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Withdraw consent for any data processing activities</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-4">
                  To exercise any of these rights, contact us at{' '}
                  <a href="mailto:privacy@life-app.com" className="text-primary-600 hover:text-primary-700 font-medium">
                    privacy@life-app.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Data Retention</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We retain your submitted materials for the duration necessary to provide our service and
                  fulfill the purposes outlined in this policy. You may request deletion of your data at any time,
                  and we will promptly remove all associated information from our systems.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Changes to This Policy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any material changes
                  by email or through a prominent notice on our website. Your continued use of our service after
                  such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Contact Us</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you have questions or concerns about this privacy policy or our data practices, please contact us:
                </p>
                <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                  <p className="text-neutral-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@life-app.com" className="text-primary-600 hover:text-primary-700 font-medium">
                      privacy@life-app.com
                    </a>
                  </p>
                  <p className="text-neutral-700 mt-2">
                    <strong>General inquiries:</strong>{' '}
                    <a href="mailto:contact@life-app.com" className="text-primary-600 hover:text-primary-700 font-medium">
                      contact@life-app.com
                    </a>
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-200">
              <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
