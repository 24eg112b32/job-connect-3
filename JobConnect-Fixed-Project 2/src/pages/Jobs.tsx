import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { JobCard, JobCardData } from '../components/JobCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Briefcase,
  DollarSign,
  Building2,
} from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employment_type') || 'All');
  const [workArrangement, setWorkArrangement] = useState(searchParams.get('work_arrangement') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experience_level') || 'All');
  const [minSalary, setMinSalary] = useState(searchParams.get('min_salary') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Response Data
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set('query', query.trim());
      if (location.trim()) params.set('location', location.trim());
      if (employmentType && employmentType !== 'All') params.set('employment_type', employmentType);
      if (workArrangement && workArrangement !== 'All') params.set('work_arrangement', workArrangement);
      if (experienceLevel && experienceLevel !== 'All') params.set('experience_level', experienceLevel);
      if (minSalary) params.set('min_salary', minSalary);
      if (sortBy) params.set('sort_by', sortBy);
      params.set('page', page.toString());
      params.set('limit', '10');
      params.set('status', 'active');

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, employmentType, workArrangement, experienceLevel, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const resetFilters = () => {
    setQuery('');
    setLocation('');
    setEmploymentType('All');
    setWorkArrangement('All');
    setExperienceLevel('All');
    setMinSalary('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
    setTimeout(() => fetchJobs(), 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Find Job Vacancies</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search verified opportunities across top technology, finance, and engineering companies.
          </p>
        </div>

        {/* Top Search Controls Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, keywords, company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="City, state, or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="submit"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit space-y-6`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                Filter Options
              </h3>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Employment Type
              </label>
              <div className="space-y-2 text-sm text-slate-700">
                {['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="employmentType"
                      checked={employmentType === type}
                      onChange={() => {
                        setEmploymentType(type);
                        setPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Arrangement */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Work Arrangement
              </label>
              <div className="space-y-2 text-sm text-slate-700">
                {['All', 'Remote', 'Hybrid', 'On-site'].map((arr) => (
                  <label key={arr} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="workArrangement"
                      checked={workArrangement === arr}
                      onChange={() => {
                        setWorkArrangement(arr);
                        setPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{arr}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Experience Level
              </label>
              <div className="space-y-2 text-sm text-slate-700">
                {['All', 'Entry-level', 'Mid-level', 'Senior', 'Lead'].map((exp) => (
                  <label key={exp} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="experienceLevel"
                      checked={experienceLevel === exp}
                      onChange={() => {
                        setExperienceLevel(exp);
                        setPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Salary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Minimum Annual Salary ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  onBlur={() => {
                    setPage(1);
                    fetchJobs();
                  }}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Job Listings Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Result Count Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  Showing {jobs.length} of {pagination.totalRecords} available vacancies
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="salary_low">Lowest Salary</option>
                </select>
              </div>
            </div>

            {/* List Content */}
            {loading ? (
              <LoadingSpinner message="Searching jobs database..." />
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs found matching your criteria"
                description="Try loosening your filters, removing keywords, or search across different work arrangements."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-xs font-medium text-slate-600">
                  Page <span className="font-bold text-slate-900">{page}</span> of{' '}
                  <span className="font-bold text-slate-900">{pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
