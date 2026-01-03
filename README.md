# Life - Lab Knowledge Management Platform

A minimalist, premium web application for transforming tacit lab knowledge into reusable SOPs and experience cards.

## Overview

Life helps life scientists structure their lab materials, protocols, and experience into searchable, evidence-linked outputs. This MVP enables users to submit materials for manual processing by the founding team.

## Features

- **Public Marketing Site**: Clean, scientific aesthetic with clear value proposition
- **Submission Flow**: Multi-format upload (files, text, links) with user contact info
- **Admin Dashboard**: Password-protected inbox for reviewing submissions
- **File Management**: Secure storage with signed URL downloads
- **Privacy-First**: Clear privacy policy and data control

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Storage)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project (free tier)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Pages

- `/` - Home page with value proposition and CTAs
- `/submit` - Submission form for users to upload materials
- `/thanks` - Confirmation page after submission
- `/admin` - Admin dashboard (password: life-admin-2024)
- `/admin/[id]` - Individual submission detail view
- `/privacy` - Privacy policy page

## Database Schema

### Tables

**submissions**
- Contact info (email, organization, role)
- User materials (notes, pasted text, links)
- Timestamps and consent

**submission_files**
- File metadata (name, size, mime type)
- Storage path references
- Links to parent submissions

### Storage

**uploads** bucket
- Private storage for submitted files
- Signed URLs for admin downloads

## Admin Access

Password: `life-admin-2024`

Access the admin dashboard at `/admin` to:
- View all submissions
- Review contact details and materials
- Download uploaded files
- Track submission timestamps

## Security

- RLS policies on all tables
- Private file storage with signed URLs
- Password-protected admin pages
- No automatic AI processing (concierge model)

## License

Proprietary