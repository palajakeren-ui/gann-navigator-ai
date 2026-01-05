import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  pnl: Math.sin(i / 5) * 1500 + Math.random() * 500 + i * 50,
  equity: 100000 + i * 250 + Math.sin(i / 8) * 3000,
}));

const stats = [
  { label: "Today P&L", value: "+$428.50", change: "+0.43%", positive: true },
  { label: "Week P&L", value: "+$2,145.00", change: "+2.15%", positive: true },
  { label: "Month P&L", value: "+$8,650.00", change: "+8.65%", positive: true },
  { label: "Win Rate", value: "67.8%", change: "+2.3%", positive: true },
];

export const PerformanceCard = () => {
  const currentEquity = performanceData[performanceData.length - 1].equity;
  const startEquity = performanceData[0].equity;
  const totalReturn = ((currentEquity - startEquity) / startEquity * 100).toFixed(2);

  return (
    <Card className="hover-glow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance
          </CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            +{totalReturn}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Equity Chart */}
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
              />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="hsl(var(--success))" 
                fill="url(#perfGradient)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="p-2 rounded-lg bg-secondary/50">
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                  {stat.value}
                </span>
                <span className={`text-[10px] flex items-center gap-0.5 ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sharpe Ratio</span>
            <span className="font-semibold text-foreground">2.34</span>
          </div>
          <Progress value={78} className="h-1.5" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Profit Factor</span>
            <span className="font-semibold text-foreground">2.15</span>
          </div>
          <Progress value={72} className="h-1.5" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Max Drawdown</span>
            <span className="font-semibold text-destructive">-8.2%</span>
          </div>
          <Progress value={18} className="h-1.5 [&>div]:bg-destructive" />
        </div>
      </CardContent>
    </Card>
  );
};
