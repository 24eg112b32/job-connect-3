-- ===================================================
-- JOBCONNECT – Demonstration Seed Data
-- ===================================================

USE `jobconnect_db`;

-- Note: All sample user accounts use the password: Password123!
-- (Bcrypt hash: $2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu)

-- 1. Insert Users
-- Roles: admin (1), recruiter (2, 3, 4), job_seeker (5, 6, 7)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `phone`, `is_active`) VALUES
(1, 'System Administrator', 'admin@jobconnect.com', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'admin', '+1-555-0100', 1),
(2, 'Sarah Jenkins', 'recruiter@techpulse.io', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'recruiter', '+1-555-0201', 1),
(3, 'Marcus Vance', 'marcus@cloudscale.net', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'recruiter', '+1-555-0202', 1),
(4, 'Elena Rostova', 'elena@novafinance.com', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'recruiter', '+1-555-0203', 1),
(5, 'Alex Rivera', 'seeker@jobconnect.com', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'job_seeker', '+1-555-0301', 1),
(6, 'Priya Sharma', 'priya.sharma@example.com', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'job_seeker', '+1-555-0302', 1),
(7, 'David Chen', 'david.chen@example.com', '$2b$10$OEgD6/LfjE67awPSPs3hGOAJlt9/ePfHzRd7J6aJxpaZwsFZxmbUu', 'job_seeker', '+1-555-0303', 1);

-- 2. Insert Companies
INSERT INTO `companies` (`id`, `recruiter_id`, `company_name`, `description`, `industry`, `company_size`, `website`, `location`, `logo_url`) VALUES
(1, 2, 'TechPulse Solutions', 'Next-generation AI and cloud applications engineering studio dedicated to modern enterprise products.', 'Software Development', '50-200 employees', 'https://techpulse.io', 'San Francisco, CA', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=160&auto=format&fit=crop&q=80'),
(2, 3, 'CloudScale Networks', 'High-throughput distributed infrastructure, zero-trust cloud orchestration, and multi-region microservices.', 'Cloud & Cybersecurity', '201-500 employees', 'https://cloudscale.net', 'Seattle, WA', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80'),
(3, 4, 'Nova Financial Technologies', 'Empowering global institutional and consumer banking through real-time ledger intelligence and algorithmic analytics.', 'Finance & Fintech', '500+ employees', 'https://novafinance.com', 'New York, NY', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80');

-- 3. Insert Job Seeker Profiles
INSERT INTO `seeker_profiles` (`id`, `user_id`, `headline`, `location`, `skills`, `education`, `experience`, `portfolio_url`, `linkedin_url`, `resume_path`) VALUES
(1, 5, 'Senior Full-Stack Engineer | React, TypeScript & Node.js', 'Austin, TX', 'React, TypeScript, Node.js, Express, MySQL, PostgreSQL, Docker, Tailwind CSS', 'B.S. in Computer Science - University of Texas at Austin', '5+ years building scalable web architectures and microservices at SaaS firms.', 'https://alexrivera.dev', 'https://linkedin.com/in/alexrivera-demo', 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf'),
(2, 6, 'Data Scientist & Machine Learning Specialist', 'San Jose, CA', 'Python, PyTorch, SQL, Pandas, Scikit-Learn, AWS SageMaker, Tableau', 'M.S. in Data Science - Stanford University', '3 years research and production model deployment in computer vision and NLP.', 'https://priyasharma.ai', 'https://linkedin.com/in/priyasharma-demo', 'https://jobconnect.storage/resumes/priya_sharma_resume.pdf'),
(3, 7, 'Cybersecurity Analyst & Systems Auditor', 'Chicago, IL', 'Network Security, SIEM, Penetration Testing, Linux, Wireshark, ISO 27001', 'B.S. in Cybersecurity - University of Illinois', '4 years securing fintech infrastructures, vulnerability triage, and SOC operations.', 'https://davidchen-sec.io', 'https://linkedin.com/in/davidchen-demo', 'https://jobconnect.storage/resumes/david_chen_resume.pdf');

-- 4. Insert Jobs
INSERT INTO `jobs` (`id`, `company_id`, `recruiter_id`, `title`, `description`, `responsibilities`, `required_skills`, `qualifications`, `experience_level`, `employment_type`, `work_arrangement`, `location`, `salary_min`, `salary_max`, `application_deadline`, `status`) VALUES
(1, 1, 2, 'Senior Full Stack Engineer', 
'Join TechPulse Solutions to build out our high-performance distributed workflow automation suite. You will collaborate with product designers, AI specialists, and platform engineers to deliver crisp frontend experiences and robust backend APIs.',
'- Design, develop, and maintain modern web applications with React, TypeScript, and Express.\n- Architect relational schemas in MySQL with optimized indexing and queries.\n- Collaborate in an agile sprint lifecycle with cross-functional teams.\n- Maintain high unit and integration test coverage across core microservices.',
'React, TypeScript, Node.js, Express, MySQL, REST APIs, Tailwind CSS',
'Bachelor degree in Computer Science or equivalent practical industry experience. 4+ years of professional full-stack development experience.',
'Senior', 'Full-time', 'Remote', 'Remote / San Francisco, CA', 140000.00, 175000.00, '2026-12-31', 'active'),

(2, 1, 2, 'Lead Artificial Intelligence Engineer', 
'Lead our core AI intelligence team researching and operationalizing multimodal generative reasoning workflows for real-time customer analytics.',
'- Build and scale inference pipelines and LLM tooling.\n- Integrate vector retrieval with structured relational databases.\n- Optimize latency and inference costs across high-traffic API workloads.\n- Mentor junior and mid-level machine learning engineers.',
'Python, PyTorch, LLM Fine-Tuning, TypeScript, Vector DBs, MySQL',
'M.S. or Ph.D. in Computer Science or AI/ML. 5+ years of engineering experience with at least 2 years in production ML pipelines.',
'Lead', 'Full-time', 'Hybrid', 'San Francisco, CA', 185000.00, 230000.00, '2026-11-30', 'active'),

(3, 2, 3, 'DevOps & Cloud Security Specialist', 
'CloudScale Networks is looking for an infrastructure engineer to safeguard our multi-region Kubernetes clusters and implement zero-trust telemetry.',
'- Implement Terraform configuration-as-code across multi-cloud deployments.\n- Harden Linux kernel parameters, TLS termination, and ingress security.\n- Automate CI/CD pipelines with comprehensive vulnerability scanning.\n- Conduct chaos engineering audits and disaster recovery drills.',
'Kubernetes, Docker, Terraform, AWS, Linux, CI/CD, Network Security',
'B.S. in Computer Science or related degree. 3+ years in cloud infrastructure and security compliance.',
'Mid-level', 'Full-time', 'Remote', 'Remote / Seattle, WA', 130000.00, 160000.00, '2026-12-15', 'active'),

(4, 3, 4, 'Senior Quantitative Risk Analyst', 
'Nova Financial is expanding our algorithmic risk management group. You will formulate probabilistic risk models for high-velocity trade settlement.',
'- Formulate mathematical and statistical models for market and liquidity risk.\n- Query multi-gigabyte transactional ledgers using high-performance SQL.\n- Partner with algorithmic trading desks to backtest real-time signals.\n- Build executive risk visualization dashboards.',
'SQL, Python, Risk Modeling, Financial Derivatives, Monte Carlo Simulations',
'Master or advanced degree in Financial Engineering, Mathematics, or Econometrics. 4+ years in quantitative trading or risk analysis.',
'Senior', 'Full-time', 'On-site', 'New York, NY', 160000.00, 210000.00, '2026-11-20', 'active'),

(5, 1, 2, 'Product Design Lead (UI/UX)', 
'Lead end-to-end design across our suite of collaboration tools. Transform complex enterprise workflows into intuitive, beautiful experiences.',
'- Conduct user interviews and synthesize actionable research insights.\n- Create high-fidelity design systems, components, and prototypes in Figma.\n- Partner closely with frontend engineers to ensure pixel-perfect fidelity.\n- Champion accessibility (WCAG 2.1 AA) and micro-interactions.',
'Figma, UI/UX Design, Design Systems, User Research, Prototyping',
'5+ years designing enterprise or developer-facing web applications with a standout portfolio.',
'Lead', 'Full-time', 'Remote', 'Remote, USA', 135000.00, 165000.00, '2026-12-28', 'active'),

(6, 2, 3, 'Frontend React Intern', 
'Kickstart your career with CloudScale Networks. You will work side-by-side with senior staff engineers to craft modern dashboard modules.',
'- Build reusable React component interfaces with Tailwind CSS.\n- Integrate with backend REST APIs and handle asynchronous states.\n- Participate in code reviews and test automation sprints.\n- Learn modern frontend bundling, profiling, and state management.',
'React, JavaScript, HTML5, CSS3, Git, REST APIs',
'Currently pursuing a degree in Computer Science, Software Engineering, or recent bootcamp graduate.',
'Entry-level', 'Internship', 'Hybrid', 'Seattle, WA', 45000.00, 60000.00, '2026-12-10', 'active');

-- 5. Insert Applications
INSERT INTO `applications` (`id`, `job_id`, `applicant_id`, `resume_path`, `cover_letter`, `status`, `applied_at`) VALUES
(1, 1, 5, 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf', 'I have spent the past five years building resilient full-stack applications with React and Node.js. Excited by TechPulse\'s modern engineering culture!', 'SHORTLISTED', '2026-10-01 09:30:00'),
(2, 2, 6, 'https://priyasharma.ai/resume.pdf', 'My research background in multimodal models and production experience deploying PyTorch pipelines align directly with your AI lead responsibilities.', 'INTERVIEW', '2026-10-02 14:15:00'),
(3, 3, 7, 'https://davidchen-sec.io/resume.pdf', 'Passionate about zero-trust container orchestration and cloud hardening. Look forward to discussing how I can protect CloudScale infrastructure.', 'APPLIED', '2026-10-05 11:20:00');
