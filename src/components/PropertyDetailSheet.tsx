import { useState } from 'react';
import { Property } from '@/types';
import { propertyService } from '@/services/property.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { PropertyEditForm } from './PropertyEditForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MapPin,
  BedDouble,
  Maximize,
  DollarSign,
  Edit2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth.context';

interface PropertyDetailSheetProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyUpdated?: (property: Property) => void;
}

const categoryColors: Record<string, string> = {
  luxury: 'bg-primary/10 text-primary border-primary/20',
  sale: 'bg-info/10 text-info border-info/20',
  rental: 'bg-success/10 text-success border-success/20',
};

const statusColors: Record<string, string> = {
  available: 'bg-success/10 text-success',
  reserved: 'bg-warning/10 text-warning',
  sold: 'bg-muted text-muted-foreground',
  rented: 'bg-info/10 text-info',
};

const approvalStatusIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-4 h-4" />,
  pending: <AlertCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const approvalStatusColors: Record<string, string> = {
  approved: 'bg-success/10 text-success border-success/30',
  pending: 'bg-warning/10 text-warning border-warning/30',
  rejected: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function PropertyDetailSheet({
  property,
  open,
  onOpenChange,
  onPropertyUpdated,
}: PropertyDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const { user } = useAuth();

  if (!property) return null;

  const isAdmin = user?.role === 'admin';
  const isPending = property.approvalStatus === 'pending';
  const hasPendingChanges = property.pendingChanges && Object.keys(property.pendingChanges).length > 0;

  const handleSaveDraft = async (changes: Partial<Property>) => {
    try {
      setIsLoading(true);
      await propertyService.saveDraftChanges(property.id, changes, user?.id || 'unknown');
      if (onPropertyUpdated) {
        const updatedProperty = await propertyService.getProperty(property.id);
        onPropertyUpdated(updatedProperty);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setIsLoading(true);
      await propertyService.submitForApproval(property.id);
      if (onPropertyUpdated) {
        const updatedProperty = await propertyService.getProperty(property.id);
        onPropertyUpdated(updatedProperty);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to submit for approval:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await propertyService.approvePropertyEdits(property.id);
      if (onPropertyUpdated) {
        const updatedProperty = await propertyService.getProperty(property.id);
        onPropertyUpdated(updatedProperty);
      }
    } catch (error) {
      console.error('Failed to approve property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a reason for rejection');
      return;
    }

    try {
      setIsLoading(true);
      await propertyService.rejectPropertyEdits(property.id, rejectionReason);
      if (onPropertyUpdated) {
        const updatedProperty = await propertyService.getProperty(property.id);
        onPropertyUpdated(updatedProperty);
      }
      setShowRejectDialog(false);
      setRejectionReason('');
      setRejectionError(null);
    } catch (error) {
      console.error('Failed to reject property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <SheetTitle className="text-2xl">{property.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {property.location}
                </SheetDescription>
              </div>
              <SheetClose />
            </div>
          </SheetHeader>

          {isEditing ? (
            <div className="space-y-6">
              <PropertyEditForm
                property={property}
                onSaveDraft={handleSaveDraft}
                onSubmitForApproval={handleSubmitForApproval}
                onCancel={() => setIsEditing(false)}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status and Approval Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={categoryColors[property.category]}>
                  {property.category}
                </Badge>
                <Badge className={statusColors[property.status]}>
                  {property.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={approvalStatusColors[property.approvalStatus]}
                >
                  <span className="flex items-center gap-1.5">
                    {approvalStatusIcons[property.approvalStatus]}
                    {property.approvalStatus === 'approved'
                      ? 'Approved'
                      : property.approvalStatus === 'pending'
                        ? 'Pending Approval'
                        : 'Rejected'}
                  </span>
                </Badge>
                {property.rejectionReason && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    Reason: {property.rejectionReason}
                  </Badge>
                )}
              </div>

              {hasPendingChanges && (
                <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                  <p className="text-sm text-info">
                    <strong>Pending Changes:</strong> This property has draft changes waiting for
                    your review.
                  </p>
                </div>
              )}

              <Separator />

              {/* Price Section */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-3xl font-bold">
                  AED {property.price.toLocaleString()}
                </p>
              </div>

              <Separator />

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BedDouble className="w-4 h-4" />
                    Bedrooms
                  </p>
                  <p className="text-xl font-semibold">{property.bedrooms}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Bathrooms</p>
                  <p className="text-xl font-semibold">{property.bathrooms}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    Area
                  </p>
                  <p className="text-xl font-semibold">{property.area.toLocaleString()} sqft</p>
                </div>
              </div>

              <Separator />

              {/* Agent Info */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Assigned Agent</p>
                <p className="text-lg">{property.agent}</p>
              </div>

              {/* Published Portals */}
              {property.publishedPortals.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Published on</p>
                    <div className="flex flex-wrap gap-2">
                      {property.publishedPortals.map((portal) => (
                        <Badge key={portal} variant="secondary" className="text-xs">
                          {portal.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Description */}
              {property.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm leading-relaxed">{property.description}</p>
                  </div>
                </>
              )}

              {/* Edit Metadata */}
              {property.editedAt && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Last Edit</p>
                    <p className="text-sm">
                      {new Date(property.editedAt).toLocaleDateString()} by {property.editedBy}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-6">
                {!isAdmin && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Property
                  </Button>
                )}

                {isAdmin && isPending && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="flex-1 gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Changes
                    </Button>
                    <Button
                      onClick={() => setShowRejectDialog(true)}
                      variant="destructive"
                      disabled={isLoading}
                      className="flex-1 gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Property Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting these changes. The agent will see this reason.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setRejectionError(null);
              }}
              disabled={isLoading}
            />
            {rejectionError && (
              <p className="text-sm text-destructive">{rejectionError}</p>
            )}
          </div>

          <div className="flex gap-3">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
