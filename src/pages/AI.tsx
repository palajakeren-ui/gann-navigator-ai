import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { Brain, Zap, Target, TrendingUp, TrendingDown, Play, RefreshCw, Settings, Activity, Cpu } from "lucide-react";
import { useState } from "react";

const predictionData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  actual: 104000 + Math.sin(i / 5) * 1500 + Math.random() * 500,
  predicted: 104000 + Math.sin(i / 5) * 1500 + Math.random() * 300,
  lstm: 104000 + Math.sin(i / 5 + 0.2) * 1400,
  xgboost: 104000 + Math.sin(i / 5 - 0.1) * 1600,
}));

const aiModels = [
  { name: "LSTM Neural Network", accuracy: 89.2, status: "Active", prediction: "Bullish", confidence: 88, target: 105200, weight: 20 },
  { name: "XGBoost", accuracy: 87.5, status: "Active", prediction: "Bullish", confidence: 86, target: 105100, weight: 18 },
  { name: "Random Forest", accuracy: 84.3, status: "Active", prediction: "Bullish", confidence: 84, target: 104950, weight: 15 },
  { name: "Gradient Boosting", accuracy: 86.1, status: "Active", prediction: "Bullish", confidence: 87, target: 105150, weight: 18 },
  { name: "LightGBM", accuracy: 85.8, status: "Active", prediction: "Bullish", confidence: 85, target: 105050, weight: 14 },
  { name: "Transformer", accuracy: 91.2, status: "Training", prediction: "Bullish", confidence: 92, target: 105300, weight: 15 },
];

const featureImportance = [
  { feature: "Gann Angle Confluence", importance: 0.18 },
  { feature: "Cycle Phase", importance: 0.15 },
  { feature: "MAMA/FAMA Signal", importance: 0.14 },
  { feature: "Planetary Score", importance: 0.12 },
  { feature: "Volume Profile", importance: 0.11 },
  { feature: "Fisher Transform", importance: 0.10 },
  { feature: "Pattern Recognition", importance: 0.08 },
  { feature: "Momentum Indicators", importance: 0.07 },
  { feature: "Volatility", importance: 0.05 },
];

const predictions = [
  { symbol: "BTCUSD", direction: "UP", target: 105200, confidence: 88, timeframe: "24h" },
  { symbol: "ETHUSD", direction: "UP", target: 4150, confidence: 82, timeframe: "24h" },
  { symbol: "XAUUSD", direction: "DOWN", target: 2020, confidence: 75, timeframe: "24h" },
  { symbol: "EURUSD", direction: "UP", target: 1.0920, confidence: 78, timeframe: "24h" },
];

const AI = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const ensembleAccuracy = aiModels.reduce((sum, m) => sum + m.accuracy * m.weight, 0) / aiModels.reduce((sum, m) => sum + m.weight, 0);
  const ensembleConfidence = aiModels.reduce((sum, m) => sum + m.confidence * m.weight, 0) / aiModels.reduce((sum, m) => sum + m.weight, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Brain className="w-8 h-8 text-accent" />
            AI Models
          </h1>
          <p className="text-muted-foreground">Machine learning ensemble for price prediction & pattern recognition</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
          <Button className="gap-2">
            <Zap className="w-4 h-4" />
            Train Models
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <Cpu className="w-10 h-10 mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground mb-1">Ensemble Accuracy</p>
          <p className="text-3xl font-bold gradient-text">{ensembleAccuracy.toFixed(1)}%</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            High Performance
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <Activity className="w-10 h-10 mx-auto mb-3 text-success" />
          <p className="text-sm text-muted-foreground mb-1">Active Models</p>
          <p className="text-3xl font-bold text-foreground">{aiModels.filter(m => m.status === "Active").length}</p>
          <Badge variant="outline" className="mt-2">Production</Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Target className="w-10 h-10 mx-auto mb-3 text-accent" />
          <p className="text-sm text-muted-foreground mb-1">Ensemble Confidence</p>
          <p className="text-3xl font-bold text-accent">{ensembleConfidence.toFixed(0)}%</p>
          <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20">
            Strong Signal
          </Badge>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
          <TrendingUp className="w-10 h-10 mx-auto mb-3 text-success" />
          <p className="text-sm text-muted-foreground mb-1">Consensus</p>
          <p className="text-3xl font-bold text-success">BULLISH</p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            6/6 Models
          </Badge>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Models Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model, idx) => (
              <Card key={model.name} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{model.name}</h3>
                      <p className="text-xs text-muted-foreground">Weight: {model.weight}%</p>
                    </div>
                  </div>
                  <Badge variant={model.status === "Active" ? "default" : "secondary"} className={model.status === "Active" ? "bg-success" : ""}>
                    {model.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className="font-bold text-foreground">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prediction</span>
                    <Badge variant={model.prediction === "Bullish" ? "default" : "destructive"} className={model.prediction === "Bullish" ? "bg-success" : ""}>
                      {model.prediction}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <span className="font-mono font-bold text-foreground">${model.target.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-bold text-success">{model.confidence}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Ensemble Price Prediction</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={['dataMin - 500', 'dataMax + 500']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Ensemble" />
                <Line type="monotone" dataKey="lstm" stroke="hsl(var(--chart-2))" strokeWidth={1} strokeDasharray="5 5" dot={false} name="LSTM" />
                <Line type="monotone" dataKey="xgboost" stroke="hsl(var(--chart-3))" strokeWidth={1} strokeDasharray="5 5" dot={false} name="XGBoost" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Current Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {predictions.map((pred, idx) => (
                <div key={pred.symbol} className="p-4 rounded-lg bg-secondary/50 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-foreground">{pred.symbol}</span>
                    <Badge variant={pred.direction === "UP" ? "default" : "destructive"} className={pred.direction === "UP" ? "bg-success" : ""}>
                      {pred.direction === "UP" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {pred.direction}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target ({pred.timeframe})</span>
                      <span className="font-mono font-bold text-foreground">{pred.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold text-success">{pred.confidence}%</span>
                    </div>
                    <Progress value={pred.confidence} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Model Performance Comparison</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Precision</TableHead>
                  <TableHead>Recall</TableHead>
                  <TableHead>F1 Score</TableHead>
                  <TableHead>Sharpe</TableHead>
                  <TableHead>Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiModels.map((model) => (
                  <TableRow key={model.name}>
                    <TableCell className="font-semibold">{model.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={model.accuracy} className="w-16" />
                        <span>{model.accuracy}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{(model.accuracy - 2 + Math.random() * 4).toFixed(1)}%</TableCell>
                    <TableCell>{(model.accuracy - 3 + Math.random() * 6).toFixed(1)}%</TableCell>
                    <TableCell>{(model.accuracy - 1 + Math.random() * 2).toFixed(1)}%</TableCell>
                    <TableCell>{(1.5 + Math.random() * 1.5).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{model.weight}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Training Status</h3>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-warning" />
                  <span className="font-semibold text-foreground">Transformer Model</span>
                </div>
                <Badge variant="outline" className="border-warning text-warning">Training</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Epoch 78/150</span>
                  <span className="font-semibold text-foreground">52%</span>
                </div>
                <Progress value={52} className="h-2" />
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loss</p>
                    <p className="font-mono font-semibold text-foreground">0.0187</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Val Accuracy</p>
                    <p className="font-mono font-semibold text-success">91.2%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ETA</p>
                    <p className="font-mono font-semibold text-foreground">1h 45m</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Feature Importance (Ensemble)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 0.2]} />
                <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" width={150} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureImportance.slice(0, 6).map((feat, idx) => (
              <Card key={feat.feature} className="p-4 glass-card animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{feat.feature}</span>
                  <Badge variant="outline">{(feat.importance * 100).toFixed(0)}%</Badge>
                </div>
                <Progress value={feat.importance * 100 * 5} className="h-2" />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AI;
