import { db } from '../config/database.js';

export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  phone: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface SeekerProfile {
  id: number;
  user_id: number;
  headline: string | null;
  location: string | null;
  skills: string | null;
  education: string | null;
  experience: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  resume_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  recruiter_id: number;
  company_name: string;
  description: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  location: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  company_id: number;
  recruiter_id: number;
  title: string;
  description: string;
  responsibilities: string;
  required_skills: string;
  qualifications: string;
  experience_level: string;
  employment_type: string;
  work_arrangement: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  application_deadline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // joined fields
  company_name?: string;
  company_logo?: string | null;
  company_location?: string | null;
  applicant_count?: number;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id: number;
  resume_path: string | null;
  cover_letter: string | null;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'SELECTED' | string;
  applied_at: string;
  updated_at: string;
  // joined fields
  job_title?: string;
  company_name?: string;
  applicant_name?: string;
  applicant_email?: string;
  applicant_phone?: string | null;
  applicant_skills?: string | null;
  applicant_headline?: string | null;
  applicant_education?: string | null;
  applicant_experience?: string | null;
}

export class DataService {
  // ================= USERS =================
  static async findUserByEmail(email: string): Promise<User | null> {
    const store = db.getRelationalStore().getStore();
    const normalized = email.trim().toLowerCase();
    const user = store.users.find((u) => u.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  }

  static async findUserById(id: number): Promise<User | null> {
    const store = db.getRelationalStore().getStore();
    const user = store.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  static async createUser(userData: {
    full_name: string;
    email: string;
    password_hash: string;
    role: 'job_seeker' | 'recruiter' | 'admin';
    phone?: string;
  }): Promise<User> {
    const store = db.getRelationalStore().getStore();
    const existing = await this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('A user with this email address already exists');
    }

    store.counters.users += 1;
    const now = new Date().toISOString();
    const newUser: User = {
      id: store.counters.users,
      full_name: userData.full_name.trim(),
      email: userData.email.trim().toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role,
      phone: userData.phone?.trim() || null,
      is_active: 1,
      created_at: now,
      updated_at: now,
    };

    store.users.push(newUser);

    // If seeker, create empty profile
    if (newUser.role === 'job_seeker') {
      store.counters.seeker_profiles += 1;
      store.seeker_profiles.push({
        id: store.counters.seeker_profiles,
        user_id: newUser.id,
        headline: '',
        location: '',
        skills: '',
        education: '',
        experience: '',
        portfolio_url: '',
        linkedin_url: '',
        resume_path: '',
        created_at: now,
        updated_at: now,
      });
    }

    db.getRelationalStore().save();
    return newUser;
  }

  static async getAllUsers(): Promise<Omit<User, 'password_hash'>[]> {
    const store = db.getRelationalStore().getStore();
    return store.users.map(({ password_hash, ...rest }) => rest);
  }

  static async updateUserStatus(userId: number, isActive: number): Promise<boolean> {
    const store = db.getRelationalStore().getStore();
    const user = store.users.find((u) => u.id === userId);
    if (!user) return false;
    user.is_active = isActive;
    user.updated_at = new Date().toISOString();
    db.getRelationalStore().save();
    return true;
  }

  // ================= SEEKER PROFILES =================
  static async getSeekerProfile(userId: number): Promise<SeekerProfile | null> {
    const store = db.getRelationalStore().getStore();
    const profile = store.seeker_profiles.find((p) => p.user_id === userId);
    return profile ? { ...profile } : null;
  }

  static async upsertSeekerProfile(
    userId: number,
    data: Partial<Omit<SeekerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<SeekerProfile> {
    const store = db.getRelationalStore().getStore();
    let profile = store.seeker_profiles.find((p) => p.user_id === userId);
    const now = new Date().toISOString();

    if (!profile) {
      store.counters.seeker_profiles += 1;
      profile = {
        id: store.counters.seeker_profiles,
        user_id: userId,
        headline: data.headline || null,
        location: data.location || null,
        skills: data.skills || null,
        education: data.education || null,
        experience: data.experience || null,
        portfolio_url: data.portfolio_url || null,
        linkedin_url: data.linkedin_url || null,
        resume_path: data.resume_path || null,
        created_at: now,
        updated_at: now,
      };
      store.seeker_profiles.push(profile);
    } else {
      if (data.headline !== undefined) profile.headline = data.headline;
      if (data.location !== undefined) profile.location = data.location;
      if (data.skills !== undefined) profile.skills = data.skills;
      if (data.education !== undefined) profile.education = data.education;
      if (data.experience !== undefined) profile.experience = data.experience;
      if (data.portfolio_url !== undefined) profile.portfolio_url = data.portfolio_url;
      if (data.linkedin_url !== undefined) profile.linkedin_url = data.linkedin_url;
      if (data.resume_path !== undefined) profile.resume_path = data.resume_path;
      profile.updated_at = now;
    }

    db.getRelationalStore().save();
    return { ...profile };
  }

  // ================= COMPANIES =================
  static async getCompanies(): Promise<Company[]> {
    const store = db.getRelationalStore().getStore();
    return [...store.companies];
  }

  static async getCompanyById(id: number): Promise<Company | null> {
    const store = db.getRelationalStore().getStore();
    const c = store.companies.find((comp) => comp.id === id);
    return c ? { ...c } : null;
  }

  static async getCompanyByRecruiterId(recruiterId: number): Promise<Company | null> {
    const store = db.getRelationalStore().getStore();
    const c = store.companies.find((comp) => comp.recruiter_id === recruiterId);
    return c ? { ...c } : null;
  }

  static async upsertCompany(
    recruiterId: number,
    data: {
      company_name: string;
      description?: string;
      industry?: string;
      company_size?: string;
      website?: string;
      location?: string;
      logo_url?: string;
    }
  ): Promise<Company> {
    const store = db.getRelationalStore().getStore();
    let comp = store.companies.find((c) => c.recruiter_id === recruiterId);
    const now = new Date().toISOString();

    if (!comp) {
      store.counters.companies += 1;
      comp = {
        id: store.counters.companies,
        recruiter_id: recruiterId,
        company_name: data.company_name.trim(),
        description: data.description?.trim() || null,
        industry: data.industry?.trim() || null,
        company_size: data.company_size?.trim() || null,
        website: data.website?.trim() || null,
        location: data.location?.trim() || null,
        logo_url: data.logo_url?.trim() || null,
        created_at: now,
        updated_at: now,
      };
      store.companies.push(comp);
    } else {
      comp.company_name = data.company_name.trim();
      if (data.description !== undefined) comp.description = data.description?.trim() || null;
      if (data.industry !== undefined) comp.industry = data.industry?.trim() || null;
      if (data.company_size !== undefined) comp.company_size = data.company_size?.trim() || null;
      if (data.website !== undefined) comp.website = data.website?.trim() || null;
      if (data.location !== undefined) comp.location = data.location?.trim() || null;
      if (data.logo_url !== undefined) comp.logo_url = data.logo_url?.trim() || null;
      comp.updated_at = now;
    }

    db.getRelationalStore().save();
    return { ...comp };
  }

  // ================= JOBS =================
  static async getJobs(params: {
    query?: string;
    title?: string;
    location?: string;
    category?: string;
    employment_type?: string;
    work_arrangement?: string;
    experience_level?: string;
    company_id?: number;
    recruiter_id?: number;
    status?: string;
    min_salary?: number;
    max_salary?: number;
    sort_by?: 'newest' | 'salary_high' | 'salary_low';
    page?: number;
    limit?: number;
  }) {
    const store = db.getRelationalStore().getStore();
    let jobs = [...store.jobs];

    // Status filter
    if (params.status) {
      jobs = jobs.filter((j) => j.status === params.status);
    } else {
      // Default to active unless requested otherwise
      jobs = jobs.filter((j) => j.status === 'active');
    }

    if (params.recruiter_id) {
      jobs = jobs.filter((j) => j.recruiter_id === params.recruiter_id);
    }
    if (params.company_id) {
      jobs = jobs.filter((j) => j.company_id === params.company_id);
    }

    // Keyword search (matches title, description, skills, company name)
    if (params.query) {
      const q = params.query.toLowerCase().trim();
      jobs = jobs.filter((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        const compName = comp ? comp.company_name.toLowerCase() : '';
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.required_skills.toLowerCase().includes(q) ||
          compName.includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      });
    }

    // Specific field filters
    if (params.title) {
      const t = params.title.toLowerCase().trim();
      jobs = jobs.filter((j) => j.title.toLowerCase().includes(t));
    }

    if (params.location) {
      const l = params.location.toLowerCase().trim();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(l));
    }

    if (params.category) {
      const cat = params.category.toLowerCase().trim();
      jobs = jobs.filter((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        const industry = comp?.industry?.toLowerCase() || '';
        return (
          j.title.toLowerCase().includes(cat) ||
          j.description.toLowerCase().includes(cat) ||
          j.required_skills.toLowerCase().includes(cat) ||
          industry.includes(cat)
        );
      });
    }

    if (params.employment_type && params.employment_type !== 'All') {
      jobs = jobs.filter((j) => j.employment_type.toLowerCase() === params.employment_type!.toLowerCase());
    }

    if (params.work_arrangement && params.work_arrangement !== 'All') {
      jobs = jobs.filter((j) => j.work_arrangement.toLowerCase() === params.work_arrangement!.toLowerCase());
    }

    if (params.experience_level && params.experience_level !== 'All') {
      jobs = jobs.filter((j) => j.experience_level.toLowerCase() === params.experience_level!.toLowerCase());
    }

    if (params.min_salary) {
      jobs = jobs.filter((j) => (j.salary_max || j.salary_min || 0) >= params.min_salary!);
    }

    if (params.max_salary) {
      jobs = jobs.filter((j) => (j.salary_min || 0) <= params.max_salary!);
    }

    // Sorting
    if (params.sort_by === 'salary_high') {
      jobs.sort((a, b) => (b.salary_max || b.salary_min || 0) - (a.salary_max || a.salary_min || 0));
    } else if (params.sort_by === 'salary_low') {
      jobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    } else {
      // newest first
      jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const totalRecords = jobs.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 10));
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const offset = (page - 1) * limit;

    const pagedJobs = jobs.slice(offset, offset + limit).map((j) => {
      const comp = store.companies.find((c) => c.id === j.company_id);
      const appCount = store.applications.filter((a) => a.job_id === j.id).length;
      return {
        ...j,
        company_name: comp?.company_name || 'Confidential Employer',
        company_logo: comp?.logo_url || null,
        company_location: comp?.location || j.location,
        applicant_count: appCount,
      };
    });

    return {
      jobs: pagedJobs,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  static async getJobById(id: number): Promise<Job | null> {
    const store = db.getRelationalStore().getStore();
    const job = store.jobs.find((j) => j.id === id);
    if (!job) return null;
    const comp = store.companies.find((c) => c.id === job.company_id);
    const appCount = store.applications.filter((a) => a.job_id === job.id).length;
    return {
      ...job,
      company_name: comp?.company_name || 'Confidential Employer',
      company_logo: comp?.logo_url || null,
      company_location: comp?.location || job.location,
      applicant_count: appCount,
    };
  }

  static async createJob(
    recruiterId: number,
    data: {
      title: string;
      description: string;
      responsibilities: string;
      required_skills: string;
      qualifications: string;
      experience_level: string;
      employment_type: string;
      work_arrangement: string;
      location: string;
      salary_min?: number | null;
      salary_max?: number | null;
      application_deadline?: string | null;
      status?: string;
    }
  ): Promise<Job> {
    const store = db.getRelationalStore().getStore();
    let comp = store.companies.find((c) => c.recruiter_id === recruiterId);
    if (!comp) {
      // Auto-provision basic company if not yet created
      store.counters.companies += 1;
      const now = new Date().toISOString();
      const recruiterUser = store.users.find((u) => u.id === recruiterId);
      comp = {
        id: store.counters.companies,
        recruiter_id: recruiterId,
        company_name: recruiterUser ? `${recruiterUser.full_name}'s Organization` : 'Hiring Company',
        description: 'Organization hiring for tech and business roles.',
        industry: 'Technology',
        company_size: '10-50 employees',
        website: '',
        location: data.location || 'Remote',
        logo_url: null,
        created_at: now,
        updated_at: now,
      };
      store.companies.push(comp);
    }

    store.counters.jobs += 1;
    const now = new Date().toISOString();
    const newJob: Job = {
      id: store.counters.jobs,
      company_id: comp.id,
      recruiter_id: recruiterId,
      title: data.title.trim(),
      description: data.description.trim(),
      responsibilities: data.responsibilities.trim(),
      required_skills: data.required_skills.trim(),
      qualifications: data.qualifications.trim(),
      experience_level: data.experience_level,
      employment_type: data.employment_type,
      work_arrangement: data.work_arrangement,
      location: data.location.trim(),
      salary_min: data.salary_min !== undefined ? Number(data.salary_min) : null,
      salary_max: data.salary_max !== undefined ? Number(data.salary_max) : null,
      application_deadline: data.application_deadline || null,
      status: data.status || 'active',
      created_at: now,
      updated_at: now,
    };

    store.jobs.unshift(newJob);
    db.getRelationalStore().save();

    return {
      ...newJob,
      company_name: comp.company_name,
      company_logo: comp.logo_url,
      company_location: comp.location,
      applicant_count: 0,
    };
  }

  static async updateJob(
    jobId: number,
    recruiterId: number,
    data: Partial<Omit<Job, 'id' | 'company_id' | 'recruiter_id' | 'created_at' | 'updated_at'>>,
    isAdmin = false
  ): Promise<Job | null> {
    const store = db.getRelationalStore().getStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) return null;

    if (!isAdmin && job.recruiter_id !== recruiterId) {
      throw new Error('Unauthorized: You do not own this job listing');
    }

    if (data.title !== undefined) job.title = data.title.trim();
    if (data.description !== undefined) job.description = data.description.trim();
    if (data.responsibilities !== undefined) job.responsibilities = data.responsibilities.trim();
    if (data.required_skills !== undefined) job.required_skills = data.required_skills.trim();
    if (data.qualifications !== undefined) job.qualifications = data.qualifications.trim();
    if (data.experience_level !== undefined) job.experience_level = data.experience_level;
    if (data.employment_type !== undefined) job.employment_type = data.employment_type;
    if (data.work_arrangement !== undefined) job.work_arrangement = data.work_arrangement;
    if (data.location !== undefined) job.location = data.location.trim();
    if (data.salary_min !== undefined) job.salary_min = data.salary_min !== null ? Number(data.salary_min) : null;
    if (data.salary_max !== undefined) job.salary_max = data.salary_max !== null ? Number(data.salary_max) : null;
    if (data.application_deadline !== undefined) job.application_deadline = data.application_deadline;
    if (data.status !== undefined) job.status = data.status;

    job.updated_at = new Date().toISOString();
    db.getRelationalStore().save();

    return this.getJobById(jobId);
  }

  static async deleteJob(jobId: number, recruiterId: number, isAdmin = false): Promise<boolean> {
    const store = db.getRelationalStore().getStore();
    const index = store.jobs.findIndex((j) => j.id === jobId);
    if (index === -1) return false;

    if (!isAdmin && store.jobs[index].recruiter_id !== recruiterId) {
      throw new Error('Unauthorized: You do not own this job listing');
    }

    // Cascade delete applications for this job
    store.applications = store.applications.filter((a) => a.job_id !== jobId);
    store.jobs.splice(index, 1);
    db.getRelationalStore().save();
    return true;
  }

  // ================= APPLICATIONS =================
  static async applyForJob(params: {
    job_id: number;
    applicant_id: number;
    resume_path?: string | null;
    cover_letter?: string | null;
  }): Promise<Application> {
    const store = db.getRelationalStore().getStore();

    // 1. Verify job exists and is active
    const job = store.jobs.find((j) => j.id === params.job_id);
    if (!job) {
      throw new Error('Job listing not found');
    }
    if (job.status !== 'active') {
      throw new Error('This job listing is currently inactive and cannot accept applications');
    }

    // 2. Verify deadline has not passed
    if (job.application_deadline) {
      const deadline = new Date(job.application_deadline);
      // set to end of that day in UTC
      deadline.setHours(23, 59, 59, 999);
      if (Date.now() > deadline.getTime()) {
        throw new Error('The application deadline for this job has expired');
      }
    }

    // 3. Verify user is not already applied (unique constraint)
    const existing = store.applications.find(
      (a) => a.job_id === params.job_id && a.applicant_id === params.applicant_id
    );
    if (existing) {
      throw new Error('You have already applied for this position');
    }

    // 4. Create application
    store.counters.applications += 1;
    const now = new Date().toISOString();
    const newApp: Application = {
      id: store.counters.applications,
      job_id: params.job_id,
      applicant_id: params.applicant_id,
      resume_path: params.resume_path || null,
      cover_letter: params.cover_letter?.trim() || null,
      status: 'APPLIED',
      applied_at: now,
      updated_at: now,
    };

    store.applications.unshift(newApp);
    db.getRelationalStore().save();

    const comp = store.companies.find((c) => c.id === job.company_id);
    return {
      ...newApp,
      job_title: job.title,
      company_name: comp?.company_name || 'Confidential Employer',
    };
  }

  static async getSeekerApplications(applicantId: number): Promise<Application[]> {
    const store = db.getRelationalStore().getStore();
    const apps = store.applications.filter((a) => a.applicant_id === applicantId);

    return apps.map((a) => {
      const job = store.jobs.find((j) => j.id === a.job_id);
      const comp = job ? store.companies.find((c) => c.id === job.company_id) : null;
      return {
        ...a,
        job_title: job?.title || 'Unknown Job',
        company_name: comp?.company_name || 'Employer',
      };
    });
  }

  static async getJobApplications(jobId: number, recruiterId: number, isAdmin = false): Promise<Application[]> {
    const store = db.getRelationalStore().getStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (!isAdmin && job.recruiter_id !== recruiterId) {
      throw new Error('Unauthorized: You cannot view applicants for another recruiter’s job');
    }

    const apps = store.applications.filter((a) => a.job_id === jobId);

    return apps.map((a) => {
      const applicantUser = store.users.find((u) => u.id === a.applicant_id);
      const profile = store.seeker_profiles.find((p) => p.user_id === a.applicant_id);
      return {
        ...a,
        job_title: job.title,
        applicant_name: applicantUser?.full_name || 'Applicant',
        applicant_email: applicantUser?.email || '',
        applicant_phone: applicantUser?.phone || null,
        applicant_skills: profile?.skills || null,
        applicant_headline: profile?.headline || null,
        applicant_education: profile?.education || null,
        applicant_experience: profile?.experience || null,
        resume_path: a.resume_path || profile?.resume_path || null,
      };
    });
  }

  static async updateApplicationStatus(
    applicationId: number,
    recruiterId: number,
    newStatus: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'SELECTED',
    isAdmin = false
  ): Promise<Application> {
    const validStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'SELECTED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const store = db.getRelationalStore().getStore();
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app) {
      throw new Error('Application not found');
    }

    const job = store.jobs.find((j) => j.id === app.job_id);
    if (!job) {
      throw new Error('Associated job not found');
    }

    if (!isAdmin && job.recruiter_id !== recruiterId) {
      throw new Error('Unauthorized: You cannot modify applications for another recruiter’s job');
    }

    app.status = newStatus;
    app.updated_at = new Date().toISOString();
    db.getRelationalStore().save();

    return { ...app };
  }

  // ================= DASHBOARDS & STATISTICS =================
  static async getSeekerDashboard(applicantId: number) {
    const store = db.getRelationalStore().getStore();
    const apps = store.applications.filter((a) => a.applicant_id === applicantId);

    const stats = {
      total: apps.length,
      applied: apps.filter((a) => a.status === 'APPLIED').length,
      shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
      interview: apps.filter((a) => a.status === 'INTERVIEW').length,
      selected: apps.filter((a) => a.status === 'SELECTED').length,
      rejected: apps.filter((a) => a.status === 'REJECTED').length,
    };

    const recentApplications = apps.slice(0, 5).map((a) => {
      const job = store.jobs.find((j) => j.id === a.job_id);
      const comp = job ? store.companies.find((c) => c.id === job.company_id) : null;
      return {
        ...a,
        job_title: job?.title || 'Unknown Job',
        company_name: comp?.company_name || 'Employer',
      };
    });

    return { stats, recentApplications };
  }

  static async getRecruiterDashboard(recruiterId: number) {
    const store = db.getRelationalStore().getStore();
    const jobs = store.jobs.filter((j) => j.recruiter_id === recruiterId);
    const jobIds = jobs.map((j) => j.id);
    const apps = store.applications.filter((a) => jobIds.includes(a.job_id));

    const stats = {
      total_jobs: jobs.length,
      active_jobs: jobs.filter((j) => j.status === 'active').length,
      inactive_jobs: jobs.filter((j) => j.status === 'inactive').length,
      total_applicants: apps.length,
      shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
      interview: apps.filter((a) => a.status === 'INTERVIEW').length,
      selected: apps.filter((a) => a.status === 'SELECTED').length,
      rejected: apps.filter((a) => a.status === 'REJECTED').length,
    };

    const company = store.companies.find((c) => c.recruiter_id === recruiterId) || null;

    return { stats, company, jobsCount: jobs.length };
  }

  static async getPlatformStatistics() {
    const store = db.getRelationalStore().getStore();
    return {
      active_jobs: store.jobs.filter((j) => j.status === 'active').length,
      total_jobs: store.jobs.length,
      registered_seekers: store.users.filter((u) => u.role === 'job_seeker' && u.is_active === 1).length,
      registered_companies: store.companies.length,
      successful_placements: store.applications.filter((a) => a.status === 'SELECTED').length,
      total_applications: store.applications.length,
    };
  }

  static async getAdminData() {
    const store = db.getRelationalStore().getStore();
    const safeUsers = store.users.map(({ password_hash, ...u }) => u);
    return {
      users: safeUsers,
      jobs: store.jobs.map((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        return { ...j, company_name: comp?.company_name || 'Unknown' };
      }),
      companies: store.companies,
      applications: store.applications.map((a) => {
        const job = store.jobs.find((j) => j.id === a.job_id);
        const applicant = store.users.find((u) => u.id === a.applicant_id);
        return {
          ...a,
          job_title: job?.title || 'Unknown',
          applicant_name: applicant?.full_name || 'Unknown',
        };
      }),
      stats: await this.getPlatformStatistics(),
    };
  }
}
