import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Job<span className="text-blue-500">Connect</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
              The modern recruitment network connecting top-tier talent with ambitious companies worldwide.
              Powered by real-time relational intelligence and trusted hiring workflows.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 hover:bg-slate-800 hover:text-white transition"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 hover:bg-slate-800 hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 hover:bg-slate-800 hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              For Job Seekers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Browse Active Vacancies
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Software+Development" className="hover:text-white transition">
                  Tech & Software Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link to="/register?role=job_seeker" className="hover:text-white transition">
                  Create Candidate Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              For Recruiters
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/register?role=recruiter" className="hover:text-white transition">
                  Post a Job Vacancy
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-white transition">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-white transition">
                  Manage Employer Brand
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Contact & Trust
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                support@jobconnect.io
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                +1 (800) 555-JOBS
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                San Francisco, CA
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Database API Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JobConnect Online Job Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-300">
              Terms & Conditions
            </Link>
            <Link to="/about" className="hover:text-slate-300">
              Security Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
