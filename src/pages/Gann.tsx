import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Moon, Clock, Brain, Activity } from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import LiveSignalCard from "@/components/dashboard/LiveSignalCard";
import GannLevelsPanel from "@/components/dashboard/GannLevelsPanel";

const Gann = () => {
  const {
    marketData,
    gannLevels,
    nearestSupport,
    nearestResistance,
    timeCycles,
    astroData,
    ehlersData,
    mlPredictions,
    tradingSignal,
  } = useLiveData({ symbol: 'BTCUSDT', basePrice: 104525 });

  const currentPrice = marketData.price;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">GANN AI Trading Analysis</h1>
        <p className="text-sm text-muted-foreground">Institutional Output • {new Date().toISOString().split('T')[0]} UTC</p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Symbol</p>
              <p className="text-lg font-bold text-foreground">BTCUSD</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Price</p>
              <p className="text-lg font-bold text-foreground">${currentPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk/Trade</p>
              <p className="text-lg font-bold text-foreground">2%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leverage</p>
              <p className="text-lg font-bold text-primary">5x</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lot Size</p>
              <p className="text-lg font-bold text-foreground">0.19</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Broker</p>
              <p className="text-sm font-semibold text-foreground">Binance/MT5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Signal Card */}
      <LiveSignalCard signal={tradingSignal} />

      <Tabs defaultValue="gann" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="gann">Gann Analysis</TabsTrigger>
          <TabsTrigger value="astro">Planetary</TabsTrigger>
          <TabsTrigger value="ehlers">Ehlers DSP</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          <TabsTrigger value="ml">ML Engine</TabsTrigger>
        </TabsList>

        <TabsContent value="gann" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gann Levels Panel */}
            <GannLevelsPanel 
              levels={gannLevels}
              currentPrice={currentPrice}
              nearestSupport={nearestSupport}
              nearestResistance={nearestResistance}
            />

            <Card>
              <CardHeader>
                <CardTitle>Gann Fan Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Angle</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Strength</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { angle: "1x3", level: currentPrice * 0.97, strength: 0.87, confidence: 87 },
                      { angle: "1x2", level: currentPrice * 0.98, strength: 0.91, confidence: 91 },
                      { angle: "1x1", level: currentPrice * 0.99, strength: 0.93, confidence: 93 },
                      { angle: "2x1", level: currentPrice * 1.01, strength: 0.89, confidence: 89 },
                      { angle: "3x1", level: currentPrice * 1.02, strength: 0.85, confidence: 85 },
                    ].map((item) => (
                      <TableRow key={item.angle}>
                        <TableCell className="font-mono font-bold">{item.angle}</TableCell>
                        <TableCell className="font-mono">{item.level.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                        <TableCell>
                          <Progress value={item.strength * 100} className="w-20" />
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.confidence > 90 ? "default" : "secondary"}>
                            {item.confidence}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "Square of 52", value: nearestResistance?.price.toFixed(0) || "N/A", label: "Weekly Cycle", status: "Equilibrium" },
              { name: "Square of 144", value: (currentPrice * 1.005).toFixed(0), label: "Daily Spiral", status: "Resistance" },
              { name: "Square of 360", value: (currentPrice * 1.01).toFixed(0), label: "Year Vibration", status: "Completion" },
              { name: "Square of 90", value: nearestSupport?.price.toFixed(0) || "N/A", label: "Quarter Grid", status: "180° Harmonic" },
            ].map((square) => (
              <Card key={square.name}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{square.name}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{square.value}</p>
                  <p className="text-xs text-muted-foreground">{square.label}</p>
                  <Badge variant="outline" className="mt-2 text-xs">{square.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="astro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                Planetary Influences & Gann Astrology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Planetary Score</span>
                  <Badge variant="outline" className={astroData.sentiment.direction === 'bullish' ? "text-success border-success" : "text-destructive border-destructive"}>
                    {astroData.sentiment.direction === 'bullish' ? '+' : '-'}{(astroData.sentiment.strength * 100).toFixed(0)}% {astroData.sentiment.direction}
                  </Badge>
                </div>
                <Progress value={50 + astroData.sentiment.strength * 50} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-success/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Bullish Aspects</p>
                    {astroData.aspects.filter(a => a.influence > 0).slice(0, 2).map((aspect, idx) => (
                      <p key={idx} className="text-sm font-semibold text-success">
                        {aspect.planet1}–{aspect.planet2}: +{(aspect.influence * 100).toFixed(0)}%
                      </p>
                    ))}
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Bearish Aspects</p>
                    {astroData.aspects.filter(a => a.influence < 0).slice(0, 2).map((aspect, idx) => (
                      <p key={idx} className="text-sm font-semibold text-destructive">
                        {aspect.planet1}–{aspect.planet2}: {(aspect.influence * 100).toFixed(0)}%
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ehlers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                John F. Ehlers' Digital Filters
              </CardTitle>
              <Badge variant="outline" className={ehlersData.score > 60 ? "w-fit text-success border-success" : "w-fit text-warning border-warning"}>
                Composite Score: {ehlersData.score.toFixed(0)}% ({ehlersData.direction})
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ehlersData.indicators.map((ind) => (
                    <TableRow key={ind.name}>
                      <TableCell className="font-semibold">{ind.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={ind.signal === 'bullish' ? "text-success border-success" : ind.signal === 'bearish' ? "text-destructive border-destructive" : ""}>
                          {ind.signal}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{ind.value.toFixed(4)}</TableCell>
                      <TableCell>
                        <Badge variant={ind.confidence > 80 ? "default" : "secondary"}>
                          {ind.confidence.toFixed(0)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Time Cycles & Vibration Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Dominant Period</p>
                  <p className="text-3xl font-bold text-foreground">{ehlersData.dominantCycle}</p>
                  <p className="text-xs text-muted-foreground">bars</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Next Turn Date</p>
                  <p className="text-lg font-bold text-primary">{timeCycles.nextTurnDate?.toLocaleDateString() || 'N/A'}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Cycle Confidence</p>
                  <p className="text-3xl font-bold text-foreground">{timeCycles.confidence?.toFixed(0) || 85}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                ML Ensemble Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Consensus</p>
                  <Badge className={mlPredictions.consensusPrediction === 'bullish' ? "bg-success" : mlPredictions.consensusPrediction === 'bearish' ? "bg-destructive" : ""}>
                    {mlPredictions.consensusPrediction.toUpperCase()}
                  </Badge>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-foreground">{mlPredictions.consensusConfidence.toFixed(0)}%</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Target Price</p>
                  <p className="text-xl font-bold text-primary">${mlPredictions.weightedTargetPrice.toFixed(0)}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-success">{(mlPredictions.accuracy * 100).toFixed(1)}%</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mlPredictions.models.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-semibold">{model.model}</TableCell>
                      <TableCell>
                        <Badge variant={model.prediction === 'bullish' ? "default" : model.prediction === 'bearish' ? "destructive" : "secondary"} className={model.prediction === 'bullish' ? "bg-success" : ""}>
                          {model.prediction}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">${model.targetPrice.toFixed(0)}</TableCell>
                      <TableCell>
                        <Progress value={model.confidence} className="w-16" />
                      </TableCell>
                      <TableCell>{(model.probability * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gann;
