import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp } from "lucide-react";

interface MLPredictionsCardProps {
  predictions: Array<{
    name: string;
    signal: string;
    value: string;
    confidence: number;
    weight: number;
  }>;
  compositeScore: number;
  consensusPrice: number;
}

export const MLPredictionsCard = ({ predictions, compositeScore, consensusPrice }: MLPredictionsCardProps) => {
  return (
    <Card className="hover-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            ML Predictions
          </CardTitle>
          <Badge 
            variant="outline" 
            className={compositeScore >= 0.5 ? 'text-success border-success' : 'text-destructive border-destructive'}
          >
            {(compositeScore * 100).toFixed(0)}% Bullish
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Consensus Price */}
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">24h Consensus Forecast</p>
          <p className="text-3xl font-bold text-foreground">${consensusPrice.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-success">Bullish Bias</span>
          </div>
        </div>

        {/* Model Contributions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Model Weights & Predictions</p>
          {predictions.slice(0, 5).map((model, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-secondary/30"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{model.name}</p>
                  <Badge variant="secondary" className="text-xs">{model.weight}%</Badge>
                </div>
                <Progress value={model.weight * 2} className="h-1" />
              </div>
              <div className="text-right ml-3">
                <p className="text-sm font-mono text-foreground">{model.value}</p>
                <p className="text-xs text-muted-foreground">{(model.confidence * 100).toFixed(0)}% conf</p>
              </div>
            </div>
          ))}
        </div>

        {predictions.length > 5 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              +{predictions.length - 5} more models in ensemble
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
