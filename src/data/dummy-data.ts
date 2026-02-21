export interface Property {
  id: string;
  title: string;
  category: "rental" | "sale" | "luxury";
  status: "available" | "reserved" | "sold" | "rented";
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agent: string;
  publishedPortals: string[];
  createdAt: string;
  image: string;
}

export interface KPI {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export const dummyProperties: Property[] = [
  { id: "P-001", title: "Marina Heights Penthouse", category: "luxury", status: "available", price: 12500000, location: "Dubai Marina", bedrooms: 5, bathrooms: 6, area: 8500, agent: "Sarah Al-Farsi", publishedPortals: ["bayut", "property_finder"], createdAt: "2026-01-15", image: "" },
  { id: "P-002", title: "Downtown Studio Apartment", category: "rental", status: "rented", price: 85000, location: "Downtown Dubai", bedrooms: 1, bathrooms: 1, area: 550, agent: "James Mitchell", publishedPortals: ["dubizzle"], createdAt: "2026-01-20", image: "" },
  { id: "P-003", title: "Palm Villa with Private Beach", category: "luxury", status: "reserved", price: 28000000, location: "Palm Jumeirah", bedrooms: 7, bathrooms: 8, area: 15000, agent: "Sarah Al-Farsi", publishedPortals: ["bayut", "property_finder", "dubizzle"], createdAt: "2025-12-10", image: "" },
  { id: "P-004", title: "JBR 2-Bed Sea View", category: "sale", status: "available", price: 2800000, location: "JBR", bedrooms: 2, bathrooms: 2, area: 1400, agent: "Omar Hassan", publishedPortals: ["bayut"], createdAt: "2026-02-01", image: "" },
  { id: "P-005", title: "Business Bay Office Space", category: "rental", status: "available", price: 120000, location: "Business Bay", bedrooms: 0, bathrooms: 2, area: 2200, agent: "James Mitchell", publishedPortals: ["property_finder"], createdAt: "2026-02-05", image: "" },
  { id: "P-006", title: "Creek Harbour 3-Bed", category: "sale", status: "sold", price: 3500000, location: "Dubai Creek Harbour", bedrooms: 3, bathrooms: 3, area: 2100, agent: "Layla Khan", publishedPortals: ["bayut", "dubizzle"], createdAt: "2025-11-28", image: "" },
  { id: "P-007", title: "Emirates Hills Mansion", category: "luxury", status: "available", price: 45000000, location: "Emirates Hills", bedrooms: 9, bathrooms: 12, area: 25000, agent: "Sarah Al-Farsi", publishedPortals: ["bayut", "property_finder"], createdAt: "2026-01-30", image: "" },
  { id: "P-008", title: "Silicon Oasis 1-Bed", category: "rental", status: "available", price: 45000, location: "Dubai Silicon Oasis", bedrooms: 1, bathrooms: 1, area: 750, agent: "Omar Hassan", publishedPortals: ["dubizzle"], createdAt: "2026-02-10", image: "" },
  { id: "P-009", title: "Jumeirah Golf Estates Villa", category: "sale", status: "available", price: 7200000, location: "Jumeirah Golf Estates", bedrooms: 4, bathrooms: 5, area: 5500, agent: "Layla Khan", publishedPortals: ["bayut", "property_finder"], createdAt: "2026-02-12", image: "" },
  { id: "P-010", title: "DIFC Luxury Loft", category: "luxury", status: "reserved", price: 8900000, location: "DIFC", bedrooms: 3, bathrooms: 3, area: 3200, agent: "James Mitchell", publishedPortals: ["property_finder", "dubizzle"], createdAt: "2026-02-15", image: "" },
];

export const revenueData = [
  { month: "Sep", sales: 4200000, rental: 890000 },
  { month: "Oct", sales: 5100000, rental: 920000 },
  { month: "Nov", sales: 3800000, rental: 950000 },
  { month: "Dec", sales: 6200000, rental: 880000 },
  { month: "Jan", sales: 7500000, rental: 1020000 },
  { month: "Feb", sales: 5900000, rental: 1100000 },
];

export const portalData = [
  { name: "Bayut", listings: 42, leads: 128 },
  { name: "Property Finder", listings: 38, leads: 95 },
  { name: "Dubizzle", listings: 29, leads: 67 },
];

export const agentPerformance = [
  { name: "Sarah Al-Farsi", deals: 12, revenue: 18500000, conversionRate: 34 },
  { name: "James Mitchell", deals: 8, revenue: 9200000, conversionRate: 28 },
  { name: "Omar Hassan", deals: 6, revenue: 5800000, conversionRate: 22 },
  { name: "Layla Khan", deals: 9, revenue: 12100000, conversionRate: 31 },
];
