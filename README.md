FleetMaster 🚚📊

AI-Powered Fleet Management & Predictive Analytics Platform

FleetMaster is an AI-enabled fleet management system designed to manage vehicles, drivers, compliance documents, and operational health at scale.
It combines cloud-native backend services, time-series data, and AI models to deliver predictive maintenance, risk analysis, and automated alerts.

🚀 Built for real-world logistics operations and data-driven decision making.

🚀 Try It Live

(Optional – add when deployed)

Component	URL
Frontend	Vercel
Backend API	Railway
Database	Supabase
AI Services	Hugging Face
🎯 Features
🤖 AI-Driven Intelligence

Vehicle health prediction

Maintenance risk forecasting

Driver risk scoring

Anomaly detection from telemetry data

AI-generated alert explanations & summaries

📊 Fleet & Operations

Vehicle & driver management

Booking & order tracking

Document compliance monitoring

Multi-state fleet support

⚠️ Automated Alerts

Insurance / Permit / FC / Tax expiry alerts

Health degradation alerts

System-only alert generation (secured)

🔐 Enterprise-Grade Security

Role-Based Access Control (Owner / State Manager / Fleet Manager)

State-level data isolation

AI-managed fields protected from manual edits

🧠 AI Models Used
Use Case	Model
Alert Explanation	google/flan-t5-base
Fleet Chat Assistant	meta-llama/Meta-Llama-3-8B-Instruct
Report Summarization	facebook/bart-large-cnn
Embeddings	sentence-transformers/all-MiniLM-L6-v2
Vehicle Health	XGBoost
Maintenance Prediction	LSTM
Driver Risk	Random Forest
Anomaly Detection	Isolation Forest
🏗️ Architecture
Frontend (Vercel)
        ↓
Backend (Django REST)
        ↓
AI Orchestrator
        ↓
FastAPI AI Services + Hugging Face
        ↓
PostgreSQL (Supabase + Timescale)

🧩 Tech Stack
Backend

Django REST Framework

FastAPI (AI microservices)

Celery + Redis (background jobs)

Database

PostgreSQL (Supabase)

TimescaleDB (telemetry & time-series data)

AI & Analytics

Hugging Face Inference API

XGBoost / LSTM / RandomForest

Vector embeddings for semantic analysis

Deployment

Vercel (Frontend)

Railway (Backend & workers)

Supabase (Database)

📁 Project Structure
fleetmaster/
├── backend/
│   ├── apps/
│   │   ├── vehicles
│   │   ├── drivers
│   │   ├── bookings
│   │   ├── alerts
│   │   ├── telemetry
│   │   └── integrations
│   ├── manage.py
│
├── ai-services/
│   ├── main.py
│   ├── mock_models.py
│   └── schemas.py
│
├── docker-compose.yml
├── RUNBOOK.md
└── README.md

⚙️ Environment Variables

Create .env file:

DATABASE_URL=postgresql://...
DJANGO_SECRET_KEY=your_secret
DEBUG=false
HUGGINGFACE_API_KEY=hf_xxxxx
REDIS_URL=redis://...

🚀 Quick Start
git clone https://github.com/your-username/fleetmaster
cd fleetmaster
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

☁️ Cloud & Hosting
Layer	Service
Frontend	Vercel
Backend	Railway
Database	Supabase
AI Inference	Hugging Face
📈 Why This Project Matters

Designed for large-scale fleets (5000+ vehicles)

Demonstrates AI + data analytics in production systems

Cloud-native and scalable

Strong data analyst + backend engineer portfolio project

🧑‍💻 Author

Vishnu Prasad
Aspiring Data Analyst | AI & Cloud Systems Enthusiast
