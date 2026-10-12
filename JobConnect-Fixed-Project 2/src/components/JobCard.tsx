import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export interface JobCardData {
  id: number;
  company_id: number;
  title: string;
  description: string;
  experience_level: string;
  employment_type: string;
  work_arrangement: string;
  location: string;
  salary_min?: number | null;
  salary_max?: number | null;
  application_deadline?: string | null;
  created_at: string;
  status: string;
  company_name?: string;
  company_logo?: string | null;
  applicant_count?: number;
}

export const JobCard: React.FC<{ job: JobCardData }> = ({ job }) => {
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / yr`;
    }
    if (min) return `From $${(min / 1000).toFixed(0)}k / yr`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k / yr`;
    return 'Competitive';
  };

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Company Avatar / Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-700 font-bold overflow-hidden">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="h-6 w-6 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">
                {job.company_name || 'Hiring Company'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo(job.created_at)}
              </span>
            </div>

            <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
          </div>
        </div>

        {/* View Details button on top right on desktop */}
        <div className="hidden sm:block">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Badges / Metadata row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          {job.location}
        </span>

        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
          <Briefcase className="h-3.5 w-3.5 text-blue-500" />
          {job.employment_type}
        </span>

        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 font-medium text-purple-700">
          {job.work_arrangement}
        </span>

        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
          {job.experience_level}
        </span>

        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ml-auto sm:ml-0">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          {formatSalary(job.salary_min, job.salary_max)}
        </span>

        {job.application_deadline && (
          <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 text-slate-500 text-xs ml-auto">
            <Calendar className="h-3 w-3" />
            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Mobile action button */}
      <div className="mt-4 block sm:hidden">
        <Link
          to={`/jobs/${job.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition"
        >
          View Job Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
