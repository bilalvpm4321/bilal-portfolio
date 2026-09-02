# Bilal Ahamed PT — Developer Portfolio & Admin CMS

A modern, highly animated developer portfolio and full-featured Admin CMS for **Bilal Ahamed PT** (M.Tech in AI & Data Science @ CUSAT, Full Stack & AI/ML Developer).

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and backed by **Supabase** (PostgreSQL, Auth, Storage, Realtime, Row Level Security).

---

## 🌟 Key Features

- **Dynamic Public Portfolio**: Zero hard-coded portfolio content. All profile details, projects, categorized skills, work experience timeline, education, awards, leadership records, and contact channels are dynamically loaded from Supabase PostgreSQL.
- **Supabase Realtime Sync**: Any additions, edits, reordering, or deletions made in the Admin CMS reflect instantly on the public website without needing a page refresh.
- **Secure Admin CMS Dashboard (`/admin`)**:
  - Email & Password Authentication via Supabase Auth + protected routing.
  - Role-based Row Level Security (RLS) policies enforcing database authorization.
  - Full CRUD management for Projects, Skills, Experience, Education, Achievements, Leadership, Certifications, and Social Links.
  - Media & Storage Explorer (`portfolio` bucket) with instant upload, preview, and delete.
  - Inbound contact messages inbox.
- **Rich & Polished Aesthetics**:
  - Dark-first visual identity with subtle electric blue accents inspired by your resume.
  - Smooth Framer Motion entrance & scroll-triggered micro-animations.
  - Dedicated dynamic project route (`/projects/:slug`) and quick-view modal.
  - 100% responsive across mobile, tablet, and widescreen desktop displays.
  - Full support for `prefers-reduced-motion` and accessibility guidelines.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling & UI** | Tailwind CSS v4 + Lucide React Icons |
| **Animations** | Framer Motion + Canvas Confetti |
| **Backend / Database** | Supabase (PostgreSQL with RLS) |
| **Authentication** | Supabase Auth (Email / Password) |
| **File Storage** | Supabase Storage (`portfolio` bucket) |
| **Realtime Updates** | Supabase Realtime Channels (`postgres_changes`) |
| **Routing** | React Router v7 |
| **Forms & Validation** | React Hook Form + Zod |

---

## 🚀 Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/bilalvpm4321/bilal-portfolio.git
cd bilal-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```
*(See `.env.example` for reference. The app also operates in sandbox mode if launched prior to adding keys).*

### 4. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://app.supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the migration files in sequence:
   - `supabase/migrations/001_initial_schema.sql` (Creates all tables, indexes, triggers & RLS policies)
   - `supabase/migrations/002_seed_data.sql` (Inserts your portfolio data: Smile AI Tutor, YodhaC.AI, Experience, CUSAT M.Tech, GATE 2024, etc.)
   - `supabase/migrations/003_storage_policies.sql` (Initializes storage bucket `portfolio` and access rules)
4. Create your Admin user in Supabase:
   - Go to **Authentication -> Users -> Add User** (Email: `bilalvpm2@gmail.com` and your password).
   - Alternatively, insert into `admin_users` table:
     ```sql
     INSERT INTO public.admin_users (id, email, role)
     VALUES ('your-user-uuid-from-auth-users', 'bilalvpm2@gmail.com', 'admin');
     ```

### 5. Run Development Server
```bash
npm run dev
```

Visit:
- **Public Portfolio**: `http://localhost:5173/`
- **Admin Dashboard**: `http://localhost:5173/admin`

---

## 📁 Project Architecture

```
bilal-portfolio/
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql       # PostgreSQL Tables & RLS Policies
│   │   ├── 002_seed_data.sql            # Seed portfolio data for Bilal
│   │   └── 003_storage_policies.sql     # Supabase Storage bucket rules
│   └── setup_database.sql
├── src/
│   ├── components/
│   │   ├── common/                      # Reusable Button, Card, Badge, Modal, Toast
│   │   ├── layout/                      # Navbar, Footer, ThemeToggle
│   │   ├── portfolio/                   # Hero, About, Skills, Projects, Experience, Contact...
│   │   └── admin/                       # AdminLayout, Sidebar, ImageUploader, FileUploader...
│   ├── context/
│   │   ├── AuthContext.tsx              # Supabase Auth session & admin verification
│   │   ├── PortfolioContext.tsx         # Realtime data sync, state & CRUD
│   │   └── ThemeContext.tsx             # Dark / Light theme switch
│   ├── pages/
│   │   ├── HomePage.tsx                 # Main public portfolio single-page
│   │   ├── ProjectDetailsPage.tsx       # /projects/:slug detailed technical view
│   │   ├── NotFoundPage.tsx             # 404 page
│   │   └── admin/                       # Admin CMS views (Profile, Projects, Skills, Media...)
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client & storage helpers
│   │   ├── fallbackData.ts              # Optimistic default dataset
│   │   └── utils.ts
│   ├── types/
│   │   └── database.ts                  # TypeScript database entity definitions
│   ├── App.tsx                          # App routing
│   ├── main.tsx                         # DOM Entrypoint
│   └── index.css                        # Tailwind & animations
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 🔒 Security & Row Level Security (RLS)

All tables are strictly secured via PostgreSQL Row Level Security (RLS):
- **Public Visitors**: Can `SELECT` only published items (`is_published = true` / `is_visible = true`) and `INSERT` messages into `contact_messages`.
- **Admin**: Can perform full `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all tables after authenticating.
- **Storage**: The `portfolio` bucket permits public reads for published media and authenticated write access.

---

## 🚢 Deployment

To build the production bundle:
```bash
npm run build
```
The optimized production bundle in `dist/` can be deployed directly to Vercel, Netlify, Cloudflare Pages, or Fly.io.
Make sure to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in your hosting provider's Environment Variables settings!
