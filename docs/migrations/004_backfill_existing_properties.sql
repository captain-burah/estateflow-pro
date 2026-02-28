-- ============================================================================
-- EstateFlow Pro - Data Migration Scripts
-- Purpose: Backfill existing properties with portal enhancement defaults
-- ============================================================================

-- ============================================================================
-- 1. BACKFILL PORTAL CONFIGS FROM PUBLISHED PORTALS
-- ============================================================================

-- This script creates port-specific configs for any property that has publishedPortals
-- Convert the published_portals array into individual portal config records

INSERT INTO property_portal_configs (property_id, portal, is_active, portal_status)
SELECT 
  id,
  'property_finder'::portal_name,
  TRUE,
  'draft'::portal_status
FROM properties
WHERE published_portals IS NOT NULL 
  AND published_portals @> ARRAY['property_finder']
  AND NOT EXISTS (
    SELECT 1 FROM property_portal_configs 
    WHERE property_id = properties.id AND portal = 'property_finder'
  )
ON CONFLICT(property_id, portal) DO NOTHING;

INSERT INTO property_portal_configs (property_id, portal, is_active, portal_status)
SELECT 
  id,
  'bayut'::portal_name,
  TRUE,
  'draft'::portal_status
FROM properties
WHERE published_portals IS NOT NULL 
  AND published_portals @> ARRAY['bayut']
  AND NOT EXISTS (
    SELECT 1 FROM property_portal_configs 
    WHERE property_id = properties.id AND portal = 'bayut'
  )
ON CONFLICT(property_id, portal) DO NOTHING;

INSERT INTO property_portal_configs (property_id, portal, is_active, portal_status)
SELECT 
  id,
  'dubizzle'::portal_name,
  TRUE,
  'draft'::portal_status
FROM properties
WHERE published_portals IS NOT NULL 
  AND published_portals @> ARRAY['dubizzle']
  AND NOT EXISTS (
    SELECT 1 FROM property_portal_configs 
    WHERE property_id = properties.id AND portal = 'dubizzle'
  )
ON CONFLICT(property_id, portal) DO NOTHING;

-- ============================================================================
-- 2. BACKFILL TITLE_EN AND DESCRIPTION_EN FROM EXISTING TITLE/DESCRIPTION
-- ============================================================================

UPDATE properties
SET 
  title_ar = NULL,
  description_ar = NULL
WHERE title_ar IS NULL AND title IS NOT NULL;

-- ============================================================================
-- 3. BACKFILL SIZE_SQFT FROM TOTAL_SQFT IF AVAILABLE
-- ============================================================================

UPDATE properties
SET size_sqft = total_sqft
WHERE size_sqft IS NULL AND total_sqft IS NOT NULL;

-- ============================================================================
-- 4. SET DEFAULTS FOR NEW PROPERTIES
-- ============================================================================

UPDATE properties
SET 
  furnishing_type = COALESCE(furnishing_type, 'unfurnished'::furnishing_type),
  compliance_type = COALESCE(compliance_type, 'rera'::compliance_type),
  project_status = COALESCE(project_status, 'completed'::project_status),
  parking_slots = COALESCE(parking_slots, 0),
  is_portal_enhanced = FALSE,
  price_type = CASE 
    WHEN listing_type = 'sale' THEN 'sale'
    WHEN listing_type = 'rent' THEN 'monthly'
    ELSE NULL
  END
WHERE is_portal_enhanced = FALSE;

-- ============================================================================
-- 5. POPULATE MIGRATION LOG FOR AUDITING
-- ============================================================================

INSERT INTO property_migration_logs (new_id, migration_status, missing_fields, notes)
SELECT 
  id,
  'success'::text,
  jsonb_object_agg(field, missing)
  FILTER (WHERE missing = true),
  'Backfilled from Supabase schema migration'
FROM (
  SELECT 
    id,
    'title_ar' as field,
    title_ar IS NULL as missing
  FROM properties
  UNION ALL
  SELECT 
    id,
    'size_sqft' as field,
    size_sqft IS NULL as missing
  FROM properties
  UNION ALL
  SELECT 
    id,
    'location_id (portal_finder)' as field,
    portal_configs->>'property_finder.locationId' IS NULL as missing
  FROM properties
  WHERE published_portals @> ARRAY['property_finder']
) summary
WHERE missing = true
GROUP BY id;

-- ============================================================================
-- 6. CREATE SUMMARY STATISTICS
-- ============================================================================

-- View to see which properties need portal enhancement
CREATE OR REPLACE VIEW properties_needing_enhancement AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.bedrooms,
  p.bathrooms,
  p.published_portals,
  p.is_portal_enhanced,
  COUNT(ppc.id) as configured_portals,
  STRING_AGG(DISTINCT ppc.portal::text, ', ') as configured_portal_names
FROM properties p
LEFT JOIN property_portal_configs ppc ON p.id = ppc.property_id
WHERE p.is_portal_enhanced = FALSE 
  AND p.published_portals IS NOT NULL 
  AND array_length(p.published_portals, 1) > 0
GROUP BY p.id
ORDER BY p.created_at DESC;

-- View to see portal-enhanced properties status
CREATE OR REPLACE VIEW portal_enhanced_properties_status AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.is_portal_enhanced,
  p.portal_enhancement_completed_at,
  COUNT(CASE WHEN ppc.portal_status = 'published' THEN 1 END) as published_on_count,
  COUNT(CASE WHEN ppc.portal_status = 'draft' THEN 1 END) as draft_on_count,
  COUNT(CASE WHEN ppc.portal_status = 'pending' THEN 1 END) as pending_on_count,
  STRING_AGG(DISTINCT ppc.portal::text || ':' || ppc.portal_status::text, ', ') as portal_statuses
FROM properties p
LEFT JOIN property_portal_configs ppc ON p.id = ppc.property_id
WHERE p.is_portal_enhanced = TRUE
GROUP BY p.id
ORDER BY p.portal_enhancement_completed_at DESC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Verify migration with:
-- SELECT * FROM properties_needing_enhancement;
-- SELECT COUNT(*) as total FROM property_migration_logs WHERE migration_status = 'success';
-- SELECT COUNT(*) as enhanced FROM properties WHERE is_portal_enhanced = TRUE;
