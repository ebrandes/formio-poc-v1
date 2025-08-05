# Formio React Application with Camunda Integration

A comprehensive React application that integrates Formio for dynamic form management and Camunda for workflow task management. This project uses Docker to provide a complete environment with MongoDB, Formio API server, and pre-configured sample forms.

## 🚀 Quick Start Guide

### What This Application Does

1. **Forms Gallery (Default Page)**: View and test Formio forms without any external dependencies
2. **Dashboard**: Integration point for Camunda BPM tasklist (requires Camunda running separately)
3. **Automatic Form Creation**: Sample forms are created automatically on startup
4. **Docker-based Setup**: Everything runs in containers for easy deployment

## 📋 Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development only)
- Git

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd formio-io-web
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# The default values work out of the box:
# - Admin Email: admin@example.com
# - Admin Password: CHANGEME (keep it simple for development)
# - Formio API: http://localhost:3001
```

### Step 3: Start the Application

```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

### Step 4: Wait for Initialization

The system will automatically:

1. Start MongoDB database
2. Launch Formio API server
3. Create admin user with credentials from `.env`
4. Generate 5 sample forms
5. Start the React application

⏱️ **Wait approximately 30-60 seconds for full initialization**

### Step 5: Access the Application

Once running, you'll have access to:

| Service          | URL                   | Description                         |
| ---------------- | --------------------- | ----------------------------------- |
| **React App**    | http://localhost:5173 | Main application with Forms Gallery |
| **Formio Admin** | http://localhost:3001 | Formio administration panel         |
| **MongoDB**      | localhost:27017       | Database (internal)                 |

## 📱 Application Features

### 1. Forms Gallery (Home Page)

When you first access http://localhost:5173, you'll see the Forms Gallery with:

- **5 Pre-configured Forms**:
  - Example Form 1 & 2 (Basic demonstrations)
  - Contact Form (Contact information collection)
  - Customer Survey (Feedback collection)
  - User Registration (Multi-step wizard)
- **Test Any Form**: Click on a form card to test it
- **View Submissions**: See the JSON data that would be submitted
- **Refresh Forms**: Load any newly created forms

### 2. Dashboard (Camunda Integration)

The Dashboard page is designed for Camunda BPM integration:

- **Purpose**: Display and manage tasks from Camunda's tasklist
- **Features**:
  - View pending tasks
  - Claim unassigned tasks
  - Complete tasks with embedded Formio forms
  - Sort tasks by various criteria
- **Note**: This requires Camunda BPM to be running separately

### 3. Automatic Form Creation

On first startup, the system automatically creates sample forms:

```
✅ Example Form 1 - Basic text, number, and select fields
✅ Example Form 2 - Company information form
✅ Contact Form - Contact details with validation
✅ Customer Survey - Satisfaction survey with panels
✅ User Registration - Multi-step wizard form
```

## 🔧 Common Operations

### View Docker Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f formio-ce    # Formio API logs
docker-compose logs -f web          # React app logs
docker-compose logs -f formio-init  # Form creation logs
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart formio-ce
```

### Stop Everything

```bash
# Stop all containers
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

### Manual Form Creation

If automatic form creation fails, you can create forms manually:

```bash
# Using the provided script
./create-forms-authenticated.sh

# Or access Formio Admin UI
# 1. Go to http://localhost:3001
# 2. Login with admin@example.com / CHANGEME
# 3. Create forms using the visual builder
```

## 🎯 Understanding the Architecture

### System Components

```
┌─────────────────────────────────────────────┐
│                 React App                    │
│         (Forms Gallery & Dashboard)          │
│            http://localhost:5173             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              Formio API Server               │
│         (Form definitions & data)            │
│            http://localhost:3001             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                 MongoDB                      │
│          (Persistent data storage)           │
│              localhost:27017                 │
└─────────────────────────────────────────────┘

Optional:
┌─────────────────────────────────────────────┐
│              Camunda BPM                     │
│         (Workflow & Task Management)         │
│            Runs separately                   │
└─────────────────────────────────────────────┘
```

### How It All Works Together

1. **On Startup**:

   - Docker Compose orchestrates all services
   - MongoDB starts first (data persistence)
   - Formio API connects to MongoDB
   - Init script waits for Formio and creates forms
   - React app starts and connects to Formio API

2. **Forms Gallery Flow**:

   - User visits http://localhost:5173
   - React app fetches forms from Formio API
   - Forms are displayed as interactive cards
   - Clicking a form loads Formio's form renderer
   - Submissions are displayed (not saved in gallery mode)

3. **Dashboard (Camunda) Flow**:
   - Requires Camunda BPM running separately
   - Dashboard fetches tasks from Camunda API
   - Tasks can embed Formio forms
   - Completed forms are submitted back to Camunda

## 🐛 Troubleshooting

### Services Not Starting

```bash
# Check if ports are already in use
lsof -i :3001  # Formio API
lsof -i :5173  # React app
lsof -i :27017 # MongoDB

# View detailed logs
docker-compose logs --tail=50
```

### Forms Not Loading

1. Check Formio is running: http://localhost:3001/status
2. Verify form creation logs: `docker logs formio-init`
3. Check browser console for errors (F12)
4. Try manual form creation script

### "Connection Refused" Errors

```bash
# Ensure all services are running
docker-compose ps

# Restart everything
docker-compose down
docker-compose up --build
```

### Reset Everything (Clean Slate)

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove data directory
rm -rf data/

# Start fresh
docker-compose up --build
```

## 🔒 Security Notes

Default credentials are for development only. For production:

1. Change all passwords in `.env`
2. Use secure JWT secrets
3. Configure proper SSL/TLS
4. Implement proper authentication
5. Use managed MongoDB service
6. Review Formio security settings

## 📚 Additional Resources

- [Formio Documentation](https://help.form.io/)
- [Camunda Documentation](https://docs.camunda.org/)
- [React Documentation](https://react.dev/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. View logs: `docker-compose logs`
3. Open an issue in the repository

## 📝 License

[Your License]

---

**Note**: This application is configured for development use. Additional configuration is required for production deployment.
