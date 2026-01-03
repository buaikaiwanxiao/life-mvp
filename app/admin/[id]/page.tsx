'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  consent: boolean;
}

interface SubmissionFile {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  storage_path: string;
  created_at: string;
}

export default function AdminSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [files, setFiles] = useState<SubmissionFile[]>([]);

  useEffect(() => {
    loadSubmissionDetails();
  }, [submissionId]);

  const loadSubmissionDetails = async () => {
    setIsLoading(true);
    try {
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (submissionError) throw submissionError;

      setSubmission(submissionData);

      const { data: filesData, error: filesError } = await supabase
        .from('submission_files')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (filesError) throw filesError;

      setFiles(filesData || []);
    } catch (err) {
      console.error('Error loading submission:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (file: SubmissionFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .createSignedUrl(file.storage_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">Loading submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Submission not found.</p>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Submission Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Email</p>
                <p className="text-base text-neutral-900">{submission.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Organization</p>
                <p className="text-base text-neutral-900">{submission.organization || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Role</p>
                <p className="text-base text-neutral-900">{submission.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Submitted</p>
                <p className="text-base text-neutral-900">{formatDate(submission.created_at)}</p>
              </div>
            </div>
          </div>

          {submission.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notes</h2>
              <p className="text-neutral-700 whitespace-pre-wrap">{submission.notes}</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Uploaded Files ({files.length})
              </h2>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-neutral-50 px-4 py-4 rounded-lg border border-neutral-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <svg className="w-6 h-6 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {file.filename}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(file.size)} • {file.mime_type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(file)}
                      className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submission.pasted_text && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pasted Text</h2>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                  {submission.pasted_text}
                </pre>
              </div>
            </div>
          )}

          {submission.links && submission.links.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Links ({submission.links.length})
              </h2>
              <div className="space-y-2">
                {submission.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline break-all"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-neutral-100 rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              User has consented to share materials and agreed to privacy policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
