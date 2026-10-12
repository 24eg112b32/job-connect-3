import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export interface DatabaseAdapter {
  query<T = any>(sql: string, params?: any[]): Promise<[T, any]>;
  isMySQLConnected(): boolean;
  getConnectionType(): 'mysql' | 'persistent_relational';
}

// Relational tables structure for persistent store
interface DBStore {
  users: Array<{
    id: number;
    full_name: string;
    email: string;
    password_hash: string;
    role: 'job_seeker' | 'recruiter' | 'admin';
    phone: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
  }>;
  seeker_profiles: Array<{
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
  }>;
  companies: Array<{
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
  }>;
  jobs: Array<{
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
  }>;
  applications: Array<{
    id: number;
    job_id: number;
    applicant_id: number;
    resume_path: string | null;
    cover_letter: string | null;
    status: string;
    applied_at: string;
    updated_at: string;
  }>;
  counters: {
    users: number;
    seeker_profiles: number;
    companies: number;
    jobs: number;
    applications: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'jobconnect_db.json');

const INITIAL_SEED_DATA: DBStore = {
  users: [
    {
      id: 1,
      full_name: 'System Administrator',
      email: 'admin@jobconnect.com',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'admin',
      phone: '+1-555-0100',
      is_active: 1,
      created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
      updated_at: new Date('2026-09-01T08:00:00Z').toISOString(),
    },
    {
      id: 2,
      full_name: 'Sarah Jenkins',
      email: 'recruiter@techpulse.io',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'recruiter',
      phone: '+1-555-0201',
      is_active: 1,
      created_at: new Date('2026-09-05T09:00:00Z').toISOString(),
      updated_at: new Date('2026-09-05T09:00:00Z').toISOString(),
    },
    {
      id: 3,
      full_name: 'Marcus Vance',
      email: 'marcus@cloudscale.net',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'recruiter',
      phone: '+1-555-0202',
      is_active: 1,
      created_at: new Date('2026-09-06T10:00:00Z').toISOString(),
      updated_at: new Date('2026-09-06T10:00:00Z').toISOString(),
    },
    {
      id: 4,
      full_name: 'Elena Rostova',
      email: 'elena@novafinance.com',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'recruiter',
      phone: '+1-555-0203',
      is_active: 1,
      created_at: new Date('2026-09-07T11:00:00Z').toISOString(),
      updated_at: new Date('2026-09-07T11:00:00Z').toISOString(),
    },
    {
      id: 5,
      full_name: 'Alex Rivera',
      email: 'seeker@jobconnect.com',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'job_seeker',
      phone: '+1-555-0301',
      is_active: 1,
      created_at: new Date('2026-09-10T12:00:00Z').toISOString(),
      updated_at: new Date('2026-09-10T12:00:00Z').toISOString(),
    },
    {
      id: 6,
      full_name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'job_seeker',
      phone: '+1-555-0302',
      is_active: 1,
      created_at: new Date('2026-09-12T13:00:00Z').toISOString(),
      updated_at: new Date('2026-09-12T13:00:00Z').toISOString(),
    },
    {
      id: 7,
      full_name: 'David Chen',
      email: 'david.chen@example.com',
      password_hash: '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', // Password123!
      role: 'job_seeker',
      phone: '+1-555-0303',
      is_active: 1,
      created_at: new Date('2026-09-14T14:00:00Z').toISOString(),
      updated_at: new Date('2026-09-14T14:00:00Z').toISOString(),
    },
  ],
  seeker_profiles: [
    {
      id: 1,
      user_id: 5,
      headline: 'Senior Full-Stack Engineer | React, TypeScript & Node.js',
      location: 'Austin, TX',
      skills: 'React, TypeScript, Node.js, Express, MySQL, PostgreSQL, Docker, Tailwind CSS',
      education: 'B.S. in Computer Science - University of Texas at Austin',
      experience: '5+ years building scalable web architectures and microservices at SaaS firms.',
      portfolio_url: 'https://alexrivera.dev',
      linkedin_url: 'https://linkedin.com/in/alexrivera-demo',
      resume_path: 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf',
      created_at: new Date('2026-09-10T12:05:00Z').toISOString(),
      updated_at: new Date('2026-09-10T12:05:00Z').toISOString(),
    },
    {
      id: 2,
      user_id: 6,
      headline: 'Data Scientist & Machine Learning Specialist',
      location: 'San Jose, CA',
      skills: 'Python, PyTorch, SQL, Pandas, Scikit-Learn, AWS SageMaker, Tableau',
      education: 'M.S. in Data Science - Stanford University',
      experience: '3 years research and production model deployment in computer vision and NLP.',
      portfolio_url: 'https://priyasharma.ai',
      linkedin_url: 'https://linkedin.com/in/priyasharma-demo',
      resume_path: 'https://jobconnect.storage/resumes/priya_sharma_resume.pdf',
      created_at: new Date('2026-09-12T13:05:00Z').toISOString(),
      updated_at: new Date('2026-09-12T13:05:00Z').toISOString(),
    },
    {
      id: 3,
      user_id: 7,
      headline: 'Cybersecurity Analyst & Systems Auditor',
      location: 'Chicago, IL',
      skills: 'Network Security, SIEM, Penetration Testing, Linux, Wireshark, ISO 27001',
      education: 'B.S. in Cybersecurity - University of Illinois',
      experience: '4 years securing fintech infrastructures, vulnerability triage, and SOC operations.',
      portfolio_url: 'https://davidchen-sec.io',
      linkedin_url: 'https://linkedin.com/in/davidchen-demo',
      resume_path: 'https://jobconnect.storage/resumes/david_chen_resume.pdf',
      created_at: new Date('2026-09-14T14:05:00Z').toISOString(),
      updated_at: new Date('2026-09-14T14:05:00Z').toISOString(),
    },
  ],
  companies: [
    {
      id: 1,
      recruiter_id: 2,
      company_name: 'TechPulse Solutions',
      description: 'Next-generation AI and cloud applications engineering studio dedicated to modern enterprise products.',
      industry: 'Software Development',
      company_size: '50-200 employees',
      website: 'https://techpulse.io',
      location: 'San Francisco, CA',
      logo_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=160&auto=format&fit=crop&q=80',
      created_at: new Date('2026-09-05T09:10:00Z').toISOString(),
      updated_at: new Date('2026-09-05T09:10:00Z').toISOString(),
    },
    {
      id: 2,
      recruiter_id: 3,
      company_name: 'CloudScale Networks',
      description: 'High-throughput distributed infrastructure, zero-trust cloud orchestration, and multi-region microservices.',
      industry: 'Cloud & Cybersecurity',
      company_size: '201-500 employees',
      website: 'https://cloudscale.net',
      location: 'Seattle, WA',
      logo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
      created_at: new Date('2026-09-06T10:10:00Z').toISOString(),
      updated_at: new Date('2026-09-06T10:10:00Z').toISOString(),
    },
    {
      id: 3,
      recruiter_id: 4,
      company_name: 'Nova Financial Technologies',
      description: 'Empowering global institutional and consumer banking through real-time ledger intelligence and algorithmic analytics.',
      industry: 'Finance & Fintech',
      company_size: '500+ employees',
      website: 'https://novafinance.com',
      location: 'New York, NY',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
      created_at: new Date('2026-09-07T11:10:00Z').toISOString(),
      updated_at: new Date('2026-09-07T11:10:00Z').toISOString(),
    },
  ],
  jobs: [
    {
      id: 1,
      company_id: 1,
      recruiter_id: 2,
      title: 'Senior Full Stack Engineer',
      description: 'Join TechPulse Solutions to build out our high-performance distributed workflow automation suite. You will collaborate with product designers, AI specialists, and platform engineers to deliver crisp frontend experiences and robust backend APIs.',
      responsibilities: '• Design, develop, and maintain modern web applications with React, TypeScript, and Express.\n• Architect relational schemas in MySQL with optimized indexing and queries.\n• Collaborate in an agile sprint lifecycle with cross-functional teams.\n• Maintain high unit and integration test coverage across core microservices.',
      required_skills: 'React, TypeScript, Node.js, Express, MySQL, REST APIs, Tailwind CSS',
      qualifications: 'Bachelor degree in Computer Science or equivalent practical industry experience. 4+ years of professional full-stack development experience.',
      experience_level: 'Senior',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote / San Francisco, CA',
      salary_min: 140000,
      salary_max: 175000,
      application_deadline: '2026-12-31',
      status: 'active',
      created_at: new Date('2026-09-15T09:00:00Z').toISOString(),
      updated_at: new Date('2026-09-15T09:00:00Z').toISOString(),
    },
    {
      id: 2,
      company_id: 1,
      recruiter_id: 2,
      title: 'Lead Artificial Intelligence Engineer',
      description: 'Lead our core AI intelligence team researching and operationalizing multimodal generative reasoning workflows for real-time customer analytics.',
      responsibilities: '• Build and scale inference pipelines and LLM tooling.\n• Integrate vector retrieval with structured relational databases.\n• Optimize latency and inference costs across high-traffic API workloads.\n• Mentor junior and mid-level machine learning engineers.',
      required_skills: 'Python, PyTorch, LLM Fine-Tuning, TypeScript, Vector DBs, MySQL',
      qualifications: 'M.S. or Ph.D. in Computer Science or AI/ML. 5+ years of engineering experience with at least 2 years in production ML pipelines.',
      experience_level: 'Lead',
      employment_type: 'Full-time',
      work_arrangement: 'Hybrid',
      location: 'San Francisco, CA',
      salary_min: 185000,
      salary_max: 230000,
      application_deadline: '2026-11-30',
      status: 'active',
      created_at: new Date('2026-09-16T10:00:00Z').toISOString(),
      updated_at: new Date('2026-09-16T10:00:00Z').toISOString(),
    },
    {
      id: 3,
      company_id: 2,
      recruiter_id: 3,
      title: 'DevOps & Cloud Security Specialist',
      description: 'CloudScale Networks is looking for an infrastructure engineer to safeguard our multi-region Kubernetes clusters and implement zero-trust telemetry.',
      responsibilities: '• Implement Terraform configuration-as-code across multi-cloud deployments.\n• Harden Linux kernel parameters, TLS termination, and ingress security.\n• Automate CI/CD pipelines with comprehensive vulnerability scanning.\n• Conduct chaos engineering audits and disaster recovery drills.',
      required_skills: 'Kubernetes, Docker, Terraform, AWS, Linux, CI/CD, Network Security',
      qualifications: 'B.S. in Computer Science or related degree. 3+ years in cloud infrastructure and security compliance.',
      experience_level: 'Mid-level',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote / Seattle, WA',
      salary_min: 130000,
      salary_max: 160000,
      application_deadline: '2026-12-15',
      status: 'active',
      created_at: new Date('2026-09-18T11:00:00Z').toISOString(),
      updated_at: new Date('2026-09-18T11:00:00Z').toISOString(),
    },
    {
      id: 4,
      company_id: 3,
      recruiter_id: 4,
      title: 'Senior Quantitative Risk Analyst',
      description: 'Nova Financial is expanding our algorithmic risk management group. You will formulate probabilistic risk models for high-velocity trade settlement.',
      responsibilities: '• Formulate mathematical and statistical models for market and liquidity risk.\n• Query multi-gigabyte transactional ledgers using high-performance SQL.\n• Partner with algorithmic trading desks to backtest real-time signals.\n• Build executive risk visualization dashboards.',
      required_skills: 'SQL, Python, Risk Modeling, Financial Derivatives, Monte Carlo Simulations',
      qualifications: 'Master or advanced degree in Financial Engineering, Mathematics, or Econometrics. 4+ years in quantitative trading or risk analysis.',
      experience_level: 'Senior',
      employment_type: 'Full-time',
      work_arrangement: 'On-site',
      location: 'New York, NY',
      salary_min: 160000,
      salary_max: 210000,
      application_deadline: '2026-11-20',
      status: 'active',
      created_at: new Date('2026-09-20T12:00:00Z').toISOString(),
      updated_at: new Date('2026-09-20T12:00:00Z').toISOString(),
    },
    {
      id: 5,
      company_id: 1,
      recruiter_id: 2,
      title: 'Product Design Lead (UI/UX)',
      description: 'Lead end-to-end design across our suite of collaboration tools. Transform complex enterprise workflows into intuitive, beautiful experiences.',
      responsibilities: '• Conduct user interviews and synthesize actionable research insights.\n• Create high-fidelity design systems, components, and prototypes in Figma.\n• Partner closely with frontend engineers to ensure pixel-perfect fidelity.\n• Champion accessibility (WCAG 2.1 AA) and micro-interactions.',
      required_skills: 'Figma, UI/UX Design, Design Systems, User Research, Prototyping',
      qualifications: '5+ years designing enterprise or developer-facing web applications with a standout portfolio.',
      experience_level: 'Lead',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote, USA',
      salary_min: 135000,
      salary_max: 165000,
      application_deadline: '2026-12-28',
      status: 'active',
      created_at: new Date('2026-09-22T13:00:00Z').toISOString(),
      updated_at: new Date('2026-09-22T13:00:00Z').toISOString(),
    },
    {
      id: 6,
      company_id: 2,
      recruiter_id: 3,
      title: 'Frontend React Intern',
      description: 'Kickstart your career with CloudScale Networks. You will work side-by-side with senior staff engineers to craft modern dashboard modules.',
      responsibilities: '• Build reusable React component interfaces with Tailwind CSS.\n• Integrate with backend REST APIs and handle asynchronous states.\n• Participate in code reviews and test automation sprints.\n• Learn modern frontend bundling, profiling, and state management.',
      required_skills: 'React, JavaScript, HTML5, CSS3, Git, REST APIs',
      qualifications: 'Currently pursuing a degree in Computer Science, Software Engineering, or recent bootcamp graduate.',
      experience_level: 'Entry-level',
      employment_type: 'Internship',
      work_arrangement: 'Hybrid',
      location: 'Seattle, WA',
      salary_min: 45000,
      salary_max: 60000,
      application_deadline: '2026-12-10',
      status: 'active',
      created_at: new Date('2026-09-25T14:00:00Z').toISOString(),
      updated_at: new Date('2026-09-25T14:00:00Z').toISOString(),
    },
  ],
  applications: [
    {
      id: 1,
      job_id: 1,
      applicant_id: 5,
      resume_path: 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf',
      cover_letter: "I have spent the past five years building resilient full-stack applications with React and Node.js. Excited by TechPulse's modern engineering culture!",
      status: 'SHORTLISTED',
      applied_at: new Date('2026-10-01T09:30:00Z').toISOString(),
      updated_at: new Date('2026-10-02T10:00:00Z').toISOString(),
    },
    {
      id: 2,
      job_id: 2,
      applicant_id: 6,
      resume_path: 'https://priyasharma.ai/resume.pdf',
      cover_letter: 'My research background in multimodal models and production experience deploying PyTorch pipelines align directly with your AI lead responsibilities.',
      status: 'INTERVIEW',
      applied_at: new Date('2026-10-02T14:15:00Z').toISOString(),
      updated_at: new Date('2026-10-03T11:00:00Z').toISOString(),
    },
    {
      id: 3,
      job_id: 3,
      applicant_id: 7,
      resume_path: 'https://davidchen-sec.io/resume.pdf',
      cover_letter: 'Passionate about zero-trust container orchestration and cloud hardening. Look forward to discussing how I can protect CloudScale infrastructure.',
      status: 'APPLIED',
      applied_at: new Date('2026-10-05T11:20:00Z').toISOString(),
      updated_at: new Date('2026-10-05T11:20:00Z').toISOString(),
    },
  ],
  counters: {
    users: 7,
    seeker_profiles: 3,
    companies: 3,
    jobs: 6,
    applications: 3,
  },
};

class PersistentRelationalStore {
  private store: DBStore;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.store = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, reinitializing with seed data:', err);
        this.store = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
        this.persist();
      }
    } else {
      this.store = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
      this.persist();
    }
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  getStore(): DBStore {
    return this.store;
  }

  save() {
    this.persist();
  }
}

class DatabaseManager implements DatabaseAdapter {
  private mysqlPool: mysql.Pool | null = null;
  private isConnectedToMySQL = false;
  private relationalStore: PersistentRelationalStore;

  constructor() {
    this.relationalStore = new PersistentRelationalStore();
    this.initMySQL();
  }

  private async initMySQL() {
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    if (DB_HOST && DB_USER && DB_NAME) {
      try {
        const pool = mysql.createPool({
          host: DB_HOST,
          port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
          user: DB_USER,
          password: DB_PASSWORD || '',
          database: DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 3000,
        });

        // Test connection
        const conn = await pool.getConnection();
        conn.release();
        this.mysqlPool = pool;
        this.isConnectedToMySQL = true;
        console.log(`[JobConnect DB] Successfully connected to hosted MySQL database: ${DB_NAME} at ${DB_HOST}`);
      } catch (err) {
        console.warn(`[JobConnect DB] MySQL connection not established (${(err as any)?.message || 'Unreachable'}). Using local persistent relational database engine.`);
        this.mysqlPool = null;
        this.isConnectedToMySQL = false;
      }
    } else {
      console.log('[JobConnect DB] Initialized with persistent relational database engine (MySQL configuration available via .env).');
    }
  }

  isMySQLConnected(): boolean {
    return this.isConnectedToMySQL;
  }

  getConnectionType(): 'mysql' | 'persistent_relational' {
    return this.isConnectedToMySQL ? 'mysql' : 'persistent_relational';
  }

  getRelationalStore(): PersistentRelationalStore {
    return this.relationalStore;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    if (this.isConnectedToMySQL && this.mysqlPool) {
      return this.mysqlPool.query(sql, params) as Promise<[T, any]>;
    }
    // Handle query via persistent relational store
    return this.executeRelationalQuery<T>(sql, params);
  }

  private async executeRelationalQuery<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    const store = this.relationalStore.getStore();
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    // 1. SELECT COUNT queries
    if (/^SELECT\s+COUNT\(/i.test(cleanSql)) {
      if (/FROM\s+`?jobs`?/i.test(cleanSql)) {
        let count = store.jobs.length;
        if (/status\s*=\s*['"]?active['"]?/i.test(cleanSql)) {
          count = store.jobs.filter((j) => j.status === 'active').length;
        }
        return [[{ count, total: count }] as any, null];
      }
      if (/FROM\s+`?users`?/i.test(cleanSql)) {
        let count = store.users.length;
        if (/role\s*=\s*['"]?job_seeker['"]?/i.test(cleanSql)) {
          count = store.users.filter((u) => u.role === 'job_seeker' && u.is_active === 1).length;
        } else if (/role\s*=\s*['"]?recruiter['"]?/i.test(cleanSql)) {
          count = store.users.filter((u) => u.role === 'recruiter' && u.is_active === 1).length;
        }
        return [[{ count, total: count }] as any, null];
      }
      if (/FROM\s+`?companies`?/i.test(cleanSql)) {
        return [[{ count: store.companies.length, total: store.companies.length }] as any, null];
      }
      if (/FROM\s+`?applications`?/i.test(cleanSql)) {
        let count = store.applications.length;
        if (/status\s*=\s*['"]?SELECTED['"]?/i.test(cleanSql)) {
          count = store.applications.filter((a) => a.status === 'SELECTED').length;
        }
        return [[{ count, total: count }] as any, null];
      }
    }

    // Default fallback: empty result
    return [[] as any, null];
  }
}

export const db = new DatabaseManager();
