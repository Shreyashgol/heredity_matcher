# 🧬 Heredity - Interactive Family Health Tree

A full-stack application for visualizing family health history and calculating genetic risk using PostgreSQL Recursive CTEs and React Flow.

## 🎯 Project Highlights

This project demonstrates **FAANG-level** technical skills:

- **PostgreSQL Recursive CTEs** for graph traversal
- **Graph Theory** implementation using adjacency lists
- **Full-stack architecture** with Next.js and Node.js
- **Interactive data visualization** with React Flow
- **RESTful API design** with proper error handling

## 🚀 Features

- ✅ Build interactive family trees
- ✅ Add medical conditions to family members
- ✅ Calculate genetic risk based on lineage distance
- ✅ Visual family tree with color-coded health indicators
- ✅ Real-time risk assessment
- ✅ Privacy-focused (all data stored locally)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** with TypeScript
- **React Flow** for tree visualization
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **PostgreSQL** with Recursive CTEs
- **ltree extension** for hierarchical data

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+

### Setup

1. **Clone the repository**
   ```bash
   cd heredity-app
   ```

2. **Configure Database**
   
   Create a PostgreSQL database:
   ```bash
   psql -U postgres -c "CREATE DATABASE Heredity;"
   ```

   Update `server/.env`:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=Heredity
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

3. **Initialize Database**
   ```bash
   cd server
   npm install
   node initDb.js
   ```

4. **Start Backend Server**
   ```bash
   node index.js
   # Server runs on http://localhost:3000
   ```

5. **Start Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   # App runs on http://localhost:3001
   ```

## 🎮 Usage

1. **Add Family Members**
   - Use the "Add Person" tab to create family members
   - Enter name, birth date, and gender

2. **Create Relationships**
   - Use the "Add Relationship" tab
   - Select parent and child from dropdowns
   - Specify relationship type (Father/Mother)

3. **Add Medical Conditions**
   - Use the "Add Condition" tab
   - Select person and enter condition name
   - Specify diagnosis date

4. **View Family Tree**
   - Select a person from the dropdown
   - View their complete ancestry with visual graph
   - Red nodes indicate individuals with conditions

5. **Calculate Risk**
   - Enter a condition name (e.g., "Diabetes")
   - Click "Calculate Risk"
   - View risk percentage and affected ancestors

## 🧪 Testing

Run the automated API test:
```bash
cd server
node test-api.js
```

This creates a sample family tree:
- Grandpa (Mike) with Diabetes
- Father (John)
- Son (Alex)

And calculates Alex's risk of inheriting Diabetes (25% from grandparent).

## 📊 API Endpoints

### People
- `POST /api/person` - Add new person
- `GET /api/people` - Get all people

### Relationships
- `POST /api/relationship` - Create parent-child link

### Conditions
- `POST /api/condition` - Add medical condition

### Analysis
- `GET /api/tree/:personId` - Get family tree (uses Recursive CTE)
- `GET /api/risk/:personId/:conditionName` - Calculate genetic risk

## 🎓 Learning Outcomes

### Database Skills
- Recursive Common Table Expressions (CTEs)
- Graph representation in relational databases
- Foreign key constraints and cascading deletes
- PostgreSQL extensions (ltree)

### Backend Skills
- RESTful API design
- Express middleware
- Environment configuration
- Error handling

### Frontend Skills
- Next.js App Router
- TypeScript interfaces
- React Flow for data visualization
- State management with hooks

## 🏆 Resume Impact

This project demonstrates:

1. **Advanced SQL** - Recursive CTEs are asked in FAANG interviews
2. **Graph Algorithms** - Tree traversal and ancestor finding
3. **System Design** - Clean architecture with separation of concerns
4. **Full-Stack** - End-to-end feature implementation
5. **Data Visualization** - Complex UI with React Flow

## 📁 Project Structure

```
heredity-app/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── initDb.js          # Database setup
│   └── index.js           # Server entry point
│
└── client/                # Frontend app
    ├── app/               # Next.js pages
    ├── components/        # React components
    │   ├── FamilyTreeGraph.tsx
    │   └── AddMemberForm.tsx
    └── package.json
```

## 🔒 Security Notes

- Database credentials stored in `.env` (not committed to git)
- Input validation on all forms
- SQL injection prevention with parameterized queries
- CORS enabled for local development

## 🚧 Future Enhancements

- [ ] User authentication
- [ ] Multi-user family trees with privacy controls
- [ ] PDF export of family trees
- [ ] Advanced risk models with multiple factors
- [ ] Mobile app version
- [ ] Integration with genetic testing APIs

## 📝 License

This project is for educational and portfolio purposes.

## 👤 Author

Built to showcase full-stack development skills with focus on:
- Complex data structures (graphs/trees)
- Advanced SQL (Recursive CTEs)
- Modern web technologies (Next.js, React Flow)
- Clean, maintainable code

---

**⭐ If this project helped you, please give it a star!**
