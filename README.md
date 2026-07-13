# 🚀 AI Placement Preparation Portal

> A production-ready, full-stack web application for campus placement preparation — built with Spring Boot, React, and Google Gemini AI.

**Author:** Udaya Kumar K J  
**GitHub:** [udaygowda-cell](https://github.com/udaygowda-cell)  
**LinkedIn:** [Udaya Kumar K J](https://www.linkedin.com/in/udaya-kumar-k-j-26b120320)

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based login/register with BCrypt password encryption |
| 📊 Dashboard | Charts, stats, progress analytics using Recharts |
| 📄 Resume ATS | Upload PDF resume, extract text, get ATS score + suggestions |
| 🤖 AI Interview | Generate questions with Google Gemini AI |
| 💬 Mock Interview | ChatGPT-style chatbot acting as an AI interviewer |
| 🧪 Coding Tests | MCQ tests with timer, auto-scoring, result persistence |
| 🛡️ Admin Panel | Manage users, add/edit/delete questions, view all data |
| 🎨 Dark UI | Responsive dark-theme UI with Tailwind CSS + custom design system |

---

## 🗂️ Project Structure

```
ai-placement-portal/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/udaya/placement/
│   │   ├── config/                 # Security, OpenAPI, App configs
│   │   │   ├── SecurityConfig.java
│   │   │   ├── OpenApiConfig.java
│   │   │   └── AppConfig.java
│   │   ├── controller/             # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ResumeController.java
│   │   │   ├── InterviewController.java
│   │   │   ├── TestAndChatController.java
│   │   │   └── DashboardAndAdminController.java
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── request/            # LoginRequest, RegisterRequest
│   │   │   └── response/           # JwtAuthResponse, ApiResponse<T>
│   │   ├── entity/                 # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Resume.java
│   │   │   ├── Question.java
│   │   │   ├── TestResult.java
│   │   │   └── ChatHistory.java
│   │   ├── exception/              # Global Exception Handling
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── BadRequestException.java
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   ├── security/               # JWT + Spring Security
│   │   │   ├── jwt/                # JwtUtils, AuthTokenFilter, AuthEntryPoint
│   │   │   └── service/            # UserDetailsServiceImpl
│   │   └── service/                # Business Logic
│   │       ├── AuthService.java
│   │       ├── ResumeService.java
│   │       └── AiService.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                       # React Application
│   └── src/
│       ├── components/
│       │   └── common/             # Sidebar, Layout
│       ├── context/                # AuthContext (global state)
│       ├── pages/                  # All page components
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── ResumePage.jsx
│       │   ├── InterviewPage.jsx
│       │   ├── ChatbotPage.jsx
│       │   ├── TestPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── AdminPage.jsx
│       └── services/
│           └── api.js              # Axios instance + all API calls
│
└── docs/
    ├── schema.sql                  # Full MySQL schema + sample data
    └── README.md                   # This file
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.2.0 | Core framework |
| Spring Security | 6.x | Authentication & Authorization |
| JWT (jjwt) | 0.11.5 | Token generation/validation |
| Spring Data JPA | 3.2.0 | ORM layer |
| Hibernate | 6.x | JPA implementation |
| MySQL | 8.x | Relational database |
| Apache PDFBox | 3.0.1 | PDF text extraction |
| WebFlux (WebClient) | 3.2.0 | HTTP client for Gemini API |
| Springdoc OpenAPI | 2.2.0 | Swagger documentation |
| Lombok | Latest | Boilerplate reduction |
| ModelMapper | 3.2.0 | DTO↔Entity mapping |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2.0 | UI library |
| React Router | 6.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first CSS |
| Axios | 1.6.x | HTTP client |
| Recharts | 2.x | Charts and graphs |
| Lucide React | 0.303.x | Icon library |
| React Hot Toast | 2.4.x | Toast notifications |
| React Markdown | 9.x | Markdown rendering in chat |
| UUID | 9.x | Session ID generation |

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.x
- Google Gemini API Key (free at [makersuite.google.com](https://makersuite.google.com))

---

### Step 1: Database Setup

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE placement_portal;
USE placement_portal;

-- Run the schema file
source docs/schema.sql;
```

---

### Step 2: Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Update these values:
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
app.gemini.api-key=YOUR_GEMINI_API_KEY
```

**Get Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `application.properties`

---

### Step 3: Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080/api`  
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

---

### Step 4: Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend starts at: `http://localhost:3000`

---

### Step 5: Login

| Role | Username | Password |
|---|---|---|
| Admin | `udayakumar` | `admin123` |
| User | `testuser` | `user123` |

> **Note:** The demo passwords in the schema.sql are BCrypt-hashed versions of `admin123` and `user123`.

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login, get JWT | ❌ |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/stats` | User stats & recent tests | ✅ |

### Resume

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/resumes/upload` | Upload PDF resume | ✅ |
| GET | `/api/resumes/my` | Get my resumes | ✅ |
| GET | `/api/resumes/{id}` | Get resume by ID | ✅ |

### Interview (AI)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/interview/questions` | Generate AI questions | ✅ |

Query params: `?category=JAVA&difficulty=MEDIUM&count=10`

### Chat (Mock Interview)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/chat/message` | Send message to AI | ✅ |
| GET | `/api/chat/history/{sessionId}` | Get session history | ✅ |

### Tests

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tests/questions` | Get MCQ questions | ✅ |
| POST | `/api/tests/submit` | Submit test answers | ✅ |
| GET | `/api/tests/my-results` | Get my test results | ✅ |

### Admin (Requires ADMIN role)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform-wide statistics |
| GET | `/api/admin/users` | List all users |
| DELETE | `/api/admin/users/{id}` | Delete a user |
| GET | `/api/admin/questions` | List all questions |
| POST | `/api/admin/questions` | Add a question |
| PUT | `/api/admin/questions/{id}` | Update a question |
| DELETE | `/api/admin/questions/{id}` | Delete a question |
| GET | `/api/admin/resumes` | View all resumes |
| GET | `/api/admin/results` | View all test results |

---

## 🗃️ Database Schema

```
users           → id, full_name, username, email, password, phone, college, branch, role
resumes         → id, user_id*, file_name, file_path, extracted_text, ats_score, skills
questions       → id, question_text, option_a/b/c/d, correct_answer, category, difficulty
test_results    → id, user_id*, category, difficulty, score, correct_answers, time_taken
chat_history    → id, user_id*, session_id, role, message, category
```

**Relationships:**
- `users` ← one-to-many → `resumes`
- `users` ← one-to-many → `test_results`
- `users` ← one-to-many → `chat_history`

---

## 🚀 Deployment Guide

### Backend Deployment (Railway / Render / EC2)

```bash
# Build JAR
cd backend
mvn clean package -DskipTests

# The JAR will be in: target/placement-portal-1.0.0.jar
java -jar target/placement-portal-1.0.0.jar
```

**Environment variables for production:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/placement_portal
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
APP_JWT_SECRET=your_very_long_secret_key_here
APP_GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Deployment (Vercel / Netlify)

```bash
cd frontend

# Create .env.production
echo "REACT_APP_API_URL=https://your-backend-url/api" > .env.production

# Build
npm run build

# Deploy the build/ folder to Vercel or Netlify
```

### Docker (Optional)

```dockerfile
# Dockerfile for backend
FROM openjdk:17-jdk-alpine
COPY target/placement-portal-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
docker build -t placement-portal-backend .
docker run -p 8080:8080 --env-file .env placement-portal-backend
```

---

## 🔒 Security Architecture

```
Client Request
     ↓
AuthTokenFilter (JWT Validation)
     ↓
SecurityContextHolder (sets authentication)
     ↓
Controller → Service → Repository
     ↓
BCrypt password verification
     ↓
Role-based access: USER | ADMIN
```

---

## 📈 Future Enhancements

- [ ] Email verification on registration
- [ ] OAuth2 (Google/GitHub login)
- [ ] Resume parsing using spaCy NLP
- [ ] Company-specific question banks
- [ ] Video mock interview with recording
- [ ] Leaderboard / competitive scoring
- [ ] Mobile app (React Native)
- [ ] LeetCode-style code editor integration

---

## 👨‍💻 Author

**Udaya Kumar K J**

- 🌐 GitHub: [udaygowda-cell](https://github.com/udaygowda-cell)
- 💼 LinkedIn: [Udaya Kumar K J](https://www.linkedin.com/in/udaya-kumar-k-j-26b120320)

---

## 📄 License

MIT License — feel free to use for learning, portfolio, or your own projects.

---

> ⭐ **Star this repo** if it helped you — it keeps me motivated to build more!
#   A I - P l a c e m e n t - P o r t a l  
 