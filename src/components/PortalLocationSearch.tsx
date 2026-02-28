import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { propertyService } from '@/services/property.service';
import { cn } from '@/lib/utils';

interface PortalLocationSearchProps {
  portalType: 'property_finder' | 'bayut' | 'dubizzle';
  onSelect: (locationId: string, locationName: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

export function PortalLocationSearch({
  portalType,
  onSelect,
  onCancel,
  placeholder = 'Search locations...',
  className,
}: PortalLocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let data;
        if (portalType === 'property_finder') {
          data = await propertyService.searchPropertyFinderLocations(searchQuery);
        } else {
          // bayut and dubizzle use CSV locations
          data = await propertyService.searchCSVLocations(searchQuery);
        }
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching locations:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [searchQuery, portalType]);

  const handleSelectLocation = (location: { id: string; name: string }) => {
    setSelectedLocation(location);
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
    onSelect(location.id, location.name);
  };

  const handleClearSelection = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {selectedLocation ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-green-900">{selectedLocation.name}</p>
            <p className="text-xs text-green-700">ID: {selectedLocation.id}</p>
          </div>
          <button
            onClick={handleClearSelection}
            className="p-1 hover:bg-green-100 rounded"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4 text-green-700" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="w-full"
          />
          {loading && (
            <div className="absolute right-3 top-2.5">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          )}

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b last:border-b-0 transition"
                >
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-xs text-gray-500">ID: {location.id}</p>
                </button>
              ))}
            </div>
          )}

          {showResults && results.length === 0 && !loading && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-600">
              No locations found
            </div>
          )}
        </div>
      )}

      {onCancel && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="w-full text-destructive hover:text-destructive"
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
