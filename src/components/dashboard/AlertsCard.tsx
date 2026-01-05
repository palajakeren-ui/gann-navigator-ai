import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, TrendingUp, TrendingDown, Clock, X, Settings } from "lucide-react";

interface Alert {
  id: string;
  type: "signal" | "price" | "pattern" | "risk" | "system";
  severity: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  time: string;
  symbol?: string;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "signal",
    severity: "success",
    title: "Strong Buy Signal",
    message: "BTCUSD confluence score 5/5 at H4",
    time: "2 min ago",
    symbol: "BTCUSD"
  },
  {
    id: "2",
    type: "price",
    severity: "warning",
    title: "Price Alert Triggered",
    message: "ETHUSD crossed above $3,900 resistance",
    time: "8 min ago",
    symbol: "ETHUSD"
  },
  {
    id: "3",
    type: "pattern",
    severity: "info",
    title: "Pattern Detected",
    message: "Bullish Engulfing on XAUUSD D1",
    time: "15 min ago",
    symbol: "XAUUSD"
  },
  {
    id: "4",
    type: "risk",
    severity: "warning",
    title: "Position Size Warning",
    message: "BTCUSD position approaching max limit",
    time: "23 min ago",
    symbol: "BTCUSD"
  },
  {
    id: "5",
    type: "system",
    severity: "info",
    title: "Market Opening",
    message: "US market opens in 30 minutes",
    time: "30 min ago"
  }
];

const getIcon = (type: Alert["type"]) => {
  switch (type) {
    case "signal": return <TrendingUp className="w-4 h-4" />;
    case "price": return <AlertTriangle className="w-4 h-4" />;
    case "pattern": return <TrendingDown className="w-4 h-4" />;
    case "risk": return <AlertTriangle className="w-4 h-4" />;
    case "system": return <Clock className="w-4 h-4" />;
  }
};

const getSeverityClass = (severity: Alert["severity"]) => {
  switch (severity) {
    case "success": return "bg-success/10 border-success/30 text-success";
    case "warning": return "bg-warning/10 border-warning/30 text-warning";
    case "error": return "bg-destructive/10 border-destructive/30 text-destructive";
    default: return "bg-accent/10 border-accent/30 text-accent";
  }
};

export const AlertsCard = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  return (
    <Card className="hover-glow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alerts
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="w-4 h-4" />
            </Button>
            {alerts.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityClass(alert.severity)} transition-all animate-fade-in`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{getIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm text-foreground truncate">{alert.title}</p>
                        {alert.symbol && (
                          <Badge variant="outline" className="text-[10px] h-4">{alert.symbol}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-50 hover:opacity-100"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
