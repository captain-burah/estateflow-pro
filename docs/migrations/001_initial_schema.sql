-- ============================================================================
-- EstateFlow Pro - Supabase Migration
-- Database: PostgreSQL
-- Purpose: Complete schema setup for real estate CRM
-- ============================================================================

-- ============================================================================
-- 1. ENUMS & TYPES
-- ============================================================================

CREATE TYPE property_type AS ENUM ('residential', 'commercial', 'land', 'industrial');
CREATE TYPE property_status AS ENUM ('available', 'sold', 'rented', 'pending', 'off_market');
CREATE TYPE listing_type AS ENUM ('sale', 'rent');
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'broker', 'client');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'on_hold');

-- ============================================================================
-- 2. USERS & ROLES MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'client',
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  company_name VARCHAR(255),
  company_id UUID,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. COMPANIES & TEAM MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  zip_code VARCHAR(20),
  country VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'agent',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(company_id, user_id)
);

-- ============================================================================
-- 4. PROPERTIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type property_type NOT NULL,
  status property_status DEFAULT 'available',
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  total_sqft DECIMAL(10,2),
  lot_sqft DECIMAL(10,2),
  year_built INTEGER,
  price DECIMAL(15,2) NOT NULL,
  asking_price DECIMAL(15,2),
  rental_price DECIMAL(10,2),
  price_per_sqft DECIMAL(10,2),
  
  -- Location
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(255) DEFAULT 'USA',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Features
  has_garage BOOLEAN DEFAULT FALSE,
  garage_spaces INTEGER,
  has_pool BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_fireplace BOOLEAN DEFAULT FALSE,
  property_condition VARCHAR(50),
  
  -- Media
  featured_image_url TEXT,
  images JSONB DEFAULT '[]',
  
  -- Status tracking
  listed_date DATE,
  sold_date DATE,
  days_on_market INTEGER,
  
  -- Metadata
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_company_id ON properties(company_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);

-- ============================================================================
-- 5. AGENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  license_number VARCHAR(100) UNIQUE,
  license_state VARCHAR(100),
  specialization VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_company_id ON agents(company_id);
CREATE INDEX idx_agents_is_active ON agents(is_active);

-- ============================================================================
-- 6. LISTINGS & SHOWINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  type listing_type NOT NULL,
  list_price DECIMAL(15,2) NOT NULL,
  commission_percent DECIMAL(5,2),
  mls_number VARCHAR(100) UNIQUE,
  list_date DATE NOT NULL,
  expiration_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listings_property_id ON listings(property_id);
CREATE INDEX idx_listings_agent_id ON listings(agent_id);
CREATE INDEX idx_listings_is_active ON listings(is_active);

CREATE TABLE IF NOT EXISTS showings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_showings_property_id ON showings(property_id);
CREATE INDEX idx_showings_agent_id ON showings(agent_id);
CREATE INDEX idx_showings_scheduled_at ON showings(scheduled_at);

-- ============================================================================
-- 7. TRANSACTIONS & OFFERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  offer_price DECIMAL(15,2) NOT NULL,
  offer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  status transaction_status DEFAULT 'pending',
  earnest_money DECIMAL(15,2),
  contingencies TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_offers_property_id ON offers(property_id);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_agent_id ON offers(agent_id);
CREATE INDEX idx_offers_status ON offers(status);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  transaction_date DATE,
  sale_price DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2),
  status transaction_status DEFAULT 'pending',
  closing_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ============================================================================
-- 8. LEADS & CLIENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'new',
  property_type_interested VARCHAR(255),
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_agent_id ON leads(agent_id);
CREATE INDEX idx_leads_status ON leads(status);

-- ============================================================================
-- 9. DOCUMENTS & FILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(100),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_documents_transaction_id ON documents(transaction_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- ============================================================================
-- 10. COMMUNICATION & NOTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'email',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_communications_property_id ON communications(property_id);
CREATE INDEX idx_communications_sender_id ON communications(sender_id);
CREATE INDEX idx_communications_recipient_id ON communications(recipient_id);
CREATE INDEX idx_communications_is_read ON communications(is_read);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_property_id ON notes(property_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- ============================================================================
-- 11. ANALYTICS & ACTIVITY LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view team members' profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = auth.uid()
      AND tm.company_id = (
        SELECT company_id FROM team_members
        WHERE user_id = user_profiles.id LIMIT 1
      )
    )
  );

-- ============================================================================
-- COMPANIES POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Team members can view company"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE company_id = companies.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Owner can update company"
  ON companies FOR UPDATE
  USING (owner_id = auth.uid());

-- ============================================================================
-- TEAM MEMBERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their team"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = team_members.company_id
      AND tm.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PROPERTIES POLICIES
-- ============================================================================

CREATE POLICY "Users can view properties from their company"
  ON properties FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE company_id = properties.company_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create properties"
  ON properties FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- AGENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view agents from their company"
  ON agents FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM team_members
      WHERE company_id = agents.company_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create agent profile"
  ON agents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Agents can update their own profile"
  ON agents FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================================
-- LISTINGS POLICIES
-- ============================================================================

CREATE POLICY "Users can view company listings"
  ON listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      WHERE a.id = listings.agent_id
      AND (
        a.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members
          WHERE company_id = a.company_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Agents can create listings"
  ON listings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE id = agent_id
      AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- SHOWINGS POLICIES
-- ============================================================================

CREATE POLICY "Users can view showings for their properties"
  ON showings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members
          WHERE company_id = p.company_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can view their own showings"
  ON showings FOR SELECT
  USING (
    client_id = auth.uid()
    OR agent_id = (SELECT id FROM agents WHERE user_id = auth.uid() LIMIT 1)
  );

-- ============================================================================
-- OFFERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view offers for their properties"
  ON offers FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members
          WHERE company_id = p.company_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Buyers can create offers"
  ON offers FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view transactions for their properties"
  ON transactions FOR SELECT
  USING (
    seller_id = auth.uid()
    OR buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND (
        p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM team_members
          WHERE company_id = p.company_id
          AND user_id = auth.uid()
        )
      )
    )
  );

-- ============================================================================
-- LEADS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (
    user_id = auth.uid()
    OR agent_id = (SELECT id FROM agents WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Users can create leads"
  ON leads FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- DOCUMENTS POLICIES
-- ============================================================================

CREATE POLICY "Users can view documents for their transactions"
  ON documents FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.id = transaction_id
      AND (
        t.seller_id = auth.uid()
        OR t.buyer_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.user_id = auth.uid()
    )
  );

-- ============================================================================
-- COMMUNICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view their messages"
  ON communications FOR SELECT
  USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON communications FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- ============================================================================
-- NOTES POLICIES
-- ============================================================================

CREATE POLICY "Users can view their notes"
  ON notes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create notes"
  ON notes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- ACTIVITY LOG POLICIES
-- ============================================================================

CREATE POLICY "Users can view their activity"
  ON activity_log FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER showings_updated_at BEFORE UPDATE ON showings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER offers_updated_at BEFORE UPDATE ON offers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER notes_updated_at BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
