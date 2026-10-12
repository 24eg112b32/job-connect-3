import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Send,
  AlertCircle,
  FileText,
  X,
  Share2,
} from 'lucide-react';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isSeeker } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumePath, setResumePath] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        } else {
          setError(res.data.message || 'Job not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to retrieve job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJobDetails();
  }, [id]);

  // Pre-fill resume from profile if seeker is logged in
  useEffect(() => {
    if (isAuthenticated && isSeeker) {
      api.get('/profile')
        .then((res) => {
          if (res.data.success && res.data.data?.resume_path) {
            setResumePath(res.data.data.resume_path);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, isSeeker]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);
    setSubmitting(true);

    try {
      const res = await api.post('/applications', {
        job_id: job.id,
        resume_path: resumePath || null,
        cover_letter: coverLetter || null,
      });

      if (res.data.success) {
        setApplySuccess(true);
      }
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Competitive / Undisclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} per year`;
    if (min) return `From $${min.toLocaleString()} per year`;
    if (max) return `Up to $${max.toLocaleString()} per year`;
    return 'Competitive';
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading job listing details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">{error || 'This job listing may have expired or been removed.'}</p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Available Jobs
        </Link>
      </div>
    );
  }

  const isExpired = job.application_deadline && new Date(job.application_deadline).getTime() < Date.now();
  const isInactive = job.status !== 'active';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search Results
          </button>
        </div>

        {/* Main Job Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden font-bold text-slate-600">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-8 w-8 text-slate-400" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-blue-600">{job.company_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply CTA Buttons */}
            <div className="flex flex-col sm:items-end gap-2">
              {isInactive || isExpired ? (
                <div className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-600 text-center">
                  {isInactive ? 'Listing Closed' : 'Deadline Expired'}
                </div>
              ) : isAuthenticated && isSeeker ? (
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Apply Now
                </button>
              ) : !isAuthenticated ? (
                <Link
                  to={`/login?redirect=/jobs/${job.id}`}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition text-center"
                >
                  Sign In to Apply
                </Link>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                  Logged in as Recruiter / Admin
                </div>
              )}
            </div>
          </div>

          {/* Key Facts Ribbon */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Employment Type</p>
              <p className="mt-1 font-bold text-slate-900">{job.employment_type}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Work Arrangement</p>
              <p className="mt-1 font-bold text-slate-900">{job.work_arrangement}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Experience Level</p>
              <p className="mt-1 font-bold text-slate-900">{job.experience_level}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Annual Salary</p>
              <p className="mt-1 font-bold text-emerald-700">
                {formatSalary(job.salary_min, job.salary_max)}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            {/* Overview */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
              <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Key Responsibilities</h2>
              <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Required Skills & Technologies</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.required_skills.split(',').map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h2 className="text-lg font-bold text-slate-900">Candidate Qualifications</h2>
              <div className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.qualifications}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                About the Company
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 overflow-hidden">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{job.company_name}</h4>
                  <p className="text-xs text-slate-500">{job.company_location || job.location}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Applicants</span>
                  <span className="font-bold text-slate-900">{job.applicant_count || 0} applied</span>
                </div>
                {job.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Deadline</span>
                    <span className="font-bold text-slate-900">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  to={`/jobs?company_id=${job.company_id}`}
                  className="block w-full text-center rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  View All Openings from this Company
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Apply for Position</h3>
                <p className="text-xs text-slate-500 mt-0.5">{job.title} at {job.company_name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setApplyError(null);
                  setApplySuccess(false);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Your application has been received by <span className="font-semibold">{job.company_name}</span>. You can track status updates in your dashboard.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    to="/seeker/applications"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    View My Applications
                  </Link>
                  <button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setApplySuccess(false);
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-6 space-y-5">
                {applyError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Resume Link or File URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://storage.example.com/my-resume.pdf"
                    value={resumePath}
                    onChange={(e) => setResumePath(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Provide a direct link to your PDF resume (e.g. Google Drive, Dropbox, or custom hosted link).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Cover Letter
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">(Optional)</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Introduce yourself and explain why you're a great fit for this role... (Optional)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
