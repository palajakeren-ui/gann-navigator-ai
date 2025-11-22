import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const aiModels = [
  { name: "LSTM Neural Network", accuracy: 87.5, status: "Active", prediction: "Bullish", confidence: 85 },
  { name: "Random Forest", accuracy: 82.3, status: "Active", prediction: "Bullish", confidence: 78 },
  { name: "XGBoost", accuracy: 89.1, status: "Training", prediction: "Neutral", confidence: 65 },
  { name: "Transformer", accuracy: 91.2, status: "Active", prediction: "Bullish", confidence: 92 },
];

const AI = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Models</h1>
          <p className="text-muted-foreground">Machine learning price prediction and pattern recognition</p>
        </div>
        <Button className="gap-2">
          <Zap className="w-4 h-4" />
          Train Models
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiModels.map((model, idx) => (
          <Card key={model.name} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">Accuracy: {model.accuracy}%</p>
                </div>
              </div>
              <Badge variant={model.status === "Active" ? "default" : "secondary"}>
                {model.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Prediction</span>
                <Badge variant={model.prediction === "Bullish" ? "default" : "secondary"}>
                  {model.prediction}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-bold text-foreground">{model.confidence}%</span>
                </div>
                <Progress value={model.confidence} className="h-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Ensemble Prediction</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground mb-1">Target Price (24h)</p>
            <p className="text-3xl font-bold gradient-text">$48,750</p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="text-sm text-muted-foreground mb-1">Probability Up</p>
            <p className="text-3xl font-bold text-green-500">82%</p>
          </div>
          
          <div className="text-center">
            <Brain className="w-12 h-12 mx-auto mb-3 text-purple-500" />
            <p className="text-sm text-muted-foreground mb-1">Model Consensus</p>
            <p className="text-3xl font-bold text-purple-500">Strong Buy</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AI;
