'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [links, setLinks] = useState('');
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const acceptedFileTypes = [
    '.pdf', '.doc', '.docx', '.txt', '.md', '.csv',
    '.png', '.jpg', '.jpeg',
    '.wav', '.mp3',
    '.mp4', '.mov'
  ].join(',');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!consent) {
        setError('You must agree to the privacy policy to submit.');
        setIsSubmitting(false);
        return;
      }

      const linksArray = links
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          email,
          organization,
          role,
          notes,
          pasted_text: pastedText,
          links: linksArray,
          consent,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      if (files.length > 0) {
        for (const file of files) {
          const filePath = `${submission.id}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: fileRecordError } = await supabase
            .from('submission_files')
            .insert({
              submission_id: submission.id,
              filename: file.name,
              mime_type: file.type,
              size: file.size,
              storage_path: filePath,
            });

          if (fileRecordError) throw fileRecordError;
        }
      }

      router.push(`/thanks?sid=${submission.id}`);
    } catch (err) {
      console.error('Submission error:', err);
      setError('There was an error submitting your materials. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Submit Your Materials
              </h1>
              <p className="text-lg text-neutral-600">
                Share your lab materials and let us transform them into reusable knowledge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Contact Information</h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-neutral-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      placeholder="Your university or company"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      placeholder="e.g., Research Scientist, PhD Student"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Your Materials</h2>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-2">
                    What should we focus on?
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
                    placeholder="Tell us what aspects of your work you'd like structured..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                    <svg className="w-12 h-12 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-neutral-600 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      PDF, DOC, TXT, MD, CSV, images, audio, or video files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept={acceptedFileTypes}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                        Select Files
                      </Button>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                              <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="pastedText" className="block text-sm font-medium text-neutral-700 mb-2">
                    Paste Text
                  </label>
                  <textarea
                    id="pastedText"
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none font-mono text-sm"
                    placeholder="Paste your protocol, notes, or any relevant text here..."
                  />
                </div>

                <div>
                  <label htmlFor="links" className="block text-sm font-medium text-neutral-700 mb-2">
                    Paste Links
                  </label>
                  <textarea
                    id="links"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none font-mono text-sm"
                    placeholder="https://example.com/paper1&#10;https://example.com/protocol2&#10;(one link per line)"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-neutral-700">
                    I confirm I have the right to share these materials and agree to the{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                      Privacy Policy
                    </Link>
                    . <span className="text-red-500">*</span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Materials'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
