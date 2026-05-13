# Full-Stack-Engineer
# Candidate Scoring Dashboard

A full-stack internal tool for managing candidate assessments with role-based access control, AI-generated summaries, and real-time scoring.

---

## 🚀 Quick Start

### 📌 Project Overview
The Candidate Scoring Dashboard is designed to streamline the recruitment and evaluation process for hiring teams. It allows interviewers, recruiters, and administrators to collaborate efficiently through a centralized platform that supports candidate scoring, assessment tracking, and AI-powered feedback summaries.

The platform includes:
- Secure authentication and role-based access control
- Real-time candidate scoring and evaluation
- AI-generated interview summaries and recommendations
- Dashboard analytics for hiring insights
- Responsive frontend with modern UI
- REST API backend with documentation
- Dockerized setup for easy deployment

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python
- SQLAlchemy
- JWT Authentication

### Database
- PostgreSQL

### DevOps
- Docker
- Docker Compose

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:
- Docker
- Docker Compose
- Git

Also make sure the following ports are available:
- `8000` → Backend API
- `5173` → Frontend Application

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd candidate-scoring-dashboard
```

### 2. Create Environment Files

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

Update the `.env` files with your configuration values such as:
- Database URL
- JWT Secret Key
- API Base URL
- AI Service Keys (if applicable)

---

### 3. Build and Run the Application

```bash
docker-compose up --build
```

This command will:
- Build frontend and backend containers
- Start the PostgreSQL database
- Launch all services automatically

---

## 🌐 Application Access

| Service | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |

---

## 🔐 Features

### 👥 Role-Based Access Control
Different user roles include:
- Admin
- Recruiter
- Interviewer

Each role has controlled permissions for accessing and managing candidate data.

---

### 🤖 AI-Generated Summaries
The platform automatically generates:
- Interview summaries
- Candidate performance insights
- Recommendation reports

This helps recruiters make faster and more informed decisions.

---

### 📊 Real-Time Scoring
Interviewers can:
- Submit evaluation scores
- Add feedback instantly
- Track candidate performance in real time

---

### 📈 Dashboard Analytics
Provides insights such as:
- Candidate pipeline status
- Average interview scores
- Hiring progress tracking
- Team evaluation metrics

---

## 📁 Project Structure

```bash
candidate-scoring-dashboard/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📦 Docker Commands

### Stop Containers

```bash
docker-compose down
```

### Rebuild Containers

```bash
docker-compose up --build
```

### View Logs

```bash
docker-compose logs -f
```

---

## 🚀 Deployment

The application can be deployed using:
- AWS
- DigitalOcean
- Render
- Railway
- Kubernetes
- Docker Swarm

For production deployment:
- Use HTTPS
- Configure secure environment variables
- Enable database backups
- Configure monitoring and logging

---

## 👨‍💻 Author

**Jhahritick**  
📧 Email: jhahritick@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## ⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub.
