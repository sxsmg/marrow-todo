# Todo List Application Implementation

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure
```
/
├── client/
│   └── src/
│       ├── components/
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       └── index.js
├── server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── .env
└── IMPLEMENTATION.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation
1. Clone the repository
2. Navigate to project directory `/home/cypix-pc/marrow_todo`
3. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
   
### Database Setup
1. Make sure MongoDB is running locally
2. Update `.env` file with correct MongoDB connection string

### Running the Application
1. Start the backend server:
   ```bash
   cd server && npm run dev
   ```
2. Start the React frontend:
   ```bash
   cd ../client && npm start
   ```

### Database Seeding
To populate the database with sample data:

1. Ensure the server is not running
2. Run the seed script:
   ```bash
   cd server
   npm run seed
   ```
   This will create 5 users with 5 todos each

## Implementation Details
- **Todo Management**: Users can create, read, update and delete todos
- **Pagination**: Todos are loaded with infinite scroll
- **Filtering**: Todos can be filtered by tags and priority
- **Sorting**: Todos are sorted by creation date by default
- **Error Handling**: Proper error handling in both frontend and backend
- **Authentication**: JWT based authentication implemented for user-specific operations

## Assumptions
- Default user authentication is implemented
- Basic validation is implemented for todo creation and updates
- Error handling covers common scenarios like network errors and invalid data

## Improvements
- Add user authentication system
- Implement proper validation for user input
- Add testing for both frontend and backend
- Implement CSV/JSON export functionality
- Add proper documentation for API endpoints
