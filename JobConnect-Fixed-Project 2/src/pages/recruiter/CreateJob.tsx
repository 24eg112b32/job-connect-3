import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
} from 'lucide-react';

export const CreateJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-level');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workArrangement, setWorkArrangement] = useState('Remote');
  const [location, setLocation] = useState('Remote, USA');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('active');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      api.get(`/jobs/${id}`)
        .then((res) => {
          if (res.data.success && res.data.data) {
            const j = res.data.data;
            setTitle(j.title || '');
            setDescription(j.description || '');
            setResponsibilities(j.responsibilities || '');
            setRequiredSkills(j.required_skills || '');
            setQualifications(j.qualifications || '');
            setExperienceLevel(j.experience_level || 'Mid-level');
            setEmploymentType(j.employment_type || 'Full-time');
            setWorkArrangement(j.work_arrangement || 'Remote');
            setLocation(j.location || '');
            setSalaryMin(j.salary_min ? j.salary_min.toString() : '');
            setSalaryMax(j.salary_max ? j.salary_max.toString() : '');
            setDeadline(j.application_deadline ? j.application_deadline.split('T')[0] : '');
            setStatus(j.status || 'active');
          }
        })
        .catch((err) => {
          setErrorMsg(err.response?.data?.message || 'Failed to load job details');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !description.trim() || !responsibilities.trim() || !requiredSkills.trim() || !qualifications.trim() || !location.trim()) {
      setErrorMsg('Please fill in all mandatory job description fields.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        responsibilities: responsibilities.trim(),
        required_skills: requiredSkills.trim(),
        qualifications: qualifications.trim(),
        experience_level: experienceLevel,
        employment_type: employmentType,
        work_arrangement: workArrangement,
        location: location.trim(),
        salary_min: salaryMin ? parseFloat(salaryMin) : null,
        salary_max: salaryMax ? parseFloat(salaryMax) : null,
        application_deadline: deadline || null,
        status,
      };

      if (isEditing) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }

      navigate('/recruiter/jobs');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading job listing details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Manage Jobs
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {isEditing ? 'Edit Job Vacancy' : 'Post a New Job Vacancy'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? 'Update specifications, deadline, or requirements for this listing.'
              : 'Provide detailed information to attract the most qualified candidates.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Full-Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Employment Type *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Arrangement *
              </label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience Level *
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Minimum Annual Salary ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  placeholder="e.g. 120000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Maximum Annual Salary ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Application Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="active">Active (Visible & Open to Applications)</option>
                <option value="inactive">Inactive (Closed / Draft)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                required
                placeholder="React, TypeScript, MySQL, Node.js, Tailwind CSS"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Job Overview & Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe the opportunity, the team mission, and what the candidate will be doing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Key Responsibilities (One per line or bullet points) *
              </label>
              <textarea
                rows={4}
                required
                placeholder="• Architect and ship scalable frontend components...&#10;• Maintain MySQL database queries and schemas...&#10;• Collaborate with cross-functional design and product leads..."
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Candidate Qualifications *
              </label>
              <textarea
                rows={4}
                required
                placeholder="• B.S. in Computer Science or equivalent practical industry experience...&#10;• 3+ years writing TypeScript applications in production..."
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/recruiter/jobs')}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Publishing...' : isEditing ? 'Update Vacancy' : 'Publish Job Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
