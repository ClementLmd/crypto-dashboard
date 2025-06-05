# Crypto Dashboard

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

A full-stack cryptocurrency dashboard application built with Next.js, Node.js, and TypeScript, using a modern monorepo structure with Turborepo.

## 🌐 Live Demo

Check out the live application: [Crypto Dashboard](https://crypto-dashboard-front-phi.vercel.app/)

## 🚀 Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- Prettier

### Backend

- Node.js
- Express
- TypeScript
- Jest for testing

### Development Tools

- pnpm as package manager
- Turborepo for monorepo management
- Husky for git hooks
- ESLint and Prettier for code quality

## 📦 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (version 9.1.0 or higher)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/ClementLmd/crypto-dashboard.git
cd crypto-dashboard
```

2. Install dependencies:

```bash
pnpm install
```

## 🏃‍♂️ Development

To run the development environment:

```bash
# Run both frontend and backend
pnpm dev
```

## 🧪 Testing

```bash
# Run all tests
pnpm test
```

## 🏗️ Building

```bash
# Build all packages
pnpm build
```

## 📝 Code Quality

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Run linting
pnpm lint

# Type checking
pnpm typecheck
```

## 📁 Project Structure

```
crypto-dashboard/
├── front/           # Next.js frontend application
├── back/           # Node.js backend application
├── shared/         # Shared types and utilities
├── .github/        # GitHub configuration
├── .husky/         # Git hooks
└── package.json    # Root package.json
```

## 🔑 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration
BIRDEYE_API_KEY=your_birdeye_api_key

# Database Configuration
CONNECTION_STRING=your_mongodb_connection_string

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 👨‍💻 Author

**Clément Laumond** - [Portfolio](https://portfolio-clement-laumonds-projects.vercel.app/ghreadme)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
