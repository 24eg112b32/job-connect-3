import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { JobCard, JobCardData } from '../components/JobCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Code2,
  ShieldAlert,
  Megaphone,
  Coins,
  UserCheck,
  Palette,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Software Development', icon: Code2, count: '120+ jobs', query: 'Software Development' },
  { name: 'Data Science', icon: Database, count: '85+ jobs', query: 'Data Science' },
  { name: 'Artificial Intelligence', icon: Cpu, count: '60+ jobs', query: 'Artificial Intelligence' },
  { name: 'Web Development', icon: Code2, count: '90+ jobs', query: 'Web Development' },
  { name: 'Cybersecurity', icon: ShieldAlert, count: '45+ jobs', query: 'Cybersecurity' },
  { name: 'Marketing', icon: Megaphone, count: '70+ jobs', query: 'Marketing' },
  { name: 'Finance', icon: Coins, count: '50+ jobs', query: 'Finance' },
  { name: 'Human Resources', icon: UserCheck, count: '35+ jobs', query: 'Human Resources' },
  { name: 'Design', icon: Palette, count: '65+ jobs', query: 'Design' },
  { name: 'Sales', icon: TrendingUp, count: '80+ jobs', query: 'Sales' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<JobCardData[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    active_jobs: number;
    registered_seekers: number;
    registered_companies: number;
    successful_placements: number;
  }>({
    active_jobs: 0,
    registered_seekers: 0,
    registered_companies: 0,
    successful_placements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [jobsRes, statsRes, companiesRes] = await Promise.all([
          api.get('/jobs?limit=6&status=active'),
          api.get('/dashboard/stats'),
          api.get('/companies'),
        ]);

        if (jobsRes.data.success) {
          setFeaturedJobs(jobsRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (companiesRes.data.success) {
          setFeaturedCompanies(companiesRes.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.set('query', searchTitle.trim());
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-20 pb-28 text-white">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Job Opportunities & Real-Time Applications
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Find Your Dream Job with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              JobConnect
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 font-normal leading-relaxed">
            Discover opportunities, connect with employers, and take the next step in your career.
            Join thousands of professionals landing roles every day.
          </p>

          {/* Search Bar Form */}
          <div className="mx-auto mt-10 max-w-3xl">
            <form
              onSubmit={handleHeroSearch}
              className="flex flex-col md:flex-row items-center gap-2 rounded-2xl bg-white p-2.5 shadow-2xl"
            >
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="hidden md:block h-8 w-[1px] bg-slate-200" />

              <div className="relative flex-1 w-full flex items-center">
                <MapPin className="absolute left-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4" />
                Search Jobs
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span>Popular searches:</span>
              <button
                onClick={() => navigate('/jobs?query=React')}
                className="rounded-full bg-slate-800/80 px-3 py-1 hover:text-white transition"
              >
                React
              </button>
              <button
                onClick={() => navigate('/jobs?query=Remote')}
                className="rounded-full bg-slate-800/80 px-3 py-1 hover:text-white transition"
              >
                Remote
              </button>
              <button
                onClick={() => navigate('/jobs?query=Senior')}
                className="rounded-full bg-slate-800/80 px-3 py-1 hover:text-white transition"
              >
                Senior Engineer
              </button>
              <button
                onClick={() => navigate('/jobs?query=Python')}
                className="rounded-full bg-slate-800/80 px-3 py-1 hover:text-white transition"
              >
                Python
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Database-Backed Platform Statistics Section */}
      <section className="-mt-12 relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-4 p-3 border-r border-slate-100 last:border-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.active_jobs || 6}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Jobs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-r border-slate-100 last:border-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.registered_seekers || 3}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Seekers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-r border-slate-100 last:border-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.registered_companies || 3}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hiring Companies</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.successful_placements || 1}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hired Placements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Explore by Field</h2>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">Popular Job Categories</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Browse all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.query)}`)}
                className="group flex flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left shadow-xs hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition-all duration-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
                <span className="mt-1 text-xs text-slate-500">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Fresh Vacancies</h2>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">Featured Opportunities</p>
              <p className="mt-1.5 text-sm text-slate-500">
                Real active positions from verified hiring partners.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-100 transition"
            >
              View All {stats.active_jobs || ''} Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <LoadingSpinner message="Fetching latest job listings..." />
            ) : featuredJobs.length === 0 ? (
              <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                No active jobs currently available. Check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Top Employers</h2>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">Featured Hiring Companies</p>
          <p className="mt-2 text-sm text-slate-500">
            Learn more about high-growth teams actively recruiting on JobConnect.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCompanies.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={c.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.company_name}</h3>
                  <span className="text-xs text-blue-600 font-medium">{c.industry}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {c.description || 'Pioneering innovative products and high performance engineering.'}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{c.location}</span>
                <Link
                  to={`/jobs?company_id=${c.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Jobs →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">Step by Step Guide</h2>
            <p className="mt-2 text-3xl font-extrabold sm:text-4xl text-white">
              How JobConnect Works
            </p>
            <p className="mt-3 text-sm text-slate-400">
              A transparent, streamlined path from discovering a vacancy to landing your job offer.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative rounded-2xl bg-slate-800/60 p-6 border border-slate-700/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Create an Account</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Register as a job seeker, showcase your skills, experience, and upload your resume.
              </p>
            </div>

            <div className="relative rounded-2xl bg-slate-800/60 p-6 border border-slate-700/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black text-white text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Find Opportunities</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Filter by job title, location, salary, experience, and remote work arrangements.
              </p>
            </div>

            <div className="relative rounded-2xl bg-slate-800/60 p-6 border border-slate-700/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 font-black text-white text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Apply for Jobs</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Submit one-click applications with optional cover letters directly to verified employers.
              </p>
            </div>

            <div className="relative rounded-2xl bg-slate-800/60 p-6 border border-slate-700/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-black text-white text-lg mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-white">Track Progress</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Monitor status transitions live: Applied, Shortlisted, Interview, and Selection!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black">Hiring for your team?</h2>
              <p className="mt-2 text-blue-100 max-w-xl text-sm leading-relaxed">
                Publish openings to our talent pool, manage applicants, and streamline your recruitment pipeline today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register?role=recruiter"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-lg hover:bg-blue-50 transition"
              >
                Start Hiring Now
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-blue-400 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                Recruiter Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
