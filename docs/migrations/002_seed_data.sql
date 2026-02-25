-- ============================================================================
-- EstateFlow Pro - Seed Data
-- This script populates sample data for testing
-- ============================================================================

-- Create demo user profile (manually create user in Auth UI first)
INSERT INTO user_profiles (id, role, first_name, last_name, phone, is_verified)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'broker',
  'Demo',
  'Agent',
  '555-0001',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create sample company
INSERT INTO companies (id, owner_id, name, logo_url, website, email, phone, address, city, state, zip_code, description)
VALUES (
  '660e8400-e29b-41d4-a716-446655440000'::uuid,
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'EstateFlow Realty',
  'https://via.placeholder.com/100',
  'https://estateflow.local',
  'info@estateflow.local',
  '555-0100',
  '123 Main Street',
  'San Francisco',
  'CA',
  '94102',
  'Premier real estate agency specializing in luxury properties'
) ON CONFLICT DO NOTHING;

-- Create agent
INSERT INTO agents (id, user_id, company_id, license_number, license_state, specialization, phone, email, years_experience, total_sales)
VALUES (
  '770e8400-e29b-41d4-a716-446655440000'::uuid,
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  '660e8400-e29b-41d4-a716-446655440000'::uuid,
  'CA-DRE-01234567',
  'CA',
  'Luxury Residential',
  '555-0001',
  'demo@example.com',
  8,
  42
) ON CONFLICT (user_id) DO NOTHING;

-- Sample Properties
INSERT INTO properties (id, user_id, company_id, title, description, type, status, bedrooms, bathrooms, total_sqft, year_built, price, street_address, city, state, zip_code, latitude, longitude, featured_image_url, listed_date)
VALUES
  -- Property 1: Modern Downtown Loft
  (
    '880e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '660e8400-e29b-41d4-a716-446655440000'::uuid,
    'Modern Downtown Loft with City Views',
    'Stunning downtown loft featuring floor-to-ceiling windows, exposed brick, and an open floor plan. Perfect for the urban professional.',
    'residential',
    'available',
    2,
    2,
    1500,
    2015,
    950000,
    '234 Market Street',
    'San Francisco',
    'CA',
    '94102',
    37.7749,
    -122.4194,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    '2024-01-15'
  ),
  
  -- Property 2: Suburban Family Home
  (
    '990e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '660e8400-e29b-41d4-a716-446655440000'::uuid,
    'Spacious Family Home in Quiet Neighborhood',
    'Lovely 4-bedroom home on a quiet street. Features a large backyard, updated kitchen, and excellent schools nearby.',
    'residential',
    'available',
    4,
    3,
    3200,
    1998,
    1250000,
    '456 Oak Avenue',
    'Palo Alto',
    'CA',
    '94301',
    37.4419,
    -122.1430,
    'https://images.unsplash.com/photo-1570129477492-45201903a270',
    '2024-02-01'
  ),
  
  -- Property 3: Beachfront Condo
  (
    'aa0e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '660e8400-e29b-41d4-a716-446655440000'::uuid,
    'Luxury Beachfront Condo',
    'Exquisite beachfront property with ocean views, private beach access, and resort-style amenities. Direct access to the beach.',
    'residential',
    'available',
    3,
    3.5,
    2800,
    2010,
    2500000,
    '789 Coast Drive',
    'Malibu',
    'CA',
    '90265',
    34.0195,
    -118.7855,
    'https://images.unsplash.com/photo-1576573787620-712effb58e80',
    '2024-01-20'
  ),
  
  -- Property 4: Commercial Office Space
  (
    'bb0e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '660e8400-e29b-41d4-a716-446655440000'::uuid,
    'Prime Office Space in Financial District',
    'High-end commercial office space in the heart of the financial district. Modern amenities, ample parking, and great location.',
    'commercial',
    'available',
    0,
    0,
    5000,
    2008,
    3500000,
    '555 Financial Way',
    'San Francisco',
    'CA',
    '94105',
    37.7938,
    -122.3982,
    'https://images.unsplash.com/photo-1497366216548-37526070297c',
    '2024-02-10'
  );

-- Sample Listings
INSERT INTO listings (id, property_id, agent_id, type, list_price, commission_percent, mls_number, list_date, is_active)
VALUES
  (
    'cc0e8400-e29b-41d4-a716-446655440000'::uuid,
    '880e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440000'::uuid,
    'sale',
    950000,
    5.0,
    'SF-2024-0001',
    '2024-01-15',
    true
  ),
  (
    'dd0e8400-e29b-41d4-a716-446655440000'::uuid,
    '990e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440000'::uuid,
    'sale',
    1250000,
    5.0,
    'PA-2024-0002',
    '2024-02-01',
    true
  ),
  (
    'ee0e8400-e29b-41d4-a716-446655440000'::uuid,
    'aa0e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440000'::uuid,
    'sale',
    2500000,
    5.0,
    'MB-2024-0003',
    '2024-01-20',
    true
  );

-- Sample Leads
INSERT INTO leads (id, user_id, agent_id, first_name, last_name, email, phone, status, property_type_interested, budget_min, budget_max, created_at)
VALUES
  (
    'ff0e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440000'::uuid,
    'John',
    'Doe',
    'john@example.com',
    '555-1001',
    'qualified',
    'residential',
    800000,
    1500000,
    NOW()
  ),
  (
    '1f0e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '770e8400-e29b-41d4-a716-446655440000'::uuid,
    'Jane',
    'Smith',
    'jane@example.com',
    '555-1002',
    'prospect',
    'commercial',
    2000000,
    5000000,
    NOW()
  );

-- Sample Notes
INSERT INTO notes (id, property_id, user_id, content, is_internal)
VALUES
  (
    '2f0e8400-e29b-41d4-a716-446655440000'::uuid,
    '880e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Excellent condition. Recent renovations completed. High demand in this area.',
    true
  ),
  (
    '3f0e8400-e29b-41d4-a716-446655440000'::uuid,
    '990e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    'Family showing scheduled for this weekend. Strong interest from multiple buyers.',
    true
  );
