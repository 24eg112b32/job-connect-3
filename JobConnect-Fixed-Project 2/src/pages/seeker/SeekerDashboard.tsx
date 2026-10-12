import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  Search,
  ExternalLink,
} from 'lucide-react';

export const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [dashRes, profRes] = await Promise.all([
          api.get('/dashboard/seeker'),
          api.get('/profile'),
        ]);

        if (dashRes.data.success) {
          setDashboardData(dashRes.data.data);
        }
        if (profRes.data.success) {
          setProfile(profRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load seeker dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your candidate overview..." />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  };

  const recentApps = dashboardData?.recentApplications || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white shadow-md">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles className="h-3.5 w-3.5" />
              Job Seeker Portal
            </span>
            <h1 className="mt-3 text-3xl font-black">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Track your submitted job applications, manage your credentials, and explore new openings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-xs hover:bg-blue-50 transition"
            >
              <Search className="h-4 w-4" />
              Find New Jobs
            </Link>
            <Link
              to="/seeker/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-400 bg-blue-600/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-600/50 transition"
            >
              <User className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* 5-Metric Status Counters Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applied</span>
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-900">{stats.total}</p>
            <p className="mt-1 text-xs text-slate-400">All submissions</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Pending Review</span>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-blue-600">{stats.applied}</p>
            <p className="mt-1 text-xs text-slate-400">Under recruiter review</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Shortlisted</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-amber-600">{stats.shortlisted}</p>
            <p className="mt-1 text-xs text-slate-400">Passed initial screening</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Interviewing</span>
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-purple-600">{stats.interview}</p>
            <p className="mt-1 text-xs text-slate-400">Active conversations</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Selected / Hired</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-600">{stats.selected}</p>
            <p className="mt-1 text-xs text-slate-400">Job offers extended</p>
          </div>
        </div>

        {/* Dashboard Grid: Recent Applications & Candidate Profile Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications Table */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
                <p className="text-xs text-slate-500">Live statuses from prospective employers</p>
              </div>
              <Link
                to="/seeker/applications"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View all ({stats.total})
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Briefcase className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Explore job listings to send your first application.</p>
                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Browse Open Positions
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {recentApps.map((app: any) => (
                  <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.job_title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {app.company_name} • Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        title="View Job"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Quick Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Profile Readiness
            </h3>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{user?.full_name}</h4>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              {profile?.headline ? (
                <p className="text-xs text-blue-700 font-medium pt-2 border-t border-slate-200/60">
                  {profile.headline}
                </p>
              ) : (
                <p className="text-xs text-amber-600 font-medium pt-2 border-t border-slate-200/60">
                  Headline not set. Add a professional title!
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-slate-800">{profile?.location || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Resume Attached:</span>
                <span className="font-semibold text-slate-800">
                  {profile?.resume_path ? 'Yes (Linked)' : 'No resume added'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Skills Listed:</span>
                <span className="font-semibold text-slate-800">
                  {profile?.skills ? profile.skills.split(',').length : 0} skills
                </span>
              </div>
            </div>

            <Link
              to="/seeker/profile"
              className="block w-full text-center rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Update Candidate Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
