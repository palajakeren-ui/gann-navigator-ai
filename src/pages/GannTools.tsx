import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, Calendar, Compass, Target, Grid3X3, Sparkles, RefreshCw,
  TrendingUp, TrendingDown, Hexagon, Clock, Copy, Download
} from "lucide-react";
import { toast } from "sonner";

// Calculation functions
const calculateSquareOf9 = (centerPrice: number, numLevels: number = 8) => {
  const root = Math.sqrt(centerPrice);
  const levels: Array<{ degree: number; price: number; type: string; description: string }> = [];
  const cardinalLevels: number[] = [];
  const ordinalLevels: number[] = [];

  // Cardinal angles (0°, 90°, 180°, 270°, 360°)
  const cardinalAngles = [0, 90, 180, 270, 360, 450, 540, 630, 720];
  const ordinalAngles = [45, 135, 225, 315, 405, 495, 585, 675];

  cardinalAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    cardinalLevels.push(price);
    levels.push({
      degree,
      price,
      type: 'cardinal',
      description: `${degree}° Cardinal - Major S/R`
    });
  });

  ordinalAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    ordinalLevels.push(price);
    levels.push({
      degree,
      price,
      type: 'ordinal',
      description: `${degree}° Ordinal - Secondary S/R`
    });
  });

  for (let i = 1; i <= numLevels; i++) {
    const supportRoot = root - (i * 0.25);
    if (supportRoot > 0) {
      levels.push({
        degree: -i * 90,
        price: Math.pow(supportRoot, 2),
        type: 'support',
        description: `Support Level ${i} (-${i * 90}°)`
      });
    }
    const resistanceRoot = root + (i * 0.25);
    levels.push({
      degree: i * 90,
      price: Math.pow(resistanceRoot, 2),
      type: 'resistance',
      description: `Resistance Level ${i} (+${i * 90}°)`
    });
  }

  levels.sort((a, b) => a.price - b.price);
  return { inputPrice: centerPrice, root, levels, cardinalLevels: cardinalLevels.sort((a, b) => a - b), ordinalLevels: ordinalLevels.sort((a, b) => a - b) };
};

const calculateHexagonLevels = (centerPrice: number) => {
  const root = Math.sqrt(centerPrice);
  const levels: Array<{ degree: number; price: number; type: string; harmonic: string }> = [];
  const hexAngles = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720];
  
  hexAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    
    let harmonic = '';
    if (degree % 180 === 0) harmonic = 'Full Pivot';
    else if (degree % 120 === 0) harmonic = 'Resistance Harmonic';
    else if (degree % 60 === 0) harmonic = 'Support Harmonic';
    
    levels.push({ degree, price, type: degree % 180 === 0 ? 'major' : degree % 60 === 0 ? 'minor' : 'tertiary', harmonic });
  });
  return levels;
};

const calculateSquareOf90 = (centerPrice: number) => {
  const root = Math.sqrt(centerPrice);
  const levels: Array<{ degree: number; price: number; type: string; description: string }> = [];
  
  for (let i = -4; i <= 4; i++) {
    if (i === 0) {
      levels.push({ degree: 0, price: centerPrice, type: 'cardinal', description: 'Center Price' });
      continue;
    }
    const newRoot = root + (i * 90 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: i * 90,
        price: Math.pow(newRoot, 2),
        type: i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i * 90)}° ${i > 0 ? 'Resistance' : 'Support'}`
      });
    }
  }
  return levels.sort((a, b) => a.price - b.price);
};

const calculateTimeCycles = (startDate: Date) => {
  const cycles = [
    { cycle: '7-Day', days: 7, significance: 'medium' as const },
    { cycle: '21-Day', days: 21, significance: 'high' as const },
    { cycle: '30-Day', days: 30, significance: 'medium' as const },
    { cycle: '45-Day', days: 45, significance: 'medium' as const },
    { cycle: '52-Day (Weekly Cycle)', days: 52, significance: 'high' as const },
    { cycle: '90-Day (Quarter)', days: 90, significance: 'high' as const },
    { cycle: '144-Day (Fibonacci)', days: 144, significance: 'high' as const },
    { cycle: '180-Day (Half Year)', days: 180, significance: 'medium' as const },
    { cycle: '360-Day (Full Year)', days: 360, significance: 'high' as const },
  ];
  return cycles.map(c => ({ ...c, targetDate: new Date(startDate.getTime() + c.days * 24 * 60 * 60 * 1000) }));
};

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
  const [inputPrice, setInputPrice] = useState(104525);
  const [calculatedLevels, setCalculatedLevels] = useState<ReturnType<typeof calculateSquareOf9> | null>(null);
  const [hexagonLevels, setHexagonLevels] = useState<ReturnType<typeof calculateHexagonLevels> | null>(null);
  const [square90Levels, setSquare90Levels] = useState<ReturnType<typeof calculateSquareOf90> | null>(null);
  const [timeCycles, setTimeCycles] = useState<ReturnType<typeof calculateTimeCycles> | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCalculateAll = () => {
    setCalculatedLevels(calculateSquareOf9(inputPrice, 8));
    setHexagonLevels(calculateHexagonLevels(inputPrice));
    setSquare90Levels(calculateSquareOf90(inputPrice));
    setTimeCycles(calculateTimeCycles(new Date(startDate)));
    toast.success("All Gann calculations completed!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const exportResults = () => {
    const data = { inputPrice, square9: calculatedLevels, hexagon: hexagonLevels, square90: square90Levels, timeCycles };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gann-calculations-${inputPrice}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Results exported!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Gann Calculation Tools
          </h1>
          <p className="text-muted-foreground">Advanced Gann geometry calculations for price analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="inputPrice" className="text-muted-foreground whitespace-nowrap">Price:</Label>
            <Input
              id="inputPrice"
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(parseFloat(e.target.value) || 0)}
              className="w-32"
            />
          </div>
          <Button onClick={handleCalculateAll}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate All
          </Button>
          <Button variant="outline" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover-glow">
          <div className="flex items-center gap-3">
            <Grid3X3 className="w-10 h-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Square Root</p>
              <p className="text-xl font-bold">{Math.sqrt(inputPrice).toFixed(4)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover-glow">
          <div className="flex items-center gap-3">
            <Target className="w-10 h-10 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">90° Support</p>
              <p className="text-xl font-bold text-success">
                {Math.pow(Math.sqrt(inputPrice) - 0.25, 2).toFixed(0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover-glow">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">90° Resistance</p>
              <p className="text-xl font-bold text-destructive">
                {Math.pow(Math.sqrt(inputPrice) + 0.25, 2).toFixed(0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover-glow">
          <div className="flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">360° Level</p>
              <p className="text-xl font-bold text-accent">
                {Math.pow(Math.sqrt(inputPrice) + 1, 2).toFixed(0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="square9" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="square9" className="flex items-center gap-1">
            <Grid3X3 className="w-4 h-4" />
            Square of 9
          </TabsTrigger>
          <TabsTrigger value="square90" className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            Square of 90
          </TabsTrigger>
          <TabsTrigger value="hexagon" className="flex items-center gap-1">
            <Hexagon className="w-4 h-4" />
            Hexagon
          </TabsTrigger>
          <TabsTrigger value="angles" className="flex items-center gap-1">
            <Compass className="w-4 h-4" />
            Fan Angles
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Time Cycles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="square9" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-primary" />
                  Square of 9 Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Input Price</p>
                      <p className="text-2xl font-bold text-foreground">${inputPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Square Root</p>
                      <p className="text-2xl font-bold text-primary">{Math.sqrt(inputPrice).toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                {calculatedLevels && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Cardinal Levels</p>
                      <div className="grid grid-cols-3 gap-2">
                        {calculatedLevels.cardinalLevels.slice(0, 6).map((level, idx) => (
                          <div 
                            key={idx}
                            className="p-2 bg-primary/10 rounded text-center cursor-pointer hover:bg-primary/20"
                            onClick={() => copyToClipboard(level.toFixed(2))}
                          >
                            <p className="text-xs text-muted-foreground">{idx * 90}°</p>
                            <p className="text-sm font-mono font-bold text-primary">
                              {level.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Ordinal Levels</p>
                      <div className="grid grid-cols-4 gap-2">
                        {calculatedLevels.ordinalLevels.slice(0, 4).map((level, idx) => (
                          <div 
                            key={idx}
                            className="p-2 bg-accent/10 rounded text-center cursor-pointer hover:bg-accent/20"
                            onClick={() => copyToClipboard(level.toFixed(2))}
                          >
                            <p className="text-xs text-muted-foreground">{45 + idx * 90}°</p>
                            <p className="text-sm font-mono font-bold text-accent">
                              {level.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover-glow">
              <CardHeader>
                <CardTitle>All Calculated Levels</CardTitle>
              </CardHeader>
              <CardContent>
                {calculatedLevels ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Degree</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculatedLevels.levels.map((level, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono">{level.degree}°</TableCell>
                            <TableCell className={`font-mono font-bold ${
                              level.type === 'support' ? 'text-success' :
                              level.type === 'resistance' ? 'text-destructive' :
                              'text-primary'
                            }`}>
                              {level.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                level.type === 'support' ? 'default' :
                                level.type === 'resistance' ? 'destructive' :
                                'secondary'
                              } className="text-xs">
                                {level.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(level.price.toFixed(2))}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Click "Calculate All" to generate levels</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="square90" className="space-y-4 mt-6">
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Square of 90 (Quarter Cycle)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {square90Levels ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {square90Levels.map((level, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        level.type === 'support' ? 'bg-success/10 border border-success/30' :
                        level.type === 'resistance' ? 'bg-destructive/10 border border-destructive/30' :
                        'bg-primary/10 border border-primary/30'
                      }`}
                      onClick={() => copyToClipboard(level.price.toFixed(2))}
                    >
                      <p className="text-xs text-muted-foreground">{level.degree}°</p>
                      <p className={`text-xl font-bold font-mono ${
                        level.type === 'support' ? 'text-success' :
                        level.type === 'resistance' ? 'text-destructive' :
                        'text-primary'
                      }`}>
                        {level.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Click "Calculate All" to generate levels</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hexagon" className="space-y-4 mt-6">
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hexagon className="w-5 h-5 text-primary" />
                Hexagon Calculator (60° Intervals)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hexagonLevels ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {hexagonLevels.map((level, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        level.type === 'major' ? 'bg-primary/20 border border-primary/40' :
                        level.type === 'minor' ? 'bg-accent/10 border border-accent/30' :
                        'bg-secondary/30'
                      }`}
                      onClick={() => copyToClipboard(level.price.toFixed(2))}
                    >
                      <p className="text-xs text-muted-foreground">{level.degree}°</p>
                      <p className="text-lg font-bold font-mono text-foreground">
                        {level.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                      <p className="text-xs text-muted-foreground">{level.harmonic}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Click "Calculate All" to generate levels</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="angles" className="space-y-4 mt-6">
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Gann Fan Angle Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ratio</TableHead>
                    <TableHead>Angle</TableHead>
                    <TableHead>Slope</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gannAngles.map((angle, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-bold font-mono">{angle.ratio}</TableCell>
                      <TableCell className="font-mono">{angle.angle}</TableCell>
                      <TableCell className="font-mono">{angle.slope}</TableCell>
                      <TableCell className="text-muted-foreground">{angle.desc}</TableCell>
                      <TableCell>
                        <Badge variant={angle.slope >= 1 ? 'destructive' : 'default'}>
                          {angle.slope >= 1 ? 'Resistance' : 'Support'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-4 mt-6">
          <Card className="hover-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Time Cycle Projections
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label>Start Date:</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {timeCycles ? (
                <div className="space-y-3">
                  {timeCycles.map((cycle, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{cycle.cycle}</p>
                        <p className="text-xs text-muted-foreground">{cycle.days} days from start</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-mono text-foreground">
                          {cycle.targetDate.toLocaleDateString()}
                        </p>
                        <Badge variant={
                          cycle.significance === 'high' ? 'default' :
                          cycle.significance === 'medium' ? 'secondary' :
                          'outline'
                        }>
                          {cycle.significance}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Click "Calculate All" to generate cycles</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-glow">
              <CardHeader>
                <CardTitle className="text-lg">Key Gann Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gannNumbers.map((num) => (
                    <div key={num} className="flex justify-between p-2 rounded bg-secondary/50">
                      <span className="text-muted-foreground">{num} days</span>
                      <Badge variant="outline">{num}°</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-glow">
              <CardHeader>
                <CardTitle className="text-lg">Natural Cycles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "Weekly", days: 7 },
                    { name: "Monthly", days: 30 },
                    { name: "Quarterly", days: 90 },
                    { name: "Semi-Annual", days: 180 },
                    { name: "Annual", days: 365 },
                  ].map((cycle) => (
                    <div key={cycle.name} className="flex justify-between p-2 rounded bg-secondary/50">
                      <span className="text-muted-foreground">{cycle.name}</span>
                      <span className="font-mono text-foreground">{cycle.days}d</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-glow">
              <CardHeader>
                <CardTitle className="text-lg">Fibonacci Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {fibNumbers.map((fib) => (
                    <div key={fib} className="flex justify-between p-2 rounded bg-secondary/50">
                      <span className="text-muted-foreground">Fib {fib}</span>
                      <span className="font-mono text-foreground">{fib}d</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GannTools;