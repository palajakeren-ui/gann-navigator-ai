import { CalculationDemo } from "@/components/CalculationDemo";
import { Card } from "@/components/ui/card";
import { Calculator, Calendar, Compass } from "lucide-react";

const GannTools = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Gann Tools</h1>
        <p className="text-muted-foreground">Comprehensive Gann calculation toolkit</p>
      </div>

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

      <CalculationDemo />
    </div>
  );
};

export default GannTools;
