import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, Save, Download, Upload, Clock, TrendingUp, 
  Shield, Bell, Key, Database, Zap, Palette, Moon, Sun, Monitor,
  Globe, Languages, RefreshCw, Trash2, HardDrive, Cpu
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

const timeframes = [
  { label: "1M", value: "M1", name: "1 Minute", description: "Scalping" },
  { label: "5M", value: "M5", name: "5 Minutes", description: "Scalping" },
  { label: "15M", value: "M15", name: "15 Minutes", description: "Day Trading" },
  { label: "30M", value: "M30", name: "30 Minutes", description: "Day Trading" },
  { label: "1H", value: "H1", name: "1 Hour", description: "Intraday" },
  { label: "4H", value: "H4", name: "4 Hours", description: "Swing Trading" },
  { label: "1D", value: "D1", name: "1 Day", description: "Position" },
  { label: "1W", value: "W1", name: "1 Week", description: "Investment" },
  { label: "1MO", value: "MN", name: "1 Month", description: "Long Term" },
];

const defaultStrategies = [
  { name: "Gann Geometry", weight: 0.25, description: "Square of 9, Angles, Fan" },
  { name: "Astro Cycles", weight: 0.15, description: "Planetary aspects & retrogrades" },
  { name: "Ehlers DSP", weight: 0.20, description: "Digital signal processing" },
  { name: "ML Models", weight: 0.25, description: "Machine learning predictions" },
  { name: "Pattern Recognition", weight: 0.10, description: "Chart patterns & waves" },
  { name: "Options Flow", weight: 0.05, description: "Options market sentiment" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

const Settings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [activeTf, setActiveTf] = useState("H1");
  const [language, setLanguage] = useState("en");
  const [strategyWeights, setStrategyWeights] = useState<Record<string, Record<string, number>>>({});
  const [riskSettings, setRiskSettings] = useState({
    riskPerTrade: 2.0,
    maxDrawdown: 20,
    kellyFraction: 0.5,
    riskReward: 2.0,
    adaptiveSizing: true,
  });
  const [notifications, setNotifications] = useState({
    signalAlerts: true,
    priceAlerts: true,
    emailNotifications: false,
    soundAlerts: true,
    pushNotifications: false,
    telegramNotifications: false,
  });
  const [dataSettings, setDataSettings] = useState({
    cacheEnabled: true,
    autoRefresh: true,
    refreshInterval: 5,
    historicalDataDays: 365,
  });
  const [performanceSettings, setPerformanceSettings] = useState({
    animationsEnabled: true,
    reducedMotion: false,
    highPerformanceMode: false,
    chartSmoothing: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getWeight = (tf: string, strategy: string) => {
    return strategyWeights[tf]?.[strategy] ?? defaultStrategies.find(s => s.name === strategy)?.weight ?? 0.1;
  };

  const setWeight = (tf: string, strategy: string, value: number) => {
    setStrategyWeights(prev => ({
      ...prev,
      [tf]: {
        ...prev[tf],
        [strategy]: value
      }
    }));
  };

  const handleExportSettings = () => {
    const settings = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      strategyWeights,
      riskSettings,
      notifications,
      dataSettings,
      performanceSettings,
      theme,
      language,
      timeframes: timeframes.map(tf => tf.value),
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gann-quant-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Settings exported successfully!");
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        if (settings.strategyWeights) setStrategyWeights(settings.strategyWeights);
        if (settings.riskSettings) setRiskSettings(settings.riskSettings);
        if (settings.notifications) setNotifications(settings.notifications);
        if (settings.dataSettings) setDataSettings(settings.dataSettings);
        if (settings.performanceSettings) setPerformanceSettings(settings.performanceSettings);
        if (settings.theme) setTheme(settings.theme);
        if (settings.language) setLanguage(settings.language);
        toast.success("Settings imported successfully!");
      } catch {
        toast.error("Invalid settings file");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleSaveAll = () => {
    localStorage.setItem('gann-settings', JSON.stringify({
      strategyWeights,
      riskSettings,
      notifications,
      dataSettings,
      performanceSettings,
      language,
    }));
    toast.success("All settings saved successfully!");
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success("Cache cleared successfully!");
  };

  const handleResetDefaults = () => {
    setStrategyWeights({});
    setRiskSettings({
      riskPerTrade: 2.0,
      maxDrawdown: 20,
      kellyFraction: 0.5,
      riskReward: 2.0,
      adaptiveSizing: true,
    });
    setNotifications({
      signalAlerts: true,
      priceAlerts: true,
      emailNotifications: false,
      soundAlerts: true,
      pushNotifications: false,
      telegramNotifications: false,
    });
    toast.success("Settings reset to defaults!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3" />
            Settings
          </h1>
          <p className="text-muted-foreground">Configure your trading system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
          />
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveAll}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="timeframes" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeframes
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Risk
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primary" />
              Theme & Appearance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground mb-2 block">Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Performance
                </h3>
                {[
                  { key: "animationsEnabled", label: "Enable Animations", desc: "Smooth UI transitions" },
                  { key: "reducedMotion", label: "Reduced Motion", desc: "Minimize animations" },
                  { key: "highPerformanceMode", label: "High Performance", desc: "Optimize for speed" },
                  { key: "chartSmoothing", label: "Chart Smoothing", desc: "Smooth chart rendering" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded bg-secondary/50">
                    <div>
                      <Label className="text-foreground">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={performanceSettings[item.key as keyof typeof performanceSettings]}
                      onCheckedChange={(checked) => setPerformanceSettings(prev => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeframes" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Timeframe Configuration
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure analysis settings for each timeframe. Each timeframe can have different strategy weights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeframes.map((tf) => (
                <div
                  key={tf.value}
                  onClick={() => setActiveTf(tf.value)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    activeTf === tf.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-foreground">{tf.label}</span>
                    <Badge variant={activeTf === tf.value ? "default" : "outline"}>
                      {tf.value}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{tf.name}</p>
                  <p className="text-xs text-muted-foreground">{tf.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Strategy Weights for {timeframes.find(t => t.value === activeTf)?.name}
              </h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {activeTf}
              </Badge>
            </div>

            <div className="space-y-4">
              {defaultStrategies.map((strategy) => (
                <div key={strategy.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">{strategy.name}</Label>
                      <p className="text-xs text-muted-foreground">{strategy.description}</p>
                    </div>
                    <span className="text-sm font-mono text-foreground bg-secondary px-2 py-0.5 rounded">
                      {(getWeight(activeTf, strategy.name) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={getWeight(activeTf, strategy.name)}
                    onChange={(e) => setWeight(activeTf, strategy.name, parseFloat(e.target.value))}
                    className="w-full cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">Active Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Gann Square of 9",
                "Gann Angles",
                "Gann Fan",
                "Planetary Aspects",
                "Lunar Phases",
                "MAMA Indicator",
                "Fisher Transform",
                "Cyber Cycle",
                "LSTM Predictor",
                "XGBoost",
                "Pattern Recognition",
                "Options Flow",
                "Ehlers Super Smoother",
                "Dominant Cycle",
                "Sinewave Indicator",
              ].map((strategy, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded bg-secondary/50">
                  <span className="text-sm text-foreground">{strategy}</span>
                  <Switch defaultChecked={idx < 9} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-success" />
              Risk Management Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-per-trade" className="text-foreground">Risk Per Trade (%)</Label>
                  <Input
                    id="risk-per-trade"
                    type="number"
                    value={riskSettings.riskPerTrade}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, riskPerTrade: parseFloat(e.target.value) }))}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-drawdown" className="text-foreground">Max Drawdown (%)</Label>
                  <Input
                    id="max-drawdown"
                    type="number"
                    value={riskSettings.maxDrawdown}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDrawdown: parseFloat(e.target.value) }))}
                    step="1"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kelly-fraction" className="text-foreground">Kelly Fraction</Label>
                  <Input
                    id="kelly-fraction"
                    type="number"
                    value={riskSettings.kellyFraction}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, kellyFraction: parseFloat(e.target.value) }))}
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk-reward" className="text-foreground">Risk-to-Reward Ratio</Label>
                  <Input
                    id="risk-reward"
                    type="number"
                    value={riskSettings.riskReward}
                    onChange={(e) => setRiskSettings(prev => ({ ...prev, riskReward: parseFloat(e.target.value) }))}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between py-3 px-4 rounded bg-secondary/50">
              <div>
                <Label htmlFor="adaptive-sizing" className="text-foreground">Adaptive Position Sizing</Label>
                <p className="text-xs text-muted-foreground">Automatically adjust position size based on volatility</p>
              </div>
              <Switch
                id="adaptive-sizing"
                checked={riskSettings.adaptiveSizing}
                onCheckedChange={(checked) => setRiskSettings(prev => ({ ...prev, adaptiveSizing: checked }))}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-warning" />
              Notification Settings
            </h2>
            <div className="space-y-4">
              {[
                { key: "signalAlerts", label: "Signal Alerts", desc: "Get notified of new trading signals" },
                { key: "priceAlerts", label: "Price Alerts", desc: "Notifications for price levels" },
                { key: "emailNotifications", label: "Email Notifications", desc: "Receive alerts via email" },
                { key: "soundAlerts", label: "Sound Alerts", desc: "Play sound for important alerts" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                { key: "telegramNotifications", label: "Telegram Notifications", desc: "Receive alerts via Telegram bot" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded bg-secondary/50">
                  <div>
                    <Label className="text-foreground">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-accent" />
              Data & Cache Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded bg-secondary/50">
                  <div>
                    <Label className="text-foreground">Enable Cache</Label>
                    <p className="text-xs text-muted-foreground">Cache data for faster loading</p>
                  </div>
                  <Switch
                    checked={dataSettings.cacheEnabled}
                    onCheckedChange={(checked) => setDataSettings(prev => ({ ...prev, cacheEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded bg-secondary/50">
                  <div>
                    <Label className="text-foreground">Auto Refresh</Label>
                    <p className="text-xs text-muted-foreground">Automatically refresh data</p>
                  </div>
                  <Switch
                    checked={dataSettings.autoRefresh}
                    onCheckedChange={(checked) => setDataSettings(prev => ({ ...prev, autoRefresh: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Refresh Interval (seconds)</Label>
                  <Input
                    type="number"
                    value={dataSettings.refreshInterval}
                    onChange={(e) => setDataSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Historical Data (days)</Label>
                  <Input
                    type="number"
                    value={dataSettings.historicalDataDays}
                    onChange={(e) => setDataSettings(prev => ({ ...prev, historicalDataDays: parseInt(e.target.value) }))}
                    min="30"
                    max="730"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Data Management
                </h3>
                
                <div className="p-4 rounded bg-secondary/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cache Size</span>
                    <span className="font-semibold text-foreground">12.4 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span className="font-semibold text-foreground">Just now</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Points</span>
                    <span className="font-semibold text-foreground">245,890</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleClearCache}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                </div>

                <Button variant="destructive" className="w-full" onClick={handleResetDefaults}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Settings
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-accent" />
              MetaTrader 5 Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Server Address</Label>
                <Input placeholder="broker.server.com:443" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Login ID</Label>
                <Input type="number" placeholder="12345678" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Account Type</Label>
                <Select defaultValue="demo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="real">Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-warning" />
              Binance Configuration
            </h2>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  Binance Spot
                  <Switch defaultChecked />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">API Key</Label>
                    <Input type="password" placeholder="Enter API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Secret Key</Label>
                    <Input type="password" placeholder="Enter Secret Key" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center justify-between">
                  Binance Futures
                  <Switch />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">API Key</Label>
                    <Input type="password" placeholder="Enter API Key" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Secret Key</Label>
                    <Input type="password" placeholder="Enter Secret Key" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary" />
              Backend API Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">REST API URL</Label>
                <Input defaultValue="http://localhost:8000/api" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">WebSocket URL</Label>
                <Input defaultValue="ws://localhost:8000/ws" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">API Token</Label>
                <Input type="password" placeholder="Enter API Token" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Connection Timeout (ms)</Label>
                <Input type="number" defaultValue={5000} />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline">Test Connection</Button>
              <Button>Save API Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
