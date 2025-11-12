# EduHome.my

An educational platform for home learning built with Next.js, React, and Supabase.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project
- GitHub account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduhome.my.git
   cd eduhome.my
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eduhome.my/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout component
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable UI components
│   │   └── providers/    # Context providers
│   ├── lib/              # Utility libraries
│   │   └── supabase.ts   # Supabase client configuration
│   └── styles/           # Component-specific styles
├── public/               # Static files
├── supabase/            # Supabase configuration
├── .github/             # GitHub Actions workflows
├── tests/               # Test files
└── docs/                # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests

## Supabase Setup

1. Create a new project on [supabase.com](https://supabase.com)
2. Get your project URL and anon key from project settings
3. Add them to your `.env.local` file
4. Run database migrations as needed:
   ```bash
   supabase db push
   ```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## Database

The project uses Supabase for:
- User authentication
- Data storage
- Real-time subscriptions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.