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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Loader2, Check } from 'lucide-react';
import { PORTAL_STATUS_LABELS } from '@/constants';
import { propertyService } from '@/services/property.service';

interface PortalPublishDialogProps {
  property: Property;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishComplete: (updatedProperty: Property) => void;
}

export function PortalPublishDialog({
  property,
  isOpen,
  onOpenChange,
  onPublishComplete,
}: PortalPublishDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState<Set<string>>(
    new Set(property.publishedPortals || [])
  );

  const availablePortals: Array<{
    id: string;
    name: string;
    description: string;
  }> = [
    {
      id: 'property_finder',
      name: 'PropertyFinder (API)',
      description: 'Creates/updates the listing on PropertyFinder via API.',
    },
    {
      id: 'bayut',
      name: 'Bayut (XML)',
      description: 'Publishes through the combined XML feed.',
    },
    {
      id: 'dubizzle',
      name: 'dubizzle (XML)',
      description: 'Publishes through the combined XML feed.',
    },
  ];

  const handlePortalToggle = (portalId: string) => {
    const newPortals = new Set(selectedPortals);
    if (newPortals.has(portalId)) {
      newPortals.delete(portalId);
    } else {
      newPortals.add(portalId);
    }
    setSelectedPortals(newPortals);
  };

  const handlePublish = async () => {
    try {
      setError(null);
      setLoading(true);

      if (selectedPortals.size === 0) {
        setError('Please select at least one portal');
        return;
      }

      // Check if property is enhanced
      if (!property.isPortalEnhanced) {
        setError('Property must be enhanced before publishing. Please complete the enhancement first.');
        return;
      }

      const updatedProperty = await propertyService.publishToPortals(
        property.id!,
        Array.from(selectedPortals)
      );

      setSuccess(true);
      setTimeout(() => {
        onPublishComplete(updatedProperty);
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Property to Portals</DialogTitle>
          <DialogDescription>
            Select which portals to publish this property to. {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!property.isPortalEnhanced && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This property has not been enhanced for portal publishing. Some portal-specific data may be
                missing. Please enhance the property first.
              </AlertDescription>
            </Alert>
          )}

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
                Property published successfully to selected portals!
              </AlertDescription>
            </Alert>
          )}

          {/* Portal Selection */}
          <div className="space-y-4">
            <Label className="font-semibold">Choose Portals</Label>
            <div className="space-y-3">
              {availablePortals.map((portal) => {
                const isSelected = selectedPortals.has(portal.id);
                const config = property.portalConfigs?.find((c) => c.portal === portal.id);
                const hasLocation = !!config?.locationId;
                const hasError = !hasLocation && isSelected;

                return (
                  <div
                    key={portal.id}
                    className={`p-4 border-2 rounded-lg transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : hasError
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={portal.id}
                        checked={isSelected}
                        onCheckedChange={() => handlePortalToggle(portal.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={portal.id}
                          className="text-sm font-semibold text-gray-900 cursor-pointer block"
                        >
                          {portal.name}
                        </label>
                        <p className="text-xs text-gray-600 mt-1">{portal.description}</p>

                        {/* Portal Status Info */}
                        {config && (
                          <div className="mt-2 text-xs space-y-1">
                            <p className="text-gray-700">
                              <span className="font-medium">Status:</span>{' '}
                              <span className="capitalize">{PORTAL_STATUS_LABELS[config.portalStatus] || config.portalStatus}</span>
                            </p>
                            {config.locationId ? (
                              <p className="text-green-700">
                                <span className="font-medium">✓ Location:</span> {config.locationFullName}
                              </p>
                            ) : (
                              <p className="text-red-700">
                                <span className="font-medium">✗ Location:</span> Not configured
                              </p>
                            )}
                            {config.publishedAt && (
                              <p className="text-gray-600">
                                <span className="font-medium">Published:</span>{' '}
                                {new Date(config.publishedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Validation Errors */}
                        {config?.validationErrors && config.validationErrors.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                            <p className="text-xs font-medium text-red-700 mb-1">Issues:</p>
                            <ul className="text-xs text-red-600 space-y-0.5">
                              {config.validationErrors.map((error, idx) => (
                                <li key={idx}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedPortals.size > 0 && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <AlertDescription className="text-blue-700">
                Ready to publish to {selectedPortals.size} portal{selectedPortals.size !== 1 ? 's' : ''}: {' '}
                {Array.from(selectedPortals)
                  .map((p) => availablePortals.find((ap) => ap.id === p)?.name || p)
                  .join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={loading || success || selectedPortals.size === 0}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {success ? 'Published!' : `Publish to ${selectedPortals.size} Portal${selectedPortals.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
