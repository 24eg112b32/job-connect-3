import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Briefcase,
  Users,
  Building2,
  PlusCircle,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Settings,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/recruiter')
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load recruiter dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading recruiter dashboard..." />
      </div>
    );
  }

  const stats = data?.stats || {
    total_jobs: 0,
    active_jobs: 0,
    inactive_jobs: 0,
    total_applicants: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  };

  const company = data?.company;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Recruiter Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 p-8 text-white shadow-md">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              <Building2 className="h-3.5 w-3.5" />
              Employer Recruiter Hub
            </span>
            <h1 className="mt-3 text-3xl font-black">
              {company?.company_name ? company.company_name : user?.full_name}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Welcome back, {user?.full_name}. Oversee your open listings, candidate pipelines, and hiring decisions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Post New Vacancy
            </Link>
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-800 transition"
            >
              <Briefcase className="h-4 w-4" />
              Manage Listings
            </Link>
          </div>
        </div>

        {/* Recruitment Pipeline Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Jobs</span>
              <Briefcase className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-900">{stats.total_jobs}</p>
            <p className="mt-1 text-xs text-slate-400">{stats.active_jobs} active currently</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Total Candidates</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-blue-600">{stats.total_applicants}</p>
            <p className="mt-1 text-xs text-slate-400">Received applications</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Shortlisted</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-amber-600">{stats.shortlisted}</p>
            <p className="mt-1 text-xs text-slate-400">Screening passed</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Interviewing</span>
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-purple-600">{stats.interview}</p>
            <p className="mt-1 text-xs text-slate-400">Technical / HR rounds</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Selected / Hired</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-600">{stats.selected}</p>
            <p className="mt-1 text-xs text-slate-400">Offers accepted</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Postings</span>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-700">{stats.active_jobs}</p>
            <p className="mt-1 text-xs text-slate-400">Accepting applicants</p>
          </div>
        </div>

        {/* Recruiter Action Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recruiter Management Console</h3>
                <p className="text-xs text-slate-500">Quickly navigate to frequent hiring tasks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/recruiter/jobs/create"
                className="group flex flex-col justify-between rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 font-bold text-slate-900">Post a New Vacancy</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Publish roles with customized requirements, salary ranges, and deadlines.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                  Open Job Editor <ArrowRight className="h-3 w-3" />
                </span>
              </Link>

              <Link
                to="/recruiter/jobs"
                className="group flex flex-col justify-between rounded-xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-xs transition"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 font-bold text-slate-900">Manage Job Listings</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    View active/inactive vacancies, review applicant counts, and edit job specs.
                  </p>
                </div>
                <span className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
                  View Job Table <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Company Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Company Brand
              </h3>
              <Link
                to="/recruiter/company"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Settings className="h-3.5 w-3.5" />
                Edit
              </Link>
            </div>

            {company ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 overflow-hidden">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt={company.company_name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{company.company_name}</h4>
                    <span className="text-xs text-blue-600 font-medium">{company.industry || 'Technology'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-slate-800">{company.location || 'Remote'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Team Size:</span>
                    <span className="font-semibold text-slate-800">{company.company_size || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Website:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {company.website || 'Not set'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/recruiter/company"
                  className="block w-full text-center rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Manage Company Details
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 mb-4">Set up your company profile to brand your job listings.</p>
                <Link
                  to="/recruiter/company"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Create Company Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
