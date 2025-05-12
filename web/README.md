# ScrapeBun

A modern web application built with Next.js and React.

## Features

- Modern UI with Tailwind CSS
- Authentication powered by Clerk
- Dark/Light theme support with next-themes
- Built with TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v23 or newer)
- PNPM package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/itsamziii/scrapebun.git
   cd scrapebun/web
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .llm.env with your configuration
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format:write` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

## Deployment

This project can be deployed using Docker:

```bash
docker build -t scrapebun .
docker run -p 3000:3000 scrapebun
```

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Clerk](https://clerk.com/)
- [Zod](https://zod.dev/)

## License

ISC
