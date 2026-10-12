import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { Companies } from './pages/Companies';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Job Seeker Pages
import { SeekerDashboard } from './pages/seeker/SeekerDashboard';
import { Profile } from './pages/seeker/Profile';
import { MyApplications } from './pages/seeker/MyApplications';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfile } from './pages/recruiter/CompanyProfile';
import { CreateJob } from './pages/recruiter/CreateJob';
import { ManageJobs } from './pages/recruiter/ManageJobs';
import { Applicants } from './pages/recruiter/Applicants';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
      <AlertCircle className="h-8 w-8" />
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
    <p className="mt-2 text-sm text-slate-500 max-w-sm">
      The recruitment page or resource you requested could not be located on JobConnect.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
    >
      <ArrowLeft className="h-4 w-4" />
      Return to Home
    </Link>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Seeker Protected Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/profile"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/applications"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/company"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <CompanyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/create"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <CreateJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <CreateJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <Applicants />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
