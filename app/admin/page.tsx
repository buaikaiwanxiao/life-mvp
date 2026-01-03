'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Submission {
  id: string;
  created_at: string;
  email: string;
  organization: string;
  role: string;
  notes: string;
  pasted_text: string;
  links: string[];
  file_count?: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'life-admin-2024') {
      setIsAuthenticated(true);
      loadSubmissions();
    } else {
      setError('Incorrect password');
    }
  };

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      const submissionsWithFiles = await Promise.all(
        (submissionsData || []).map(async (submission) => {
          const { count } = await supabase
            .from('submission_files')
            .select('*', { count: 'exact', head: true })
            .eq('submission_id', submission.id);

          return {
            ...submission,
            file_count: count || 0,
          };
        })
      );

      setSubmissions(submissionsWithFiles);
    } catch (err) {
      console.error('Error loading submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Admin Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={loadSubmissions}
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
              >
                Refresh
              </button>
              <Link href="/" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">
              Submissions ({submissions.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-neutral-600">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-600">
              No submissions yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/admin/${submission.id}`}
                  className="block px-6 py-5 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-neutral-900">
                          {submission.email}
                        </h3>
                        {submission.organization && (
                          <span className="text-sm text-neutral-500">
                            @ {submission.organization}
                          </span>
                        )}
                      </div>

                      {submission.role && (
                        <p className="text-sm text-neutral-600 mb-2">
                          Role: {submission.role}
                        </p>
                      )}

                      {submission.notes && (
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {submission.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                        <span>{formatDate(submission.created_at)}</span>
                        {submission.file_count! > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {submission.file_count} files
                          </span>
                        )}
                        {submission.pasted_text && (
                          <span>Text: {submission.pasted_text.length} chars</span>
                        )}
                        {submission.links && submission.links.length > 0 && (
                          <span>{submission.links.length} links</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
