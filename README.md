# 🍜 Local Food - HCMC AI Tourism Schedule Planner
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
**Local Food** is a sophisticated **Multi-Agent System (MAS)** designed to revolutionize the way travelers experience Ho Chi Minh City. Our mission is to **support and promote the development of HCMC's culinary tourism** by connecting food lovers with authentic local businesses and hidden gems that traditional guides often miss.
---
## 🤖 Multi-Agent System Architecture
The heart of this project is an intelligent **Multi-Agent Orchestration** framework that ensures every user request is handled by the most specialized AI agent.
-   **Supervisor/Router Agent**: Acting as the brain of the system, it analyzes user intent (in English or Vietnamese) and routes tasks to specialized sub-agents.
-   **Food Finder Agent**: Dedicated to scanning our extensive database and real-time data to find the most authentic dishes.
-   **Location Expert Agent**: Specializes in HCMC geography, optimizing routes and identifying the best alleys and local spots.
-   **Itinerary Synthesis Agent**: Collects outputs from various sub-agents to build a cohesive, logical, and delicious daily schedule.
-   **Iterative Refinement**: The system supports up to 5 cycles of refinement, ensuring the AI deeply understands complex cravings before presenting the final plan.
---
## ✨ Key Features
-   🤖 **Intelligent Multi-Agent Core**: A supervisor-led architecture that delegates tasks to specialized agents for superior planning accuracy.
-   🍲 **HCMC Food Promotion**: Our platform actively promotes local vendors, focusing on authentic family-run spots and traditional Saigonese cuisine.
-   📅 **Interactive Schedule Builder**: Manage your food tour day-by-day. Add meals, swap activities, and customize your itinerary with ease.
-   🗺️ **Dynamic Food Map**: Visualize your entire journey with an integrated interactive map (Leaflet), showing exactly where your next delicious meal is located.
-   📚 **Culinary Guide**: Explore a rich database of authentic Vietnamese dishes categorized by province and international cuisines.
-   🗣️ **Voice Interaction**: Use voice commands to search and plan your tour (Powered by AI).
-   🌍 **Multilingual Support**: Fully localized in **English** and **Vietnamese**.
-   👤 **User Personalization**: Save your history, manage your profile, and keep track of your favorite spots.
---
## 🚀 Tech Stack
### Frontend
-   **Framework**: React 19 (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4 + Shadcn UI
-   **State Management**: React Context API
-   **Routing**: React Router Dom
-   **Maps**: Leaflet & React Leaflet
-   **Internationalization**: i18next
-   **Icons**: Lucide React
### Backend
-   **Framework**: Flask (Python)
-   **Database**: SQLite
-   **AI Integration**: Custom LLM integration for schedule generation
-   **CORS**: Flask-CORS for secure cross-origin requests
---
## 🛠️ Installation & Setup
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18+)
-   [Python](https://www.python.org/) (v3.9+)
### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/CS252-Web-Project-Group-XXX.git
cd CS252-Web-Project-Group-XXX
```
### 2. Frontend Setup
```bash
# Install dependencies
npm install
# Run development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.
### 3. Backend Setup
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run the Flask server
python run.py
```
The backend will be available at `http://localhost:5000`.
---
## 📁 Project Structure
```text
├── backend/                # Flask Backend (Python)
│   ├── app/                # Core Application Logic
│   │   ├── agents/         # Multi-Agent System (Supervisor, Sub-Agents, Tools)
│   │   ├── blueprints/     # API Route Handlers (Auth, Chat, Food, Voice, etc.)
│   │   ├── services/       # App-level Services (ChatHistory, ChatService)
│   │   └── utils/          # Shared Utilities & Decorators
│   ├── service/            # Core AI & Data Services (RAG, Vector Store, Embeddings, Whisper)
│   ├── crawl_data/         # Data Acquisition Module (Gemini-powered crawling, Route extraction)
│   ├── data/               # Static Data & Seed Files
│   ├── run.py              # Main API Server Entry Point
│   ├── run_crawl.py        # Data Crawling Entry Point
│   └── requirements.txt    # Backend dependencies
├── src/                    # React Frontend (Vite + TS)
│   ├── modules/            # Feature-based Modules (Home, Chat, Profile, Staff)
│   ├── shared/             # Reusable UI Components (Shadcn), Hooks, & Libs
│   ├── locales/            # i18n Translation Files (EN/VI)
│   ├── assets/             # Images, Styles, and Fonts
│   └── main.tsx            # Frontend Entry Point
├── public/                 # Static Public Assets
└── vite.config.ts          # Vite Configuration
```
---
## 👥 Our Team - Group XXX
This project was developed as part of the CS252 course by:
-   **Kiet** - Leader & Developer (Technical Vision)
-   **Linh** - Developer (User Experience & Frontend)
-   **Huy** - Developer (Logic & Backend Engineering)
-   **Duy** - Developer (AI Algorithms & Scheduling)
-   **Anh** - Developer (Mapping & UI Bridge)
---
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
---
*Made for food lovers visiting Saigon.*