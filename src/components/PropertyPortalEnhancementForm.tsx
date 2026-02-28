import { useState } from 'react';
import { Property } from '@/types';
import { PortalLocationSearch } from './PortalLocationSearch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Check } from 'lucide-react';
import { AMENITIES, COMPLIANCE_TYPES_LABELS, FURNISHING_TYPES_LABELS, PROJECT_STATUS_LABELS } from '@/constants';
import { propertyService } from '@/services/property.service';

interface PropertyPortalEnhancementFormProps {
  property: Property;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEnhancementComplete: (updatedProperty: Property) => void;
}

interface LocationMapping {
  property_finder?: { id: string; name: string };
  bayut?: { id: string; name: string };
  dubizzle?: { id: string; name: string };
}

export function PropertyPortalEnhancementForm({
  property,
  isOpen,
  onOpenChange,
  onEnhancementComplete,
}: PropertyPortalEnhancementFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [furnishingType, setFurnishingType] = useState(property.furnishingType || 'unfurnished');
  const [complianceType, setComplianceType] = useState(property.complianceType || 'rera');
  const [projectStatus, setProjectStatus] = useState(property.projectStatus || 'completed');
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(property.amenities || [])
  );
  const [locationMappings, setLocationMappings] = useState<LocationMapping>({});
  const [activeLocationSearch, setActiveLocationSearch] = useState<'property_finder' | 'bayut' | 'dubizzle' | null>(
    null
  );

  const handleAmenityToggle = (amenityCode: string) => {
    const newAmenities = new Set(selectedAmenities);
    if (newAmenities.has(amenityCode)) {
      newAmenities.delete(amenityCode);
    } else {
      newAmenities.add(amenityCode);
    }
    setSelectedAmenities(newAmenities);
  };

  const handleLocationSelect = (locationId: string, locationName: string) => {
    if (activeLocationSearch) {
      setLocationMappings({
        ...locationMappings,
        [activeLocationSearch]: { id: locationId, name: locationName },
      });
      setActiveLocationSearch(null);
    }
  };

  const handleClearLocationMapping = (portal: keyof LocationMapping) => {
    const newMappings = { ...locationMappings };
    delete newMappings[portal];
    setLocationMappings(newMappings);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      // Prepare portal configs
      const portalConfigs = [];
      if (property.publishedPortals?.includes('property_finder') && locationMappings.property_finder) {
        portalConfigs.push({
          portal: 'property_finder',
          locationId: locationMappings.property_finder.id,
          locationFullName: locationMappings.property_finder.name,
        });
      }
      if (property.publishedPortals?.includes('bayut') && locationMappings.bayut) {
        portalConfigs.push({
          portal: 'bayut',
          locationId: locationMappings.bayut.id,
          locationFullName: locationMappings.bayut.name,
        });
      }
      if (property.publishedPortals?.includes('dubizzle') && locationMappings.dubizzle) {
        portalConfigs.push({
          portal: 'dubizzle',
          locationId: locationMappings.dubizzle.id,
          locationFullName: locationMappings.dubizzle.name,
        });
      }

      const updatedProperty = await propertyService.enhancePropertyForPortals(
        property.id!,
        {
          furnishingType,
          complianceType,
          projectStatus,
          amenities: Array.from(selectedAmenities),
          portalConfigs: portalConfigs.length > 0 ? portalConfigs : undefined,
        },
        'current-user-id' // TODO: Get from auth context
      );

      setSuccess(true);
      setTimeout(() => {
        onEnhancementComplete(updatedProperty);
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enhance Property for Portal Publishing</DialogTitle>
          <DialogDescription>
            Complete property details to enable portal publishing. {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Property enhanced successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Basic Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="furnishing">Furnishing Type</Label>
                <Select value={furnishingType} onValueChange={setFurnishingType}>
                  <SelectTrigger id="furnishing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FURNISHING_TYPES_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="compliance">Compliance Type</Label>
                <Select value={complianceType} onValueChange={setComplianceType}>
                  <SelectTrigger id="compliance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPLIANCE_TYPES_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="projectStatus">Project Status</Label>
                <Select value={projectStatus} onValueChange={setProjectStatus}>
                  <SelectTrigger id="projectStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Portal Locations */}
          {property.publishedPortals && property.publishedPortals.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Portal Locations</h3>

              {property.publishedPortals.includes('property_finder') && (
                <div className="space-y-2">
                  <Label className="font-medium">PropertyFinder Location</Label>
                  {activeLocationSearch === 'property_finder' ? (
                    <PortalLocationSearch
                      portalType="property_finder"
                      onSelect={handleLocationSelect}
                      onCancel={() => setActiveLocationSearch(null)}
                    />
                  ) : locationMappings.property_finder ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">{locationMappings.property_finder.name}</p>
                        <p className="text-xs text-green-700">ID: {locationMappings.property_finder.id}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearLocationMapping('property_finder')}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setActiveLocationSearch('property_finder')}
                      className="w-full"
                    >
                      Search PropertyFinder Location
                    </Button>
                  )}
                </div>
              )}

              {property.publishedPortals.includes('bayut') && (
                <div className="space-y-2">
                  <Label className="font-medium">Bayut Location</Label>
                  {activeLocationSearch === 'bayut' ? (
                    <PortalLocationSearch
                      portalType="bayut"
                      onSelect={handleLocationSelect}
                      onCancel={() => setActiveLocationSearch(null)}
                    />
                  ) : locationMappings.bayut ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">{locationMappings.bayut.name}</p>
                        <p className="text-xs text-green-700">ID: {locationMappings.bayut.id}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearLocationMapping('bayut')}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setActiveLocationSearch('bayut')}
                      className="w-full"
                    >
                      Search Bayut Location
                    </Button>
                  )}
                </div>
              )}

              {property.publishedPortals.includes('dubizzle') && (
                <div className="space-y-2">
                  <Label className="font-medium">dubizzle Location</Label>
                  {activeLocationSearch === 'dubizzle' ? (
                    <PortalLocationSearch
                      portalType="dubizzle"
                      onSelect={handleLocationSelect}
                      onCancel={() => setActiveLocationSearch(null)}
                    />
                  ) : locationMappings.dubizzle ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">{locationMappings.dubizzle.name}</p>
                        <p className="text-xs text-green-700">ID: {locationMappings.dubizzle.id}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearLocationMapping('dubizzle')}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setActiveLocationSearch('dubizzle')}
                      className="w-full"
                    >
                      Search dubizzle Location
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => (
                <label key={amenity.code} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Checkbox
                    checked={selectedAmenities.has(amenity.code)}
                    onCheckedChange={() => handleAmenityToggle(amenity.code)}
                  />
                  <span className="text-sm">{amenity.labelEn}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || success}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {success ? 'Enhanced!' : 'Mark as Portal-Ready'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
