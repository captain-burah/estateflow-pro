import {
  DollarSign,
  Home,
  TrendingUp,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  revenueData,
  portalData,
  agentPerformance,
  dummyProperties,
} from "@/data/dummy-data";

const kpis = [
  {
    label: "Sale Revenue",
    value: "AED 32.8M",
    change: 12.5,
    icon: DollarSign,
  },
  {
    label: "Rental Revenue",
    value: "AED 5.7M",
    change: 8.3,
    icon: Home,
  },
  {
    label: "Luxury Inventory",
    value: "4 Properties",
    change: -2.1,
    icon: Crown,
  },
  {
    label: "Published Listings",
    value: "109",
    change: 15.2,
    icon: Globe,
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Here's your portfolio overview.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="glass-card kpi-glow animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge
                  variant={kpi.change >= 0 ? "default" : "destructive"}
                  className="text-xs font-medium"
                >
                  {kpi.change >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(kpi.change)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(36, 80%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(36, 80%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rentalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`AED ${(value / 1000000).toFixed(2)}M`]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="hsl(36, 80%, 50%)" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
                  <Area type="monotone" dataKey="rental" stroke="hsl(210, 80%, 55%)" fill="url(#rentalGrad)" strokeWidth={2} name="Rental" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portal Stats */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Portal Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="listings" fill="hsl(36, 80%, 50%)" radius={[0, 4, 4, 0]} name="Listings" />
                  <Bar dataKey="leads" fill="hsl(210, 80%, 55%)" radius={[0, 4, 4, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance + Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Agent Performance */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Top Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentPerformance.map((agent, i) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.deals} deals · {agent.conversionRate}% conversion
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    AED {(agent.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Recent Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyProperties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {property.location} · {property.bedrooms} BR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      AED {property.price >= 1000000
                        ? `${(property.price / 1000000).toFixed(1)}M`
                        : `${(property.price / 1000).toFixed(0)}K`}
                    </p>
                    <Badge
                      variant={
                        property.status === "available"
                          ? "default"
                          : property.status === "reserved"
                          ? "secondary"
                          : property.status === "sold"
                          ? "outline"
                          : "secondary"
                      }
                      className="text-[10px] mt-1"
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
