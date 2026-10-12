import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Shield,
  Users,
  Briefcase,
  Building2,
  FileText,
  UserCheck,
  UserX,
  Power,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'jobs' | 'applications'>('users');
  const [msg, setMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId: number, currentActive: number) => {
    const nextActive = currentActive === 1 ? 0 : 1;
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { is_active: nextActive });
      if (res.data.success) {
        setData((prev: any) => ({
          ...prev,
          users: prev.users.map((u: any) =>
            u.id === userId ? { ...u, is_active: nextActive } : u
          ),
        }));
        setMsg(`User status updated to ${nextActive === 1 ? 'Active' : 'Suspended'}`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleToggleJob = async (jobId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/admin/jobs/${jobId}/status`, { status: nextStatus });
      if (res.data.success) {
        setData((prev: any) => ({
          ...prev,
          jobs: prev.jobs.map((j: any) =>
            j.id === jobId ? { ...j, status: nextStatus } : j
          ),
        }));
        setMsg(`Job status updated to ${nextStatus}`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading system administration console..." />
      </div>
    );
  }

  const stats = data?.stats || {};
  const users = data?.users || [];
  const jobs = data?.jobs || [];
  const applications = data?.applications || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Administrator Console</h1>
            <p className="text-sm text-slate-500">
              System governance, user moderation, job oversight, and database platform metrics.
            </p>
          </div>
        </div>

        {msg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <p className="mt-2 text-3xl font-black text-slate-900">{users.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stats.registered_seekers} Seekers, {stats.registered_companies} Employers</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Jobs</span>
            <p className="mt-2 text-3xl font-black text-blue-600">{stats.active_jobs}</p>
            <p className="text-xs text-slate-400 mt-0.5">Of {jobs.length} total listings</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Applications</span>
            <p className="mt-2 text-3xl font-black text-indigo-600">{applications.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Across all vacancies</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Hires Recorded</span>
            <p className="mt-2 text-3xl font-black text-emerald-600">{stats.successful_placements || 0}</p>
            <p className="text-xs text-slate-400 mt-0.5">Selected candidates</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Job Moderation ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Platform Applications ({applications.length})
          </button>
        </div>

        {/* Tab 1: Users */}
        {activeTab === 'users' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Full Name</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Role</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{u.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{u.full_name}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 capitalize">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.is_active === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.is_active === 1 ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleToggleUser(u.id, u.is_active)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              u.is_active === 1
                                ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.is_active === 1 ? 'Suspend Account' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Jobs */}
        {activeTab === 'jobs' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Job Title</th>
                    <th scope="col" className="px-6 py-4">Company</th>
                    <th scope="col" className="px-6 py-4">Location</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((j: any) => (
                    <tr key={j.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{j.title}</td>
                      <td className="px-6 py-4 text-slate-700">{j.company_name}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{j.location}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={j.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleJob(j.id, j.status)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {j.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Applications */}
        {activeTab === 'applications' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Application ID</th>
                    <th scope="col" className="px-6 py-4">Job Role</th>
                    <th scope="col" className="px-6 py-4">Candidate</th>
                    <th scope="col" className="px-6 py-4">Date Submitted</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#{a.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{a.job_title}</td>
                      <td className="px-6 py-4 text-slate-700">{a.applicant_name}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(a.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
