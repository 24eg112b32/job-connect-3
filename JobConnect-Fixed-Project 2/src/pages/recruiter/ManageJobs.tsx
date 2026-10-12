import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmModal } from '../../components/ConfirmModal';
import { EmptyState } from '../../components/EmptyState';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/recruiter/my');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleToggleStatus = async (jobId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/jobs/${jobId}/status`, { status: nextStatus });
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j))
        );
        setActionMsg(`Job listing marked as ${nextStatus}`);
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle job status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteJobId) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/jobs/${deleteJobId}`);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j.id !== deleteJobId));
        setActionMsg('Job listing deleted successfully.');
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete job listing');
    } finally {
      setDeleting(false);
      setDeleteJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your job listings..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Job Listings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, edit, activate/deactivate, and view applicants for all jobs you have posted.
            </p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {actionMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            {actionMsg}
          </div>
        )}

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="You haven't posted any job vacancies yet"
            description="Create your first job post to start receiving candidate applications."
            actionText="Create Job Listing"
            actionHref="/recruiter/jobs/create"
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Job Title & Details</th>
                    <th scope="col" className="px-6 py-4">Arrangement / Type</th>
                    <th scope="col" className="px-6 py-4">Applicants</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{job.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-700">{job.employment_type}</div>
                        <div className="text-slate-400">{job.work_arrangement}</div>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/recruiter/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                        >
                          <Users className="h-3.5 w-3.5" />
                          {job.applicant_count || 0} Applicants
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="inline-flex items-center gap-1.5 cursor-pointer text-left"
                          title="Click to toggle status"
                        >
                          <StatusBadge status={job.status} size="sm" />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/recruiter/jobs/${job.id}/applicants`}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition"
                            title="View Applicants"
                          >
                            <Users className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/recruiter/jobs/edit/${job.id}`}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                            title="Edit Job"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                            title="Public Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteJobId(job.id)}
                            className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteJobId !== null}
          title="Delete Job Vacancy"
          message="Are you sure you want to permanently delete this job listing? All applicant records associated with this job will also be removed."
          confirmText={deleting ? 'Deleting...' : 'Delete Job'}
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteJobId(null)}
        />
      </div>
    </div>
  );
};
