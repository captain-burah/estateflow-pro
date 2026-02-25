# Backend Setup Guide - EstateFlow Pro

Your complete Node.js/Express backend is ready! Follow these steps to get it running.

## 📋 Quick Setup (5 minutes)

### Step 1: Install MongoDB

**Option A: Local MongoDB (macOS)**
```bash
# Install
brew install mongodb-community

# Start service
brew services start mongodb-community

# Verify it's running
mongosh
# Type: exit
```

**Option B: Skip Local - Use MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create a cluster
- Get connection string and add to `.env`

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Seed Database
```bash
npm run seed
```
This populates your database with sample properties and agents.

### Step 4: Start Backend Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

You should see:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:3000
```

### Step 5: Update Frontend API URL
Edit `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:3000/api
```

Then restart the frontend dev server (`npm run dev` in the frontend folder).

## ✅ Verify It's Working

Test the connection:
```bash
# In a new terminal
curl http://localhost:3000/api/health
# Should return: {"status":"Server is running"}

curl http://localhost:3000/api/properties
# Should return: {"data":[...], "total":10, ...}
```

Or open in browser:
- http://localhost:3000/api/health
- http://localhost:3000/api/properties
- http://localhost:3000/api/agents
- http://localhost:3000/api/dashboard/stats

## 📁 What Was Created

```
backend/
├── src/
│   ├── index.ts              # Express app setup
│   ├── config/database.ts    # MongoDB connection
│   ├── models/
│   │   ├── Property.ts       # Property schema (10 fields)
│   │   └── Agent.ts          # Agent schema (7 fields)
│   ├── routes/
│   │   ├── properties.ts     # 6 endpoints (CRUD + search)
│   │   ├── agents.ts         # 6 endpoints (CRUD + performance)
│   │   └── dashboard.ts      # 4 endpoints (stats, revenue, performance, portals)
│   └── seeds/seed.ts         # Seed 10 properties + 4 agents
├── package.json
├── tsconfig.json
├── .env                      # Configuration (MongoDB URL, port)
├── .env.example             # Template
└── README.md
```

## 🔌 API Endpoints Available

### Properties
- `GET /api/properties` - List with pagination
- `GET /api/properties/:id` - Get one
- `POST /api/properties` - Create
- `PATCH /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete
- `GET /api/properties/search?q=query` - Search

### Agents  
- `GET /api/agents` - List all
- `GET /api/agents/:id` - Get one
- `POST /api/agents` - Create
- `PATCH /api/agents/:id` - Update
- `GET /api/agents/:id/performance` - Performance metrics
- `GET /api/agents/:id/properties` - Agent's listings

### Dashboard
- `GET /api/dashboard/stats` - KPI statistics
- `GET /api/dashboard/revenue` - Revenue data
- `GET /api/dashboard/agent-performance` - Top agents
- `GET /api/dashboard/portal-stats` - Portal listings

## 🗄️ Database Schema

### Property
- title: String
- category: rental | sale | luxury
- status: available | reserved | sold | rented
- price: Number
- location: String
- bedrooms: Number
- bathrooms: Number
- area: Number
- agent: String
- publishedPortals: [String]
- image: String (optional)
- description: String (optional)
- createdAt, updatedAt: Timestamp

### Agent
- name: String
- email: String (unique)
- phone: String
- avatar: String (optional)
- salesCount: Number
- totalRevenue: Number
- rating: Number
- createdAt, updatedAt: Timestamp

## 🚀 Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Runs on port 3000
```

### Terminal 2: Frontend  
```bash
# from project root or frontend folder
npm run dev
# Runs on port 8081
```

Now you have both running!

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Error: connect ECONNREFUSED` | MongoDB not running. Run `brew services start mongodb-community` |
| `CORS error` | Frontend URL not in `.env` CORS_ORIGIN |
| `Port 3000 in use` | Change `PORT=3000` to `PORT=3001` in `.env` |
| `npm: command not found` | Install Node.js from nodejs.org |

## 📝 Next Steps

1. ✅ Backend created and configured
2. ✅ MongoDB setup instructions provided
3. 📝 Seed sample data
4. 🚀 Start backend (`npm run dev`)
5. 🔗 Update frontend `.env.development`
6. 🚀 Start frontend (`npm run dev`)
7. 🧪 Test in browser: http://localhost:8081

## 💡 Customization

### Change Database
Edit `backend/.env`:
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/estateflow

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/estateflow
```

### Change Port
Edit `backend/.env`:
```env
PORT=3000  # Change to 3001, 4000, etc.
```

### Add More Sample Data
Edit `backend/src/seeds/seed.ts` and add more properties/agents.

## 📚 Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **Dotenv** - Environment configuration

## 🎯 You Now Have

✅ Complete Node.js/Express backend
✅ MongoDB database setup
✅ 16 API endpoints
✅ Sample data seeding
✅ Full type safety with TypeScript
✅ CORS configuration
✅ Error handling
✅ Hot-reload development server

**Everything is ready to use!** 🚀

---

**Questions?** Check `backend/README.md` for more details.
