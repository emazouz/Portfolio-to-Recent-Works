# Portfolio & Recent Works — Full-Stack Platform

A full-stack portfolio platform with a **Next.js** front end and a dedicated **Express + TypeScript** API — public portfolio and recent-works showcase backed by structured content management, authenticated admin access, and media uploads.

## 🏗️ Architecture

Monorepo with two packages:

- **`client/`** — Next.js application (shadcn/ui + Radix UI components, React Hook Form + Zod validation)
- **`server/`** — REST API built with Express and TypeScript

## ✨ Server Features

- **Prisma ORM** with PostgreSQL — migrations, seeding and Prisma Studio workflows
- **JWT authentication** (jsonwebtoken + jose) with bcrypt password hashing
- **Media uploads** via Multer + **Cloudinary**, with Supabase integration
- **Contact/notification emails** via Nodemailer
- **Security hardening** — Helmet headers, CORS, cookie parsing, express-rate-limit
- Structured responses with standard HTTP status codes

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Front end | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Back end | Node.js, Express 4, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT, bcryptjs |
| Media / Services | Cloudinary, Supabase, Nodemailer |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/emazouz/Portfolio-to-Recent-Works.git
cd Portfolio-to-Recent-Works

# Server
cd server
npm install
cp .env.example .env        # database URL, JWT secret, Cloudinary/Supabase keys
npx prisma migrate dev
npm run dev

# Client (in a second terminal)
cd ../client
npm install
npm run dev
```

---

Built by **Code by Emazouz** — full-stack web developer building websites and stores that turn visitors into customers.
WhatsApp: https://wa.me/212621443301
