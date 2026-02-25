# EstateFlow Pro - Backend API

Node.js/Express backend for EstateFlow Pro real estate management system.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/estateflow
   ```

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
# MONGODB_URI - your database URL
# PORT - server port (default 3000)
# CORS_ORIGIN - allowed origins (default http://localhost:8081)
```

### 4. Seed Database
```bash
npm run seed
```

This will populate the database with sample properties and agents.

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Build for Production
```bash
npm run build
npm start
```

## API Endpoints

### Properties
- `GET /api/properties` - List all properties (with pagination)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/search?q=query` - Search properties

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get single agent
- `POST /api/agents` - Create new agent
- `PATCH /api/agents/:id` - Update agent
- `GET /api/agents/:id/performance` - Get agent performance metrics
- `GET /api/agents/:id/properties` - Get agent's properties

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/revenue` - Revenue data
- `GET /api/dashboard/agent-performance` - Agent performance
- `GET /api/dashboard/portal-stats` - Portal statistics

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: express-validator
- **CORS**: express-cors

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── models/
│   │   ├── Property.ts       # Property schema
│   │   └── Agent.ts          # Agent schema
│   ├── routes/
│   │   ├── properties.ts     # Property endpoints
│   │   ├── agents.ts         # Agent endpoints
│   │   └── dashboard.ts      # Dashboard endpoints
│   └── seeds/
│       └── seed.ts           # Database seeding
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env.example
└── .env
```

## Connecting Frontend

Update frontend `.env.development`:
```env
VITE_API_URL=http://localhost:3000/api
```

Then restart the frontend dev server.

## Next Steps

1. ✓ Backend setup complete
2. Update frontend API URL in `.env.development`
3. Seed the database: `npm run seed`
4. Start the backend: `npm run dev`
5. Start the frontend: `npm run dev`
6. Test the connection at `http://localhost:8081`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For local: `mongodb://localhost:27017/estateflow`
- For Atlas: Use your connection string

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to include your frontend URL
- Default: `http://localhost:8081,http://localhost:5173`

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

## Development

- Use `npm run dev` for hot-reloading with ts-node
- Logs include connection status and request info
- Database seeding creates sample data automatically

## API Testing

You can test the API using:
- Postman
- cURL
- REST Client VS Code extension
- Frontend application

Example:
```bash
# Get all properties
curl http://localhost:3000/api/properties

# Get agents
curl http://localhost:3000/api/agents

# Get dashboard stats
curl http://localhost:3000/api/dashboard/stats
```

---

**Status**: Ready for Development

Happy coding! 🚀
