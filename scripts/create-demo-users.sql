-- Demo users for testing the authentication system
-- Run this script to create demo accounts

-- Admin user
INSERT INTO users (name, email, password, role, isActive, createdAt, updatedAt) VALUES 
('Admin User', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'admin', true, NOW(), NOW());

-- Regular user  
INSERT INTO users (name, email, password, role, isActive, createdAt, updatedAt) VALUES 
('John Doe', 'user@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'user', true, NOW(), NOW());

-- Note: Both demo accounts use the password "demo123"
-- In production, these should be created through the registration form
