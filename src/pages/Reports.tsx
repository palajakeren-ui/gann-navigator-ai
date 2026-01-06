import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { toast } from "sonner";

const pnlData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  pnl: Math.random() * 2000 - 500,
  cumulative: (i + 1) * 250 + Math.random() * 500,
}));

const categoryData = [
  { name: "Gann Analysis", value: 45, color: "hsl(var(--primary))" },
  { name: "Ehlers DSP", value: 25, color: "hsl(var(--accent))" },
  { name: "AI Predictions", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Manual", value: 10, color: "hsl(var(--chart-4))" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Trading Reports
          </h1>
          <p className="text-muted-foreground">Comprehensive trading performance analysis</p>
        </div>
        <Button onClick={() => toast.success("Generating PDF report...")}>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className="text-xl font-bold text-success">+$17,520</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-xl font-bold text-foreground">68.5%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total Trades</p>
          <p className="text-xl font-bold text-foreground">127</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Avg R:R</p>
          <p className="text-xl font-bold text-foreground">2.4:1</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Cumulative P&L</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Strategy Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
