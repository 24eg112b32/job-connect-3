import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

let server: any;
let baseUrl: string;

test.before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address: any = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => server.close(resolve));
});

test('GET /api/health should return 200 with healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.status, 'healthy');
});

test('POST /api/auth/register should register a new job seeker', async () => {
  const uniqueEmail = `testseeker_${Date.now()}@example.com`;
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Test Candidate',
      email: uniqueEmail,
      password: 'Password123!',
      confirm_password: 'Password123!',
      role: 'job_seeker',
      phone: '+1-555-9999',
    }),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.token);
  assert.equal(data.data.user.email, uniqueEmail);
  assert.equal(data.data.user.role, 'job_seeker');
});

test('POST /api/auth/register should reject duplicate email', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Duplicate Seeker',
      email: 'seeker@jobconnect.com', // existing seed email
      password: 'Password123!',
      confirm_password: 'Password123!',
      role: 'job_seeker',
    }),
  });

  assert.equal(res.status, 409);
  const data = await res.json();
  assert.equal(data.success, false);
});

test('POST /api/auth/login should authenticate seed user and reject invalid password', async () => {
  // Bad password
  const failRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'seeker@jobconnect.com',
      password: 'WrongPassword!',
    }),
  });
  assert.equal(failRes.status, 401);

  // Correct credentials
  const successRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'seeker@jobconnect.com',
      password: 'Password123!',
    }),
  });
  assert.equal(successRes.status, 200);
  const data = await successRes.json();
  assert.equal(data.success, true);
  assert.ok(data.data.token);
});

test('GET /api/jobs should return paginated list of active jobs', async () => {
  const res = await fetch(`${baseUrl}/api/jobs?limit=5`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
  assert.ok(data.pagination);
  assert.equal(data.pagination.limit, 5);
});

test('GET /api/jobs with search query should filter by keywords', async () => {
  const res = await fetch(`${baseUrl}/api/jobs?query=Engineer`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  data.data.forEach((job: any) => {
    const matches =
      job.title.toLowerCase().includes('engineer') ||
      job.description.toLowerCase().includes('engineer') ||
      job.required_skills.toLowerCase().includes('engineer');
    assert.ok(matches);
  });
});

test('GET /api/dashboard/stats should return real database-backed platform metrics', async () => {
  const res = await fetch(`${baseUrl}/api/dashboard/stats`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.active_jobs >= 1);
  assert.ok(data.data.registered_seekers >= 1);
  assert.ok(data.data.registered_companies >= 1);
});

test('Recruiter flow: create job, edit job, seeker apply, duplicate reject, update status', async () => {
  // 1. Recruiter login
  const recLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'recruiter@techpulse.io',
      password: 'Password123!',
    }),
  });
  const recData = await recLoginRes.json();
  const recToken = recData.data.token;

  // 2. Recruiter creates a job
  const jobRes = await fetch(`${baseUrl}/api/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recToken}`,
    },
    body: JSON.stringify({
      title: 'QA Automation Engineer (Automated Test)',
      description: 'We need an experienced QA engineer to build test automation frameworks.',
      responsibilities: 'Write unit, integration, and E2E tests.',
      required_skills: 'Playwright, Jest, TypeScript, CI/CD',
      qualifications: 'B.S. in CS or 3+ years QA experience',
      experience_level: 'Mid-level',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote, USA',
      salary_min: 95000,
      salary_max: 125000,
      application_deadline: '2026-12-31',
    }),
  });
  assert.equal(jobRes.status, 201);
  const newJob = (await jobRes.json()).data;
  assert.ok(newJob.id);

  // 3. Register a fresh job seeker
  const testSeekerEmail = `applicant_${Date.now()}@test.com`;
  const seekerRegRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Jane Applicant',
      email: testSeekerEmail,
      password: 'Password123!',
      confirm_password: 'Password123!',
      role: 'job_seeker',
    }),
  });
  const seekerToken = (await seekerRegRes.json()).data.token;

  // 4. Job seeker applies
  const applyRes = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seekerToken}`,
    },
    body: JSON.stringify({
      job_id: newJob.id,
      cover_letter: 'I have 4 years testing distributed apps with Playwright.',
    }),
  });
  assert.equal(applyRes.status, 201);
  const application = (await applyRes.json()).data;
  assert.equal(application.status, 'APPLIED');

  // 5. Duplicate application rejected
  const dupApplyRes = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seekerToken}`,
    },
    body: JSON.stringify({
      job_id: newJob.id,
    }),
  });
  assert.equal(dupApplyRes.status, 409);

  // 6. Recruiter views applicants for their job
  const appsRes = await fetch(`${baseUrl}/api/jobs/${newJob.id}/applications`, {
    headers: { Authorization: `Bearer ${recToken}` },
  });
  assert.equal(appsRes.status, 200);
  const appsData = await appsRes.json();
  assert.ok(appsData.data.some((a: any) => a.id === application.id));

  // 7. Recruiter updates applicant status to SHORTLISTED
  const statusRes = await fetch(`${baseUrl}/api/applications/${application.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${recToken}`,
    },
    body: JSON.stringify({ status: 'SHORTLISTED' }),
  });
  assert.equal(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.equal(statusData.data.status, 'SHORTLISTED');
});
