-- ===================================================
-- JOBCONNECT – MySQL Database Schema
-- Database Name: jobconnect_db
-- ===================================================

CREATE DATABASE IF NOT EXISTS `jobconnect_db` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `jobconnect_db`;

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `seeker_profiles`;
DROP TABLE IF EXISTS `users`;

-- ---------------------------------------------------
-- 1. Table: users
-- ---------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('job_seeker', 'recruiter', 'admin') NOT NULL DEFAULT 'job_seeker',
  `phone` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- 2. Table: seeker_profiles
-- ---------------------------------------------------
CREATE TABLE `seeker_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `headline` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `skills` TEXT DEFAULT NULL,
  `education` TEXT DEFAULT NULL,
  `experience` TEXT DEFAULT NULL,
  `portfolio_url` VARCHAR(500) DEFAULT NULL,
  `linkedin_url` VARCHAR(500) DEFAULT NULL,
  `resume_path` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_seeker_profiles_user` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- 3. Table: companies
-- ---------------------------------------------------
CREATE TABLE `companies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recruiter_id` INT NOT NULL UNIQUE,
  `company_name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `company_size` VARCHAR(50) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_companies_recruiter` 
    FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_companies_industry` (`industry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- 4. Table: jobs
-- ---------------------------------------------------
CREATE TABLE `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT NOT NULL,
  `recruiter_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `responsibilities` TEXT NOT NULL,
  `required_skills` TEXT NOT NULL,
  `qualifications` TEXT NOT NULL,
  `experience_level` VARCHAR(50) NOT NULL, -- Entry-level, Mid-level, Senior, Lead
  `employment_type` VARCHAR(50) NOT NULL, -- Full-time, Part-time, Internship, Contract, Freelance
  `work_arrangement` VARCHAR(50) NOT NULL, -- On-site, Remote, Hybrid
  `location` VARCHAR(255) NOT NULL,
  `salary_min` DECIMAL(12,2) DEFAULT NULL,
  `salary_max` DECIMAL(12,2) DEFAULT NULL,
  `application_deadline` DATE DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_jobs_company` 
    FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jobs_recruiter` 
    FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_title` (`title`),
  INDEX `idx_jobs_location` (`location`),
  INDEX `idx_jobs_employment_type` (`employment_type`),
  INDEX `idx_jobs_work_arrangement` (`work_arrangement`),
  INDEX `idx_jobs_experience_level` (`experience_level`),
  INDEX `idx_jobs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- 5. Table: applications
-- ---------------------------------------------------
CREATE TABLE `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `applicant_id` INT NOT NULL,
  `resume_path` VARCHAR(500) DEFAULT NULL,
  `cover_letter` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'APPLIED', -- APPLIED, SHORTLISTED, INTERVIEW, REJECTED, SELECTED
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_applications_job` 
    FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_applications_applicant` 
    FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `unique_job_applicant` UNIQUE (`job_id`, `applicant_id`),
  INDEX `idx_applications_job` (`job_id`),
  INDEX `idx_applications_applicant` (`applicant_id`),
  INDEX `idx_applications_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
