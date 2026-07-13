-- ================================================
-- AI Placement Preparation Portal - Database Schema
-- Author: Udaya Kumar K J
-- GitHub: https://github.com/udaygowda-cell
-- ================================================

CREATE DATABASE IF NOT EXISTS placement_portal;
USE placement_portal;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    college VARCHAR(200),
    branch VARCHAR(100),
    graduation_year INT,
    profile_picture VARCHAR(500),
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    extracted_text TEXT,
    ats_score INT,
    ats_suggestions TEXT,
    skills TEXT,
    experience TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL,
    explanation TEXT,
    category ENUM('JAVA','REACT','SQL','HR','DSA','PYTHON','GENERAL') NOT NULL,
    difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category ENUM('JAVA','REACT','SQL','HR','DSA','PYTHON','GENERAL') NOT NULL,
    difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score INT NOT NULL,
    time_taken INT NOT NULL,
    answers_json TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    category ENUM('JAVA','REACT','SQL','HR','DSA','PYTHON','GENERAL'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================
-- SAMPLE DATA
-- ================================================

-- Admin user (password: admin123)
INSERT INTO users (full_name, username, email, password, role) VALUES
('Udaya Kumar K J', 'udayakumar', 'udaya@placement.com', 
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');

-- Regular test user (password: user123)
INSERT INTO users (full_name, username, email, password, college, branch, graduation_year) VALUES
('Test User', 'testuser', 'test@example.com', 
 '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'VTU University', 'Computer Science', 2024);

-- Sample Java Questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES
('What is the default value of an int variable in Java?', '0', 'null', '-1', 'undefined', 'A', 
 'In Java, int primitive type has a default value of 0 when declared as an instance variable.', 'JAVA', 'EASY'),

('Which of the following is NOT a feature of Java?', 'Platform Independent', 'Pointers', 
 'Object Oriented', 'Multithreading', 'B', 
 'Java does not support pointers directly, unlike C/C++. This is one of Java''s security features.', 'JAVA', 'EASY'),

('What is the purpose of the "final" keyword in Java?', 'Makes code run faster', 
 'Prevents modification of variables, methods, or classes', 'Creates a new thread', 'Handles exceptions', 
 'B', 'The final keyword prevents a variable from being reassigned, a method from being overridden, and a class from being subclassed.', 'JAVA', 'MEDIUM'),

('What is the difference between == and .equals() in Java?', 
 '== compares values, .equals() compares references',
 '== compares references, .equals() compares values/content',
 'They are identical', 'Neither compares values', 'B',
 '== compares object references (memory addresses). .equals() compares the actual content/value of objects.', 'JAVA', 'MEDIUM'),

('What is a Java Stream?', 'A file I/O class', 
 'A sequence of elements supporting sequential and parallel aggregate operations',
 'A thread synchronization mechanism', 'A database connection', 'B',
 'Java Streams (java.util.stream) provide a functional approach to processing collections of data.', 'JAVA', 'HARD');

-- Sample SQL Questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES
('What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 
 'Standard Query Logic', 'System Query Language', 'A',
 'SQL stands for Structured Query Language, used for managing relational databases.', 'SQL', 'EASY'),

('Which SQL command is used to retrieve data?', 'GET', 'FETCH', 'SELECT', 'RETRIEVE', 'C',
 'SELECT is the primary SQL command used to retrieve/query data from one or more tables.', 'SQL', 'EASY'),

('What is a PRIMARY KEY?', 'A key that can have NULL values', 
 'A unique identifier for each row that cannot be NULL',
 'A foreign reference to another table', 'An index for faster queries', 'B',
 'A PRIMARY KEY uniquely identifies each record in a table and cannot contain NULL values.', 'SQL', 'MEDIUM'),

('What is the difference between INNER JOIN and LEFT JOIN?', 
 'They are identical', 
 'INNER JOIN returns matching rows; LEFT JOIN returns all left table rows plus matching right rows',
 'LEFT JOIN only returns left table rows', 'INNER JOIN returns all rows from both tables', 'B',
 'INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table and matched rows from the right.', 'SQL', 'MEDIUM');

-- Sample React Questions  
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES
('What is JSX in React?', 'A JavaScript runtime', 
 'A syntax extension that allows HTML-like code in JavaScript',
 'A state management library', 'A React component', 'B',
 'JSX (JavaScript XML) is a syntax extension for JavaScript that looks like HTML and is used to describe React UI components.', 'REACT', 'EASY'),

('What hook is used to manage state in functional React components?', 
 'useEffect', 'useState', 'useContext', 'useRef', 'B',
 'useState is the primary React hook for adding state to functional components. It returns a state value and a setter function.', 'REACT', 'EASY'),

('What is the Virtual DOM in React?', 
 'A separate browser DOM', 
 'A lightweight in-memory representation of the real DOM used for efficient updates',
 'A React component', 'A CSS styling approach', 'B',
 'The Virtual DOM is a JavaScript object that mirrors the real DOM. React uses it to batch and optimize DOM updates efficiently.', 'REACT', 'MEDIUM');

-- Sample HR Questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES
('What is the STAR method in interviews?', 
 'Skills, Tasks, Actions, Results', 
 'Situation, Task, Action, Result',
 'Strategy, Tactics, Achievement, Review', 
 'Situation, Time, Action, Result', 'B',
 'STAR method: Situation (describe the context), Task (your responsibility), Action (steps you took), Result (outcome achieved).', 'HR', 'EASY'),

('Which is the best answer to "Where do you see yourself in 5 years?"', 
 'I want your job', 
 'I have no idea',
 'I see myself growing with the company, taking on more responsibilities aligned with my skills',
 'I plan to start my own company', 'C',
 'The best answer shows ambition while aligning personal growth with the company''s goals. It demonstrates loyalty and career vision.', 'HR', 'EASY');

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_resumes_user ON resumes(user_id);
CREATE INDEX idx_test_results_user ON test_results(user_id);
CREATE INDEX idx_chat_history_user_session ON chat_history(user_id, session_id);
CREATE INDEX idx_questions_category_difficulty ON questions(category, difficulty);
