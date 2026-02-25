# EstateFlow Pro - Migration Instructions

## Overview

This document provides step-by-step instructions for setting up the EstateFlow Pro database in Supabase.

## Prerequisites

- Supabase account with a PostgreSQL database created
- Supabase URL and anon key (already in `.env.development`)
- Access to the Supabase dashboard

## Migration Steps

### Step 1: Run the Initial Schema Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `docs/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run**
7. Wait for completion (you'll see a success message)

**What this does:**
- Creates all tables (properties, agents, listings, offers, transactions, etc.)
- Sets up enums and types (property_type, user_role, transaction_status, etc.)
- Configures Row Level Security (RLS) policies for data protection
- Creates indexes for performance
- Sets up triggers for automatic timestamp updates

### Step 2: Insert Sample Data (Optional)

1. Create a new query in SQL Editor
2. Copy contents of `docs/migrations/002_seed_data.sql`
3. Paste and run
4. Verify data was inserted

**What this does:**
- Creates a sample company
- Adds demo agent profile
- Populates 4 sample properties
- Adds sample listings, leads, and notes
- Provides test data for development

## Manual User Setup

After running migrations, you need to create at least one user:

### Create Demo User

1. Go to **Authentication** tab in Supabase dashboard
2. Click **Users**
3. Click **Add User**
4. Enter:
   - Email: `demo@example.com`
   - Password: `Demo123!@`
5. Click **Create User**

### Update User Profile

1. Go back to **Authentication** → **Users**
2. Click the user you created
3. Find the **auth.users ID** (copy it)
4. Go to **SQL Editor**
5. Run this query:

```sql
INSERT INTO user_profiles (id, role, first_name, last_name, is_verified)
VALUES (
  '[PASTE_USER_ID_HERE]',
  'broker',
  'Demo',
  'Agent',
  true
) ON CONFLICT (id) DO NOTHING;
```

## Database Schema Overview

### Core Tables

- **user_profiles** - Extended user information
- **companies** - Real estate companies/brokers
- **team_members** - Company team management
- **agents** - Real estate agent details
- **properties** - Property listings
- **listings** - MLS listings
- **showings** - Property showing schedules
- **offers** - Buyer offers
- **transactions** - Completed sales
- **leads** - Sales leads/prospects

### Supporting Tables

- **documents** - File storage metadata
- **communications** - Messages and emails
- **notes** - Internal notes
- **activity_log** - User action tracking

## User Roles & Permissions

### Role Types

1. **admin** - Full system access
2. **broker** - Company owner, team management
3. **agent** - Real estate agent
4. **client** - Buyer/seller

### RLS Policies

All tables have Row Level Security enabled:

- Users see only their own data
- Team members see company data
- Agents see their listings
- Clients see their offers/transactions

## Testing the Migration

After setup, test by:

1. Login with `demo@example.com` / `Demo123!@`
2. Navigate to Dashboard
3. Visit Properties page
4. You should see the 4 sample properties
5. Click on an agent to see their performance metrics

## Troubleshooting

### "Email rate limit exceeded"

- Wait 15-30 minutes before attempting sign up again
- Use demo credentials for testing

### "RLS policy violation"

- Ensure user is logged in
- Check that user_profiles entry exists for their auth.users ID

### "Properties not showing"

- Verify sample data was inserted
- Check that user has correct role in user_profiles
- Ensure company_id matches in records

### "Images not loading"

- The sample data uses placeholder images
- Upload actual images through the UI once logged in

## Next Steps

1. Create additional test users
2. Test property creation workflow
3. Create sample listings
4. Test offer/transaction flow
5. Verify RLS policies are working correctly

## Environment Variables

Ensure these are in `.env.development`:

```env
VITE_SUPABASE_URL=https://nmzvhdaymnlntocmhpmk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_pEgVp_HA5MEf5kPAyVoEGQ_EG83D6AA
```

## Production Deployment Notes

Before going live:

1. Review all RLS policies for security
2. Set strong authentication rules
3. Configure backups
4. Enable SSL/TLS
5. Set up monitoring and logging
6. Test disaster recovery procedures
7. Create service role API keys for backend services
8. Implement audit logging

## Support

For issues with Supabase:
- Documentation: https://supabase.com/docs
- GitHub Issues: https://github.com/supabase/supabase/issues
- Discord Community: https://discord.supabase.io
