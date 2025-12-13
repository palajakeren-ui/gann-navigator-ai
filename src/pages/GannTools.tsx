import { CalculationDemo } from "@/components/CalculationDemo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Calendar, Compass, Target, Grid, Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";

const gannAngles = [
  { ratio: "8x1", angle: "82.5°", desc: "Fastest uptrend", slope: 8 },
  { ratio: "4x1", angle: "75°", desc: "Very strong uptrend", slope: 4 },
  { ratio: "3x1", angle: "71.25°", desc: "Strong uptrend", slope: 3 },
  { ratio: "2x1", angle: "63.75°", desc: "Moderate uptrend", slope: 2 },
  { ratio: "1x1", angle: "45°", desc: "Balanced (key level)", slope: 1 },
  { ratio: "1x2", angle: "26.25°", desc: "Moderate downtrend", slope: 0.5 },
  { ratio: "1x3", angle: "18.75°", desc: "Strong downtrend", slope: 0.33 },
  { ratio: "1x4", angle: "15°", desc: "Very strong downtrend", slope: 0.25 },
  { ratio: "1x8", angle: "7.5°", desc: "Fastest downtrend", slope: 0.125 },
];

const gannNumbers = [7, 30, 45, 52, 90, 144, 180, 270, 360];
const fibNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

const GannTools = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [basePrice, setBasePrice] = useState("104525");
  const [squareOf9Results, setSquareOf9Results] = useState<{ angle: number; price: number; type: string }[]>([]);
  const [hexResults, setHexResults] = useState<{ angle: number; price: number }[]>([]);

  const calculateSquareOf9 = () => {
    const base = parseFloat(basePrice);
    if (isNaN(base)) return;
    
    const results: { angle: number; price: number; type: string }[] = [];
    for (let i = 1; i <= 8; i++) {
      const angle = i * 45;
      const sqrt = Math.sqrt(base);
      const levelUp = Math.pow(sqrt + (angle / 180), 2);
      const levelDown = Math.pow(sqrt - (angle / 180), 2);
      results.push({ angle, price: Math.round(levelUp * 100) / 100, type: "Resistance" });
      results.push({ angle: -angle, price: Math.round(levelDown * 100) / 100, type: "Support" });
    }
    setSquareOf9Results(results.sort((a, b) => b.price - a.price));
  };

  const calculateHexagon = () => {
    const base = parseFloat(basePrice);
    if (isNaN(base)) return;
    
    const results: { angle: number; price: number }[] = [];
    for (let i = 1; i <= 6; i++) {
      const angle = i * 60;
      const price = base * (1 + (angle / 360) * 0.1);
      results.push({ angle, price: Math.round(price * 100) / 100 });
    }
    setHexResults(results);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Target className="w-8 h-8 text-accent" />
            Gann Tools
          </h1>
          <p className="text-muted-foreground">Comprehensive Gann calculation toolkit</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 glass-card text-center animate-scale-in">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold text-foreground mb-2">Square of 9</h3>
          <p className="text-sm text-muted-foreground">Calculate Gann Square levels and angles</p>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
          <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold text-foreground mb-2">Time Cycles</h3>
          <p className="text-sm text-muted-foreground">Natural time periods and turning points</p>
        </Card>

        <Card className="p-6 glass-card text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Compass className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="font-bold text-foreground mb-2">Gann Angles</h3>
          <p className="text-sm text-muted-foreground">1x1, 1x2, 2x1 angle calculations</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Square of 9</TabsTrigger>
          <TabsTrigger value="angles">Gann Angles</TabsTrigger>
          <TabsTrigger value="cycles">Time Cycles</TabsTrigger>
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Square of 9 Calculator
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                <Button onClick={calculateSquareOf9} className="w-full">
                  Calculate Levels
                </Button>
                
                {squareOf9Results.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
                    <Label>Results</Label>
                    {squareOf9Results.map((result, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg ${result.type === "Resistance" ? "bg-destructive/10" : "bg-success/10"}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <Badge variant="outline" className={result.type === "Resistance" ? "text-destructive border-destructive" : "text-success border-success"}>
                              {result.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-2">{result.angle}°</span>
                          </div>
                          <span className="text-lg font-mono font-bold text-foreground">${result.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Hexagon Calculator
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                <Button onClick={calculateHexagon} className="w-full" variant="outline">
                  Calculate Hexagon
                </Button>
                
                {hexResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Hexagon Levels (60° intervals)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {hexResults.map((result, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-secondary/50">
                          <p className="text-xs text-muted-foreground">{result.angle}°</p>
                          <p className="text-lg font-mono font-bold text-foreground">${result.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="angles" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Grid className="w-5 h-5 text-primary" />
              Gann Angle Reference
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ratio</TableHead>
                  <TableHead>Angle</TableHead>
                  <TableHead>Slope</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gannAngles.map((angle) => (
                  <TableRow key={angle.ratio}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{angle.ratio}</Badge>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">{angle.angle}</TableCell>
                    <TableCell className="font-mono">{angle.slope}</TableCell>
                    <TableCell className="text-muted-foreground">{angle.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Angle Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Price</Label>
                <Input type="number" placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label>End Price</Label>
                <Input type="number" placeholder="120" />
              </div>
              <div className="space-y-2">
                <Label>Time (bars)</Label>
                <Input type="number" placeholder="20" />
              </div>
            </div>
            <Button className="mt-4 w-full">Calculate Angle</Button>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Key Gann Numbers</h3>
              <div className="space-y-2">
                {gannNumbers.map((num) => (
                  <div key={num} className="flex justify-between p-2 rounded bg-secondary/50">
                    <span className="text-muted-foreground">{num} days</span>
                    <Badge variant="outline">{num}°</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Natural Cycles</h3>
              <div className="space-y-2">
                {[
                  { name: "Weekly", days: 7 },
                  { name: "Monthly", days: 30 },
                  { name: "Quarterly", days: 90 },
                  { name: "Semi-Annual", days: 180 },
                  { name: "Annual", days: 365 },
                  { name: "2 Year", days: 730 },
                ].map((cycle) => (
                  <div key={cycle.name} className="flex justify-between p-2 rounded bg-secondary/50">
                    <span className="text-muted-foreground">{cycle.name}</span>
                    <span className="font-mono text-foreground">{cycle.days}d</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Fibonacci Time</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {fibNumbers.map((fib) => (
                  <div key={fib} className="flex justify-between p-2 rounded bg-secondary/50">
                    <span className="text-muted-foreground">Fib {fib}</span>
                    <span className="font-mono text-foreground">{fib}d</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Time Cycle Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Cycle Length (days)</Label>
                <Input type="number" placeholder="90" />
              </div>
              <div className="space-y-2">
                <Label>Number of Cycles</Label>
                <Input type="number" placeholder="4" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Calculate Turn Dates</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <CalculationDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GannTools;
