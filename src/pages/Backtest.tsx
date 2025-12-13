import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart } from "recharts";
import { Play, BarChart3, Download, Upload, Settings, TrendingUp, TrendingDown, Calendar, DollarSign, Clock, FileText, X, File } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

const equityCurve = Array.from({ length: 100 }, (_, i) => ({
  trade: i + 1,
  equity: 100000 + (i * 520) + Math.sin(i / 8) * 4000 + Math.random() * 1000,
  drawdown: -Math.abs(Math.sin(i / 12) * 4),
  returns: (Math.random() - 0.3) * 5,
}));

const monthlyReturns = [
  { month: "Jan 2024", return: 3.2, trades: 28 },
  { month: "Feb 2024", return: 5.8, trades: 32 },
  { month: "Mar 2024", return: -1.2, trades: 25 },
  { month: "Apr 2024", return: 4.5, trades: 30 },
  { month: "May 2024", return: 6.1, trades: 35 },
  { month: "Jun 2024", return: 2.8, trades: 27 },
  { month: "Jul 2024", return: 7.2, trades: 38 },
  { month: "Aug 2024", return: -2.1, trades: 22 },
  { month: "Sep 2024", return: 4.8, trades: 31 },
  { month: "Oct 2024", return: 8.5, trades: 42 },
  { month: "Nov 2024", return: 5.2, trades: 33 },
  { month: "Dec 2024", return: 3.7, trades: 29 },
];

const performanceMetrics = [
  { label: "Total Return", value: "+47.5%", status: "positive" },
  { label: "Sharpe Ratio", value: "2.34", status: "positive" },
  { label: "Win Rate", value: "67.8%", status: "positive" },
  { label: "Max Drawdown", value: "-8.2%", status: "negative" },
  { label: "Profit Factor", value: "2.15", status: "positive" },
  { label: "Total Trades", value: "1,247", status: "neutral" },
];

const strategies = ["Ensemble Multi", "Gann Geometry", "Ehlers DSP", "ML Models", "Astro Cycles", "Pattern Recognition"];
const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN"];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const Backtest = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [config, setConfig] = useState({
    startDate: "2023-01-01",
    endDate: "2024-12-31",
    initialCapital: 100000,
    strategy: "Ensemble Multi",
    timeframe: "H4",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: UploadedFile[] = [];
    Array.from(files).forEach(file => {
      if (file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.xlsx')) {
        newFiles.push({ name: file.name, size: file.size, type: file.type });
      } else {
        toast.error(`${file.name}: Unsupported file type`);
      }
    });
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const runBacktest = () => {
    toast.success("Backtest started...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-accent" />
            Backtest Engine
          </h1>
          <p className="text-muted-foreground">Historical strategy performance analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button onClick={runBacktest} className="gap-2">
            <Play className="w-4 h-4" />
            Run Backtest
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric, idx) => (
          <Card key={metric.label} className="p-4 glass-card text-center animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <p className={`text-xl font-bold ${
              metric.status === 'positive' ? 'text-success' : 
              metric.status === 'negative' ? 'text-destructive' : 
              'text-foreground'
            }`}>
              {metric.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Performance</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={equityCurve}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="trade" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="equity" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="dd" orientation="right" stroke="hsl(var(--muted-foreground))" domain={[-10, 0]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area yAxisId="equity" type="monotone" dataKey="equity" stroke="hsl(var(--success))" fill="url(#equityGradient)" strokeWidth={2} />
                <Bar yAxisId="dd" dataKey="drawdown" fill="hsl(var(--destructive))" opacity={0.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Monthly Returns</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar 
                    dataKey="return" 
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Trade Statistics</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Trades", value: "1,247" },
                  { label: "Winning Trades", value: "846 (67.8%)", positive: true },
                  { label: "Losing Trades", value: "401 (32.2%)", negative: true },
                  { label: "Avg Win", value: "+$425", positive: true },
                  { label: "Avg Loss", value: "-$180", negative: true },
                  { label: "Largest Win", value: "+$2,450", positive: true },
                  { label: "Largest Loss", value: "-$890", negative: true },
                  { label: "Avg Hold Time", value: "4.2 hours" },
                ].map((stat, idx) => (
                  <div key={stat.label} className="flex justify-between p-2 rounded bg-secondary/50">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`text-sm font-semibold ${
                      stat.positive ? 'text-success' : 
                      stat.negative ? 'text-destructive' : 
                      'text-foreground'
                    }`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Backtest Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Start Date
                </Label>
                <Input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> End Date
                </Label>
                <Input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Initial Capital
                </Label>
                <Input
                  type="number"
                  value={config.initialCapital}
                  onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Strategy
                </Label>
                <select
                  value={config.strategy}
                  onChange={(e) => setConfig(prev => ({ ...prev, strategy: e.target.value }))}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground"
                >
                  {strategies.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Timeframe
                </Label>
                <select
                  value={config.timeframe}
                  onChange={(e) => setConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground"
                >
                  {timeframes.map(tf => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Strategy Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Risk Management</h4>
                <div className="space-y-2">
                  <Label>Risk Per Trade (%)</Label>
                  <Input type="number" defaultValue={2} step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input type="number" defaultValue={20} />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss ATR Multiplier</Label>
                  <Input type="number" defaultValue={2} step="0.1" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Entry Rules</h4>
                <div className="space-y-2">
                  <Label>Min Confluence Score</Label>
                  <Input type="number" defaultValue={3} />
                </div>
                <div className="space-y-2">
                  <Label>Min Signal Strength (%)</Label>
                  <Input type="number" defaultValue={70} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Exit Rules</h4>
                <div className="space-y-2">
                  <Label>Take Profit R:R</Label>
                  <Input type="number" defaultValue={2} step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Trailing Stop (%)</Label>
                  <Input type="number" defaultValue={1.5} step="0.1" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Recent Trades</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">R</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }, (_, i) => ({
                  id: 1247 - i,
                  symbol: ["BTCUSD", "ETHUSD", "XAUUSD", "EURUSD"][i % 4],
                  side: i % 3 === 0 ? "Short" : "Long",
                  entry: 104000 + Math.random() * 2000,
                  exit: 104500 + Math.random() * 2000,
                  size: (0.1 + Math.random() * 0.5).toFixed(2),
                  pnl: (Math.random() - 0.3) * 500,
                  r: (Math.random() * 3 - 0.5).toFixed(1),
                  duration: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
                })).map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-mono">{trade.id}</TableCell>
                    <TableCell className="font-semibold">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.side === "Long" ? "default" : "destructive"} className={trade.side === "Long" ? "bg-success" : ""}>
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">${trade.entry.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">${trade.exit.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">{trade.size}</TableCell>
                    <TableCell className={`text-right font-mono font-bold ${trade.pnl > 0 ? 'text-success' : 'text-destructive'}`}>
                      ${trade.pnl.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${parseFloat(trade.r) > 0 ? 'text-success' : 'text-destructive'}`}>
                      {trade.r}R
                    </TableCell>
                    <TableCell className="text-muted-foreground">{trade.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Backtest Data
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload historical price data files for backtesting (CSV, JSON, Excel)
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium mb-2">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Supported formats: CSV, JSON, Excel (.xlsx)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv,.json,.xlsx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Uploaded Files ({uploadedFiles.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(idx)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Backtest;
