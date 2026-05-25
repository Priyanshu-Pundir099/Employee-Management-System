-- =============================================
-- Employee Management System — MySQL Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS employee_management_db;
USE employee_management_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status ENUM('NEW', 'ACCEPTED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'NEW',
    assigned_to BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status)
);

-- =============================================
-- Seed Data — Demo Admin and Employee
-- (Passwords are BCrypt-hashed)
-- admin@empms.com : admin123
-- emp@empms.com   : emp123
-- =============================================

INSERT IGNORE INTO users (name, email, password, role) VALUES
(
    'Admin User',
    'admin@empms.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'ADMIN'
),
(
    'John Employee',
    'emp@empms.com',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqrnV5jnGjD.HrFrDpanfWIGiDri',
    'EMPLOYEE'
);

-- Seed tasks
INSERT IGNORE INTO tasks (title, description, due_date, status, assigned_to)
SELECT
    'Design Homepage Mockup',
    'Create a high-fidelity mockup for the new homepage using Figma. Focus on mobile-first design.',
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    'NEW',
    u.id
FROM users u WHERE u.email = 'emp@empms.com';

INSERT IGNORE INTO tasks (title, description, due_date, status, assigned_to)
SELECT
    'Implement REST API Endpoints',
    'Build and document all REST API endpoints for the user module including authentication.',
    DATE_ADD(CURDATE(), INTERVAL 14 DAY),
    'ACCEPTED',
    u.id
FROM users u WHERE u.email = 'emp@empms.com';

INSERT IGNORE INTO tasks (title, description, due_date, status, assigned_to)
SELECT
    'Write Unit Tests',
    'Write JUnit tests for all service layer methods with at least 80% code coverage.',
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    'COMPLETED',
    u.id
FROM users u WHERE u.email = 'emp@empms.com';
