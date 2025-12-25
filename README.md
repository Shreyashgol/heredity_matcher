# 🧬 Heredity - Interactive Family Health Tree

> A privacy-focused web application for building family trees, tracking genetic health conditions, and calculating hereditary disease risks using AI-powered analysis.

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/next.js-14-blue)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Heredity** is a full-stack application that helps users understand their genetic health risks by:
- Building comprehensive family trees
- Tracking medical conditions across generations
- Calculating hereditary disease probabilities using recursive algorithms
- Generating AI-powered medical analysis reports
- Visualizing family health data interactively

### The Problem
Most people know "Grandpa had heart issues," but that data is lost or unstructured. Genetic testing is expensive, and there's no simple tool to visualize recursive family health history to predict risks for younger generations.

### The Solution
A privacy-focused tool where users build family trees, tag relatives with conditions, and the app calculates statistical probability of inheriting diseases based on lineage distance.

---

## ✨ Features

### Core Functionality
- 👥 **Family Tree Management** - Add members, relationships, and medical conditions
- 🧮 **Genetic Risk Calculator** - Calculate hereditary disease risk (Parents: 50%, Grandparents: 25%, etc.)
- 🤖 **AI-Powered Reports** - Generate comprehensive medical analysis using Google Gemini AI
- 📊 **Interactive Visualization** - View family trees with React Flow (color-coded health status)
- 📄 **PDF Export** - Download detailed health reports with family tree summaries

### Advanced Features
- 🔍 **Pagination & Filtering** - Efficiently browse large family trees
- 🔎 **Search & Sort** - Find family members by name, gender, or health status
- ✏️ **Edit & Delete** - Manage family data with inline editing and soft deletes
- 📜 **Activity History** - Track all changes with comprehensive audit trail
- 🔄 **Soft Delete** - Recover accidentally deleted data
- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18, App Router)
- **Styling:** Tailwind CSS
- **Visualization:** React Flow (family tree graphs)
- **HTTP Client:** Axios
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (with recursive CTEs for tree traversal)
- **Authentication:** JWT + bcrypt
- **AI Service:** Google Gemini AI
- **PDF Generation:** PDFKit

### Database
- **PostgreSQL 14+** with advanced features:
  - Recursive Common Table Expressions (CTEs)
  - JSONB for flexible data storage
  - Triggers for automatic timestamp updates
  - Indexes for optimized queries

---

## 📁 Project Structure

```
heredity-app/
├── 📂 client/                      # Frontend (Next.js)
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 dashboard/         # Main dashboard
│   │   │   ├── 📂 report/       # Risk report page
│   │   │   │   └── page.js      # Report display & PDF export
│   │   │   └── page.js          # Dashboard with edit/delete
│   │   ├── 📂 login/            # Login page
│   │   ├── 📂 signup/           # Registration page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.js            # Root layout
│   │   └── page.js              # Landing page
│   │
│   ├── 📂 components/             # React components
│   │   ├── AddMemberForm.js      # Multi-tab form (Person/Relationship/Condition)
│   │   ├── FamilyTreeGraph.js    # React Flow visualization
│   │   └── ReportFamilyTree.js   # Report tree component
│   │
│   ├── 📂 public/                 # Static assets
│   ├── .env.local.example         # Environment template
│   ├── .gitignore                 # Git ignore rules
│   ├── next.config.js             # Next.js configuration
│   └── package.json               # Dependencies
│
├── 📂 server/                      # Backend (Express)
│   ├── 📂 config/                 # Configuration
│   │   └── db.js                 # PostgreSQL connection
│   │
│   ├── 📂 controllers/            # Business logic
│   │   ├── authController.js     # Authentication (register/login)
│   │   ├── familyController.js   # Core family tree logic
│   │   └── enhancedFamilyController.js # Advanced features (pagination, filters)
│   │
│   ├── 📂 middleware/             # Express middleware
│   │   └── middleware.js         # JWT verification & user context
│   │
│   ├── 📂 routes/                 # API routes
│   │   ├── api.js                # Main API endpoints
│   │   └── auth.js               # Authentication endpoints
│   │
│   ├── 📂 services/               # External services
│   │   ├── geminiService.js      # AI report generation
│   │   ├── reportService.js      # PDF generation with PDFKit
│   │   └── treeTextService.js    # Tree text formatting
│   │
│   ├── 📂 migrations/             # Database migrations
│   │   └── add_history_and_soft_delete.sql
│   │
│   ├── 📂 reports/                # Generated PDF reports (gitignored)
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Git ignore rules
│   ├── index.js                   # Server entry point
│   ├── initDb.js                  # Database initialization
│   └── package.json               # Dependencies
│
├── 📄 README.md                    # This file
└── 📄 .gitignore                   # Root git ignore
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v18.0.0 or higher
- **PostgreSQL** v14.0 or higher
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/heredity-app.git
cd heredity-app
```

### Step 2: Database Setup
```bash
# Create PostgreSQL database
createdb Heredity

# Or using psql
psql -U postgres
CREATE DATABASE Heredity;
\q

# Run migrations
psql -U postgres -d Heredity -f server/migrations/add_history_and_soft_delete.sql
```

### Step 3: Server Setup
```bash
cd server
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Server `.env` configuration:**
```env
PORT=5001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Heredity
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key_change_in_production
GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Client Setup
```bash
cd ../client
npm install

# Create .env.local file from example
cp .env.local.example .env.local

# Edit if needed (default should work)
nano .env.local
```

**Client `.env.local` configuration:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Step 5: Start Application
```bash
# Terminal 1 - Start server
cd server
npm start
# Server runs on http://localhost:5001

# Terminal 2 - Start client
cd client
npm run dev
# Client runs on http://localhost:3000
```

### Step 6: Access Application
Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001

---

## ⚙️ Configuration

### Environment Variables

#### Server (`server/.env`)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5001 |
| `DB_USER` | PostgreSQL username | Yes | - |
| `DB_HOST` | Database host | Yes | localhost |
| `DB_NAME` | Database name | Yes | Heredity |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_PORT` | Database port | No | 5432 |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |

#### Client (`client/.env.local`)
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | http://localhost:5001/api |

---

## 📖 Usage

### 1. Register Account
- Navigate to http://localhost:3000
- Click "Sign Up"
- Enter name, email, and password
- Submit to create account

### 2. Add Family Members
- Go to Dashboard
- Click "Add Member" tab
- Fill in person details (name, birth date, gender)
- Submit to add to family tree

### 3. Create Relationships
- In "Add Member" tab, select "Add Relationship"
- Choose parent and child from dropdowns
- Select relationship type (Father/Mother)
- Submit to create connection

### 4. Add Medical Conditions
- In "Add Member" tab, select "Add Condition"
- Choose person from dropdown
- Enter condition name (e.g., "Diabetes", "Heart Disease")
- Enter diagnosed date
- Submit to add condition

### 5. Calculate Genetic Risk
- Select a family member from the list
- Enter condition name in "Calculate Risk" section
- Click "Calculate Risk"
- View comprehensive AI-generated report

### 6. View & Export Report
- After calculation, you're redirected to report page
- View risk percentage, affected ancestors, and AI analysis
- See interactive family tree visualization
- Click "Export PDF" to download report

### 7. Edit/Delete Members
- Click ✏️ (edit) icon next to any family member
- Modify details and click "✓ Save"
- Click 🗑️ (delete) icon to remove member
- Confirm deletion in modal

---

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Family Tree Endpoints

#### Get All People (with filters)
```http
GET /people/filtered?page=1&limit=10&sortBy=name&sortOrder=asc&search=john&gender=Male&hasConditions=true
Authorization: Bearer <token>
```

#### Add Person
```http
POST /person
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "birth_date": "1990-05-15",
  "gender": "Female"
}
```

#### Update Person
```http
PUT /person/:personId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "birth_date": "1990-05-15",
  "gender": "Female"
}
```

#### Delete Person (Soft Delete)
```http
DELETE /person/:personId
Authorization: Bearer <token>
```

#### Calculate Risk
```http
GET /risk/:personId/:conditionName
Authorization: Bearer <token>
```

#### Generate PDF Report
```http
POST /generate-report-pdf
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientName": "John Doe",
  "condition": "Diabetes",
  "totalRisk": 75,
  "riskLevel": "High",
  "affectedAncestors": [...],
  "aiReport": "...",
  "treeData": [...]
}
```

**For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## 🗄️ Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### people
```sql
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

#### relationships
```sql
CREATE TABLE relationships (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  child_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

#### conditions
```sql
CREATE TABLE conditions (
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  condition_name VARCHAR(255) NOT NULL,
  diagnosed_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

#### activity_history
```sql
CREATE TABLE activity_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧮 Risk Calculation Algorithm

The genetic risk is calculated using a recursive SQL query that traverses the family tree:

```
Risk Contribution by Generation:
├── Parents (Generation 1):        50%
├── Grandparents (Generation 2):   25%
├── Great-grandparents (Gen 3):    12.5%
└── Great-great-grandparents:      6.25%
```

**Formula:**
```
Total Risk = Σ (Risk per affected ancestor)
Risk Level = High (>50%) | Medium (25-50%) | Low (0-25%)
```

---

## 🎨 Features Showcase

### Dashboard
- Family member list with search and filters
- Inline editing with save/cancel
- Delete confirmation modal
- Risk calculation interface
- Tab navigation (Tree/Add Member)

### Family Tree Visualization
- Color-coded nodes (Blue: healthy, Red: conditions, Gold: current patient)
- Interactive pan and zoom
- Minimap for navigation
- Generation-based layout
- Hover tooltips with details

### AI Report
- Comprehensive medical analysis
- Risk assessment with percentages
- Affected ancestors list
- Preventive measures
- Lifestyle recommendations
- Medical consultation advice

### PDF Export
- Professional report layout
- Patient information section
- Risk summary with visual indicators
- Family medical history
- Family tree text representation
- AI analysis section
- Disclaimer and footer

---

## 🔐 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **User Data Isolation:** All queries filtered by user_id
- **SQL Injection Prevention:** Parameterized queries
- **CORS Protection:** Configured for specific origins
- **Input Validation:** Server-side validation on all endpoints
- **Soft Deletes:** Data recovery possible
- **Environment Variables:** Sensitive data in .env files

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Register a new user
# 2. Add family members
# 3. Create relationships
# 4. Add medical conditions
# 5. Calculate genetic risk
# 6. View AI report
# 7. Export PDF
# 8. Test edit/delete features
```

### API Testing
Use tools like Postman, Thunder Client, or cURL:
```bash
# Example: Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test thoroughly before submitting
- Use meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial work - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For medical analysis capabilities
- **React Flow** - For beautiful family tree visualization
- **PostgreSQL** - For powerful recursive queries
- **Next.js Team** - For the amazing framework
- **Open Source Community** - For inspiration and tools

---

## 📞 Support

### Documentation
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed code organization
- [Pre-Push Checklist](./PRE_PUSH_CHECKLIST.md) - GitHub deployment guide

### Issues
- Report bugs on [GitHub Issues](https://github.com/yourusername/heredity-app/issues)
- Check existing issues before creating new ones
- Provide detailed reproduction steps

### Questions
- Open a discussion on GitHub
- Check documentation first
- Review closed issues for solutions

---

## 🚧 Roadmap

### Planned Features
- [ ] Bulk operations (multi-select delete)
- [ ] Data export/import (JSON, CSV, GEDCOM)
- [ ] Family tree sharing with other users
- [ ] Mobile responsive improvements
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Collaborative editing
- [ ] Photo uploads for family members
- [ ] Timeline view of medical history

---

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Components:** 10+
- **API Endpoints:** 15+
- **Database Tables:** 5
- **Documentation Pages:** 150+

---

## 🎓 Why This Project?

This project demonstrates:
- **Full-Stack Development** - Next.js + Express + PostgreSQL
- **Complex Algorithms** - Recursive tree traversal and risk calculation
- **AI Integration** - Google Gemini API for medical analysis
- **Modern UI/UX** - React Flow, Tailwind CSS, responsive design
- **Database Design** - Recursive CTEs, JSONB, triggers
- **Authentication** - JWT + bcrypt security
- **CRUD Operations** - Complete data management
- **PDF Generation** - Dynamic report creation
- **Real-World Application** - Solves actual healthcare problem

**Perfect for FAANG interviews and portfolio!** 🚀

---

<div align="center">

**Built with ❤️ for better family health awareness**

[⬆ Back to Top](#-heredity---interactive-family-health-tree)

</div>
