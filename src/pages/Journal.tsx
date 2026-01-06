import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, TrendingUp, TrendingDown, Download } from "lucide-react";
import { toast } from "sonner";

const mockEntries = [
  { id: "1", date: "2024-12-12", symbol: "BTCUSD", direction: "long", pnl: 187.50, status: "win", strategy: "Gann Square of 9" },
  { id: "2", date: "2024-12-11", symbol: "ETHUSD", direction: "short", pnl: -45.00, status: "loss", strategy: "Ehlers MAMA/FAMA" },
  { id: "3", date: "2024-12-10", symbol: "XAUUSD", direction: "long", pnl: 320.00, status: "win", strategy: "Gann Fan Angles" },
];

const Journal = () => {
  const [entries] = useState(mockEntries);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Trading Journal
          </h1>
          <p className="text-muted-foreground">Document and analyze your trades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Exporting journal...")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => toast.info("Add new entry form")}>
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total Entries</p>
          <p className="text-xl font-bold text-foreground">{entries.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Wins</p>
          <p className="text-xl font-bold text-success">{entries.filter(e => e.status === "win").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Losses</p>
          <p className="text-xl font-bold text-destructive">{entries.filter(e => e.status === "loss").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className="text-xl font-bold text-success">+${entries.reduce((a, b) => a + b.pnl, 0).toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-4">
                {entry.direction === "long" ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <p className="font-medium text-foreground">{entry.symbol}</p>
                  <p className="text-xs text-muted-foreground">{entry.date} • {entry.strategy}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold ${entry.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
                </span>
                <Badge variant={entry.status === "win" ? "default" : "destructive"}>
                  {entry.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Journal;
