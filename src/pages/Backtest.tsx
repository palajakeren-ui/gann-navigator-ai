import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, BarChart3 } from "lucide-react";

const equityCurve = Array.from({ length: 100 }, (_, i) => ({
  trade: i + 1,
  equity: 100000 + (i * 500) + Math.sin(i / 10) * 5000,
  drawdown: -Math.abs(Math.sin(i / 15) * 3000),
}));

const performanceMetrics = [
  { label: "Total Return", value: "+47.5%", status: "positive" },
  { label: "Sharpe Ratio", value: "2.34", status: "positive" },
  { label: "Win Rate", value: "67%", status: "positive" },
  { label: "Max Drawdown", value: "-8.2%", status: "negative" },
  { label: "Profit Factor", value: "2.15", status: "positive" },
  { label: "Total Trades", value: "1,247", status: "neutral" },
];

const Backtest = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Backtest Engine</h1>
          <p className="text-muted-foreground">Historical strategy performance analysis</p>
        </div>
        <Button className="gap-2">
          <Play className="w-4 h-4" />
          Run Backtest
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric, idx) => (
          <Card key={metric.label} className="p-4 glass-card animate-scale-in text-center" style={{ animationDelay: `${idx * 50}ms` }}>
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <p className={`text-lg font-bold ${
              metric.status === 'positive' ? 'text-green-500' : 
              metric.status === 'negative' ? 'text-red-500' : 
              'text-foreground'
            }`}>
              {metric.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Equity Curve</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={equityCurve}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis dataKey="trade" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="equity" 
              stroke="hsl(var(--primary))" 
              fill="url(#equityGradient)" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Drawdown Analysis</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={equityCurve.filter((_, i) => i % 5 === 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis dataKey="trade" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="drawdown" fill="hsl(var(--destructive))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Backtest;
