# Software Request System

## Overview

This is a software request system that allows users to request access to software. The system has three user roles:

1. **Admin**: Can create new software
2. **Employee**: Can request access to software
3. **Manager**: Can approve or reject access requests

## Project Structure

The project consists of two main parts:

- **Frontend**: React application built with TypeScript and Vite
- **Backend**: Node.js API built with Express and TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Create a `.env` file based on the example:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and other configuration:

   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   FRONTEND_URL=http://localhost:5173
   ```

5. Build & Start the server:

   ```bash
   yarn start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file based on the example:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API URL:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:

   ```bash
   yarn run dev
   ```

6. For production build:
   ```bash
   yarn run build
   ```

## Usage

1. Create an account with the appropriate role (Admin, Employee, or Manager)
2. Log in to the system
3. Based on your role:
   - **Admin**: Create new software
   - **Employee**: Request access to software
   - **Manager**: Approve or reject access requests

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user information

### Software

- `GET /api/software`: Get all software
- `POST /api/software`: Create new software (Admin only)
- `POST /api/software/requests`: Create access request (Employee only)
- `GET /api/software/requests`: Get pending requests (Manager only)
- `PATCH /api/software/requests/:id`: Approve/reject request (Manager only)

## Environment Files

### Backend (.env.example)
