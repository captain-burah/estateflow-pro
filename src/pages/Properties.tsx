import { useState } from "react";
import { dummyProperties, type Property } from "@/data/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropertyDetailSheet } from "@/components/PropertyDetailSheet";
import {
  Search,
  Plus,
  MapPin,
  BedDouble,
  Maximize,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  luxury: "bg-primary/10 text-primary border-primary/20",
  sale: "bg-info/10 text-info border-info/20",
  rental: "bg-success/10 text-success border-success/20",
};

const statusColors: Record<string, string> = {
  available: "bg-success/10 text-success",
  reserved: "bg-warning/10 text-warning",
  sold: "bg-muted text-muted-foreground",
  rented: "bg-info/10 text-info",
};

const approvalStatusIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-3 h-3" />,
  pending: <AlertCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
};

const approvalStatusColors: Record<string, string> = {
  approved: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-destructive/10 text-destructive",
};

export default function Properties() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "rental" | "sale" | "luxury">("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [properties, setProperties] = useState(dummyProperties);

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailSheetOpen(true);
  };

  const handlePropertyUpdated = (updatedProperty: Property) => {
    setProperties(
      properties.map((p) =>
        p.id === updatedProperty.id ? updatedProperty : p
      )
    );
    setSelectedProperty(updatedProperty);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            Properties
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {properties.length} total properties across all categories
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "rental", "sale", "luxury"] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
                <TableHead className="hidden lg:table-cell">Agent</TableHead>
                <TableHead className="hidden lg:table-cell">Portals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((property) => (
                <TableRow
                  key={property.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePropertySelect(property)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{property.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[property.category]}>
                      {property.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    AED{" "}
                    {property.price >= 1000000
                      ? `${(property.price / 1000000).toFixed(1)}M`
                      : `${(property.price / 1000).toFixed(0)}K`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3 h-3" />
                        {property.area} sqft
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {property.agent}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1">
                      {property.publishedPortals.map((portal) => (
                        <Badge key={portal} variant="secondary" className="text-[10px]">
                          {portal.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[property.status] + " text-[10px] capitalize"}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={approvalStatusColors[property.approvalStatus] + " text-[10px] gap-1"}
                    >
                      <span className="flex items-center gap-1">
                        {approvalStatusIcons[property.approvalStatus]}
                        {property.approvalStatus === "approved"
                          ? "Approved"
                          : property.approvalStatus === "pending"
                            ? "Pending"
                            : "Rejected"}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Property Detail Sheet */}
      <PropertyDetailSheet
        property={selectedProperty}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onPropertyUpdated={handlePropertyUpdated}
      />
    </div>
  );
}
