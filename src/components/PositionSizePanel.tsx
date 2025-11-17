import { Card } from "@/components/ui/card";
import { Calculator, Info } from "lucide-react";

interface PositionSizePanelProps {
  accountEquity: number;
  riskPerTrade: number;
  riskAmount: number;
  dollarPerPoint: number;
  stopDistance: number;
  riskPerLot: number;
  calculatedLotSize: number;
  adjustedLotSize: number;
  leverage: number;
  entry: number;
  stopLoss: number;
}

export const PositionSizePanel = ({
  accountEquity,
  riskPerTrade,
  riskAmount,
  dollarPerPoint,
  stopDistance,
  riskPerLot,
  calculatedLotSize,
  adjustedLotSize,
  leverage,
  entry,
  stopLoss,
}: PositionSizePanelProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        Position Size Calculation (Complete)
      </h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
          <span className="text-sm text-muted-foreground">Account Equity</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            ${accountEquity.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
          <span className="text-sm text-muted-foreground">Risk per Trade</span>
          <span className="text-sm font-semibold text-primary">
            {riskPerTrade}% → ${riskAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
          <span className="text-sm text-muted-foreground">$ per Point per Lot</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            ${dollarPerPoint}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
          <span className="text-sm text-muted-foreground">Stop Distance</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            Entry {entry.toLocaleString()} → SL {stopLoss.toLocaleString()} = {stopDistance} points
          </span>
        </div>
      </div>
      
      <div className="p-4 bg-primary/10 border-2 border-primary/30 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Risk per Lot</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {stopDistance} points × ${dollarPerPoint}/point = ${riskPerLot} per lot
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Calculated Lot Size</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            Risk $ / Risk per lot = {riskAmount} / {riskPerLot} = {calculatedLotSize.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-primary/30">
          <span className="text-sm font-semibold text-foreground">Adjusted Lot Size</span>
          <span className="text-xl font-bold text-primary">{adjustedLotSize} lot</span>
        </div>
      </div>
      
      <div className="flex items-start gap-2 p-3 bg-status-info/10 border border-status-info/30 rounded">
        <Info className="w-4 h-4 text-status-info mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Leverage:</span> {leverage}x 
          (dapat disesuaikan oleh risk manager jika volatilitas tinggi untuk safety)
        </p>
      </div>
    </Card>
  );
};
