import React from 'react';
import { Briefcase, ShieldCheck, Database, CheckCircle, Server, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-4">
            <Briefcase className="h-4 w-4" />
            About JobConnect Architecture
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Connecting Talent with High-Growth Teams
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            JobConnect is a full-stack, enterprise-grade online recruitment system designed to eliminate hiring friction, enforce strict role boundaries, and provide end-to-end recruitment lifecycle transparency.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Relational MySQL Backbone</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Designed with strict foreign key constraints, cascading deletions, composite unique indexes (preventing duplicate applications), and full parameterized SQL safety.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Robust Authorization</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Bcryptjs password hashing, JSON Web Tokens (JWT), and server-authoritative ownership enforcement ensure recruiters can only manage their own listings and candidates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-4">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Full Recruitment Lifecycle</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Five distinct application statuses (Applied, Shortlisted, Interview, Rejected, Selected) backed by real database updates, notifications, and analytics.
            </p>
          </div>
        </div>

        {/* Architecture Specs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Frontend Engineering</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  React 19 + TypeScript + Vite 8
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Tailwind CSS with responsive design system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  React Router v7 client-side SPA routing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Axios with JWT Bearer request interceptors
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Backend & Database</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Node.js + Express.js REST APIs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  MySQL2 connection pooling with auto-reconnect
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Bcrypt password hashing & JWT auth middleware
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Automated test suites with Node test runner
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            Explore Active Job Listings
          </Link>
        </div>
      </div>
    </div>
  );
};
