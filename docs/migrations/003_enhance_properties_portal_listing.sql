-- ============================================================================
-- EstateFlow Pro - Portal Listing Enhancement Migration
-- Purpose: Add multi-language support, portal configuration, and amenities
-- ============================================================================

-- ============================================================================
-- 1. ENUMS FOR PORTAL FEATURES
-- ============================================================================

CREATE TYPE furnishing_type AS ENUM ('unfurnished', 'semi-furnished', 'furnished');
CREATE TYPE compliance_type AS ENUM ('rera', 'dtcm', 'adrec');
CREATE TYPE project_status AS ENUM ('completed', 'off_plan', 'completed_primary', 'off_plan_primary');
CREATE TYPE portal_name AS ENUM ('property_finder', 'bayut', 'dubizzle');
CREATE TYPE portal_status AS ENUM ('draft', 'published', 'pending', 'error');

-- ============================================================================
-- 2. ALTER PROPERTIES TABLE - ADD PORTAL LISTING FIELDS
-- ============================================================================

ALTER TABLE IF EXISTS properties
ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS furnishing_type furnishing_type DEFAULT 'unfurnished',
ADD COLUMN IF NOT EXISTS compliance_type compliance_type DEFAULT 'rera',
ADD COLUMN IF NOT EXISTS listed_advertisement_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS size_sqft DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS property_age INTEGER,
ADD COLUMN IF NOT EXISTS available_from DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS downpayment DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS number_of_cheques INTEGER,
ADD COLUMN IF NOT EXISTS project_status project_status DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS developer VARCHAR(255),
ADD COLUMN IF NOT EXISTS unit_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS floor_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS parking_slots INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS portal_configs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS images_metadata JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_portal_enhanced BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS portal_enhancement_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS portal_enhancement_completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS price_type VARCHAR(50);

-- ============================================================================
-- 3. CREATE PORTAL CONFIG TABLE (Alternative to JSONB for better querying)
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_portal_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  portal portal_name NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  location_id VARCHAR(255),
  location_full_name VARCHAR(500),
  published_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  portal_status portal_status DEFAULT 'draft',
  validation_errors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, portal)
);

CREATE INDEX idx_property_portal_configs_property_id ON property_portal_configs(property_id);
CREATE INDEX idx_property_portal_configs_portal ON property_portal_configs(portal);
CREATE INDEX idx_property_portal_configs_portal_status ON property_portal_configs(portal_status);

-- ============================================================================
-- 4. CREATE AMENITIES REFERENCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS amenity_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  label_en VARCHAR(255) NOT NULL,
  label_ar VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert amenity options
INSERT INTO amenity_options (code, label_en, label_ar, category) VALUES
('central-ac', 'Central AC', 'تكييف مركزي', 'Climate Control'),
('built-in-wardrobes', 'Built-in Wardrobes', 'خزائن مدمجة', 'Storage'),
('kitchen-appliances', 'Kitchen Appliances', 'أجهزة المطبخ', 'Kitchen'),
('security', 'Security', 'الأمن', 'Safety'),
('concierge', 'Concierge', 'موظف الاستقبال', 'Services'),
('maid-service', 'Maid Service', 'خدمة التنظيف', 'Services'),
('balcony', 'Balcony', 'شرفة', 'Outdoor'),
('private-gym', 'Private Gym', 'صالة ألعاب خاصة', 'Recreation'),
('shared-gym', 'Shared Gym', 'صالة ألعاب مشتركة', 'Recreation'),
('private-jacuzzi', 'Private Jacuzzi', 'حوض استحمام خاص', 'Recreation'),
('shared-spa', 'Shared Spa', 'منتجع صحي مشترك', 'Recreation'),
('covered-parking', 'Covered Parking', 'موقف سيارات مغطى', 'Parking'),
('maids-room', 'Maids Room', 'غرفة الخادمة', 'Rooms'),
('study', 'Study', 'دراسة', 'Rooms'),
('childrens-play-area', 'Children''s Play Area', 'منطقة لعب الأطفال', 'Recreation'),
('pets-allowed', 'Pets Allowed', 'الحيوانات الأليفة مسموح بها', 'Policies'),
('barbecue-area', 'Barbecue Area', 'منطقة الشواء', 'Outdoor'),
('shared-pool', 'Shared Pool', 'حمام سباحة مشترك', 'Recreation'),
('childrens-pool', 'Children''s Pool', 'حمام السباحة للأطفال', 'Recreation'),
('private-garden', 'Private Garden', 'حديقة خاصة', 'Outdoor'),
('private-pool', 'Private Pool', 'حمام سباحة خاص', 'Recreation'),
('view-of-water', 'View of Water', 'إطلالة على الماء', 'Views'),
('view-of-landmark', 'View of Landmark', 'إطلالة على معالم سياحية', 'Views'),
('walk-in-closet', 'Walk-in Closet', 'خزانة مدمجة', 'Storage'),
('lobby-in-building', 'Lobby in Building', 'بهو في المبنى', 'Common Areas'),
('vastu-compliant', 'Vastu Compliant', 'متوافق مع فاستو', 'Special'),
('networked', 'Networked', 'متصل بالشبكة', 'Technology'),
('dining-in-building', 'Dining in Building', 'تناول الطعام في المبنى', 'Services'),
('conference-room', 'Conference Room', 'غرفة المؤتمرات', 'Business')
ON CONFLICT(code) DO NOTHING;

-- ============================================================================
-- 5. CREATE PROPERTY MIGRATION LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_migration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id VARCHAR(255),
  new_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  migration_status VARCHAR(50) DEFAULT 'success',
  missing_fields JSONB,
  notes TEXT,
  migrated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_property_migration_logs_status ON property_migration_logs(migration_status);

-- ============================================================================
-- 6. ADD INDEXES ON NEW COLUMNS
-- ============================================================================

CREATE INDEX idx_properties_is_portal_enhanced ON properties(is_portal_enhanced);
CREATE INDEX idx_properties_assigned_agent_id ON properties(assigned_agent_id);
CREATE INDEX idx_properties_furnishing_type ON properties(furnishing_type);
CREATE INDEX idx_properties_compliance_type ON properties(compliance_type);
CREATE INDEX idx_properties_project_status ON properties(project_status);

-- ============================================================================
-- 7. CREATE FUNCTION TO UPDATE PORTAL CONFIGS FROM JSONB
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_portal_configs()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to sync portal_configs JSONB with the relational table
  -- Implementation depends on your specific needs
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Run verification:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name='properties';
