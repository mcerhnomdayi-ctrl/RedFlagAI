# Landyflow HQ Backend Logic

This repository contains the backend logic for Landyflow HQ (LettaBase), a property management platform built with Supabase.

## Features

- **Database Schema:** 5 core tables (`properties`, `tenants`, `payments`, `maintenance_jobs`, `expenses`) with relationships and constraints.
- **Security:** Row Level Security (RLS) policies for all tables, ensuring users only access their own data.
- **Automated Payment Status:** A database trigger automatically calculates payment statuses (`paid`, `late`, `missed`, `pending`) based on due dates and payment dates.
- **Monthly Cron Job:** A Supabase Edge Function that runs on the 2nd of every month to process late payments and send email notifications via Resend.
- **Financial Export:** A utility to export financial data (payments and expenses) to CSV, formatted in ZAR.

## Setup Instructions

### 1. Database Migrations

Run the migrations in the `supabase/migrations` folder against your Supabase project.

### 2. Edge Function

Deploy the `process-late-payments` function:

\`\`\`bash
supabase functions deploy process-late-payments
\`\`\`

Set the required secrets in Supabase:

\`\`\`bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
\`\`\`

### 3. Environment Variables

See `.env.example` for the required environment variables for the frontend.
