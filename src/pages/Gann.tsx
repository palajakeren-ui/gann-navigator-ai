import { GannAnalysisPanel } from "@/components/GannAnalysisPanel";
import { GannGeometryPanel } from "@/components/GannGeometryPanel";
import { TimeCyclesPanel } from "@/components/TimeCyclesPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gann = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Gann Analysis</h1>
        <p className="text-muted-foreground">W.D. Gann's time and price analysis methods</p>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Gann Levels</TabsTrigger>
          <TabsTrigger value="geometry">Geometry</TabsTrigger>
          <TabsTrigger value="cycles">Time Cycles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          <GannAnalysisPanel 
            supports={[45000, 44500, 44000]}
            resistances={[48500, 49000, 49500]}
            position={47509}
            angles={[
              { angle: "1x1", level: 47000, strength: 85, confidence: 90 },
              { angle: "1x2", level: 46500, strength: 72, confidence: 80 },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="geometry" className="space-y-4">
          <GannGeometryPanel 
            squares={[
              { name: "Square of 52", type: "support", midpoint: 44100, note: "Primary support zone" },
              { name: "Square of 144", type: "resistance", target: 48400, note: "Key resistance" },
            ]}
            square90Levels={[
              { degree: 90, price: 47500, type: "support" },
              { degree: 180, price: 48000, type: "resistance" },
            ]}
            hexagonLevels={[
              { degree: 60, price: 46800, type: "support" },
              { degree: 120, price: 47400, type: "neutral" },
            ]}
            gannFanAngles={[
              { ratio: "1x1", price: 47000, slope: 1, type: "support" },
              { ratio: "1x2", price: 46500, slope: 0.5, type: "support" },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="cycles" className="space-y-4">
          <TimeCyclesPanel 
            cycles={[
              { period: "30 days", confidence: 85, status: "active" },
              { period: "90 days", confidence: 72, status: "muted" },
            ]}
            dominantPeriod={24}
            amplitude="$2,500"
            phase={0.65}
            interpretation="Strong bullish cycle active"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gann;
