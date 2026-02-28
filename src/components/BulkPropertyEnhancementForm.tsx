import { useState } from 'react';
import { Property } from '@/types';
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
import { AlertCircle, Loader2, Check, Info } from 'lucide-react';
import { AMENITIES, COMPLIANCE_TYPES_LABELS, FURNISHING_TYPES_LABELS, PROJECT_STATUS_LABELS } from '@/constants';
import { propertyService } from '@/services/property.service';

interface BulkPropertyEnhancementFormProps {
  selectedProperties: Property[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEnhancementComplete: () => void;
}

export function BulkPropertyEnhancementForm({
  selectedProperties,
  isOpen,
  onOpenChange,
  onEnhancementComplete,
}: BulkPropertyEnhancementFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [furnishingType, setFurnishingType] = useState<string>('');
  const [complianceType, setComplianceType] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  const handleAmenityToggle = (amenityCode: string) => {
    const newAmenities = new Set(selectedAmenities);
    if (newAmenities.has(amenityCode)) {
      newAmenities.delete(amenityCode);
    } else {
      newAmenities.add(amenityCode);
    }
    setSelectedAmenities(newAmenities);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      const enhancementData: Record<string, string | string[]> = {};
      if (furnishingType) enhancementData.furnishingType = furnishingType;
      if (complianceType) enhancementData.complianceType = complianceType;
      if (projectStatus) enhancementData.projectStatus = projectStatus;
      if (selectedAmenities.size > 0) enhancementData.amenities = Array.from(selectedAmenities);

      if (Object.keys(enhancementData).length === 0) {
        setError('Please select at least one field to update');
        return;
      }

      const propertyIds = selectedProperties.map((p) => p.id!);
      await propertyService.bulkEnhancePropertiesForPortals(
        propertyIds,
        enhancementData,
        'current-user-id' // TODO: Get from auth context
      );

      setSuccess(true);
      setTimeout(() => {
        onEnhancementComplete();
        onOpenChange(false);
        setSuccess(false);
        // Reset form
        setFurnishingType('');
        setComplianceType('');
        setProjectStatus('');
        setSelectedAmenities(new Set());
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Enhance Properties for Portal Publishing</DialogTitle>
          <DialogDescription>
            Update portal details for {selectedProperties.length} selected properties
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Only filled fields will be updated for all {selectedProperties.length} selected properties.
              Leave empty to skip that field.
            </AlertDescription>
          </Alert>

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
                {selectedProperties.length} properties enhanced successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Selected Properties Summary */}
          <div className="space-y-2">
            <Label className="font-semibold">Selected Properties</Label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-3">
              <ul className="space-y-1">
                {selectedProperties.map((prop) => (
                  <li key={prop.id} className="text-sm text-gray-700">
                    • {prop.title} ({prop.bedrooms}BR/{prop.bathrooms}BA)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Update Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="furnishing">Furnishing Type (optional)</Label>
                <Select value={furnishingType} onValueChange={setFurnishingType}>
                  <SelectTrigger id="furnishing">
                    <SelectValue placeholder="Leave empty to skip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Skip this field</SelectItem>
                    {Object.entries(FURNISHING_TYPES_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="compliance">Compliance Type (optional)</Label>
                <Select value={complianceType} onValueChange={setComplianceType}>
                  <SelectTrigger id="compliance">
                    <SelectValue placeholder="Leave empty to skip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Skip this field</SelectItem>
                    {Object.entries(COMPLIANCE_TYPES_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="projectStatus">Project Status (optional)</Label>
                <Select value={projectStatus} onValueChange={setProjectStatus}>
                  <SelectTrigger id="projectStatus">
                    <SelectValue placeholder="Leave empty to skip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Skip this field</SelectItem>
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

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Add Amenities to All Properties</h3>
            <p className="text-xs text-gray-600">Selected amenities will be added to existing amenities</p>
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
            {success ? 'Enhanced!' : `Enhance ${selectedProperties.length} Properties`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
