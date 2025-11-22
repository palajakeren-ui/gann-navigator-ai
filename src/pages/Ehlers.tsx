import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const cyclePeriodData = Array.from({ length: 50 }, (_, i) => ({
  bar: i + 1,
  period: 20 + Math.sin(i / 5) * 8 + Math.random() * 3,
  mama: 47000 + Math.sin(i / 8) * 2000,
  fama: 47000 + Math.sin(i / 8 - 0.5) * 2000,
}));

const indicators = [
  { name: "Dominant Cycle", value: "24 bars", status: "Active", color: "text-blue-500" },
  { name: "MAMA", value: "48,234", status: "Buy", color: "text-green-500" },
  { name: "FAMA", value: "47,156", status: "Follow", color: "text-yellow-500" },
  { name: "Hilbert Transform", value: "0.73", status: "Trending", color: "text-purple-500" },
];

const Ehlers = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Ehlers DSP</h1>
        <p className="text-muted-foreground">Digital Signal Processing indicators by John Ehlers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator, idx) => (
          <Card key={indicator.name} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start justify-between mb-2">
              <Activity className={`w-5 h-5 ${indicator.color}`} />
              <Badge variant={indicator.status === "Buy" ? "default" : "secondary"}>
                {indicator.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{indicator.name}</p>
            <p className="text-2xl font-bold gradient-text">{indicator.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">MAMA/FAMA Adaptive Moving Average</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cyclePeriodData}>
            <defs>
              <linearGradient id="mamaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area type="monotone" dataKey="mama" stroke="hsl(var(--primary))" fill="url(#mamaGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="fama" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Dominant Cycle Period</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cyclePeriodData}>
            <defs>
              <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis dataKey="bar" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" domain={[10, 35]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area type="monotone" dataKey="period" stroke="hsl(var(--chart-3))" fill="url(#cycleGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Ehlers;
