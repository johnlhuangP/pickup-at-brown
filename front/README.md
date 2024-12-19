# Pickup at Brown - Frontend

A React-based frontend application for coordinating pickup sports games at Brown University. Built with TypeScript, Vite, and React.

## Project Structure
front/ ├── src/ # Source code │ ├── api/ # API integration │ ├── assets/ # Static assets │ ├── components/ # Reusable React components │ ├── contexts/ # React contexts (Auth, WebSocket) │ ├── lib/ # Library configurations │ ├── pages/ # Page components │ └── config.ts # Configuration constants ├── e2e/ # End-to-end tests ├── public/ # Public assets └── tests/ # Test files

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running backend server (see backend README)

## Environment Variables

Create a `.env` file in the root directory with:
VITE_SUPABASE_URL=your_supabase_url VITE_SUPABASE_ANON_KEY=your_supabase_key

## Installation

```bash
# Install dependencies
npm install

## Development
npm run dev

The development server will start at http://localhost:5173

## Testing 
# Run e2e tests
npm run test:e2e

# Run unit tests
npm run test

## Technologies Used
* React 18
* TypeScript
* Vite
* React Router DOM
* Bootstrap & React Bootstrap
* Supabase for authentication
* WebSocket for real-time features
* Playwright for testing

## Component Architecture

### Contexts
* `AuthContext`: Manages user authentication state and login/logout flows
* `WebSocketContext`: Handles real-time communication for chat and game updates

### Core Components
* `Header`
  * Navigation bar with auth controls
  * Sport selection dropdown
  * User profile menu
* `Sidebar`
  * Sport filtering options
  * Quick navigation links
  * Active game indicators
* `Feed`
  * Displays available game sessions
  * Sorting and filtering controls
  * Real-time updates

### Pages
* Authentication
  * `SignInPage`: User login form
  * `SignUpPage`: New user registration
  * `ResetPasswordPage`: Password recovery
* Main Features
  * `HomePage`: Dashboard with active games
  * `ProfilePage`: User profile management
  * `GameDetailsPage`: Individual game session view
  * `CreateGamePage`: Game creation form
* User Management
  * `FriendsPage`: Friend list and requests
  * `SettingsPage`: User preferences


