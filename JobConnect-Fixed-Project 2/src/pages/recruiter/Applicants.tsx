import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import {
  Users,
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  X,
} from 'lucide-react';

export const Applicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/jobs/${jobId}/applications`),
      ]);

      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }
      if (appsRes.data.success) {
        setApplicants(appsRes.data.data);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to retrieve applicants for this job.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      const res = await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
        );
        if (selectedApplicant && selectedApplicant.id === applicationId) {
          setSelectedApplicant((prev: any) => ({ ...prev, status: newStatus }));
        }
        setActionSuccess(`Application status changed to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Retrieving candidate submissions..." />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
        <p className="mt-2 text-sm text-slate-500">{errorMsg}</p>
        <Link
          to="/recruiter/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Listings
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Applicants: {job?.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review submissions, check applicant qualifications, and advance candidate stages.
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 self-start sm:self-auto">
              Total Applicants: {applicants.length}
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {applicants.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No candidates have applied to this position yet"
            description="When job seekers submit their resumes and applications, they will appear here in real time."
            actionText="View Public Job Listing"
            actionHref={`/jobs/${jobId}`}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Candidate Name</th>
                    <th scope="col" className="px-6 py-4">Contact Info</th>
                    <th scope="col" className="px-6 py-4">Applied Date</th>
                    <th scope="col" className="px-6 py-4">Resume</th>
                    <th scope="col" className="px-6 py-4">Current Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Review Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.applicant_name}</div>
                        {app.applicant_headline && (
                          <div className="text-xs text-blue-600 line-clamp-1 max-w-xs">
                            {app.applicant_headline}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {app.applicant_email}
                        </div>
                        {app.applicant_phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {app.applicant_phone}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        {app.resume_path ? (
                          <a
                            href={app.resume_path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Resume
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None attached</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                        >
                          Review Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Candidate Detail Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedApplicant.applicant_name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    {selectedApplicant.applicant_headline || 'Candidate Profile'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Selector Bar */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs font-bold text-slate-600">Update Recruitment Stage:</div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedApplicant.status}
                    onChange={(e) => handleStatusChange(selectedApplicant.id, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedApplicant.applicant_email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Phone Number</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedApplicant.applicant_phone || 'None'}</p>
                </div>
              </div>

              {/* Cover letter */}
              {selectedApplicant.cover_letter && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Cover Letter
                  </h4>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedApplicant.cover_letter}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedApplicant.applicant_skills && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.applicant_skills.split(',').map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedApplicant.applicant_experience && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Experience Summary
                  </h4>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedApplicant.applicant_experience}
                  </p>
                </div>
              )}

              {/* Education */}
              {selectedApplicant.applicant_education && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Education
                  </h4>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedApplicant.applicant_education}
                  </p>
                </div>
              )}

              {/* Resume button */}
              {selectedApplicant.resume_path && (
                <div className="pt-2">
                  <a
                    href={selectedApplicant.resume_path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4" />
                    Open Attached Resume Document
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
