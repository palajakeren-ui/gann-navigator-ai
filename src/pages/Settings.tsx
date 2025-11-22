import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-muted-foreground">Configure your trading environment</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6 glass-card space-y-6">
            <div className="space-y-2">
              <Label>Default Symbol</Label>
              <Input placeholder="BTCUSD" defaultValue="BTCUSD" />
            </div>

            <div className="space-y-2">
              <Label>Default Timeframe</Label>
              <Input placeholder="1H" defaultValue="1H" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-refresh</Label>
                <p className="text-sm text-muted-foreground">Automatically update data</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <Card className="p-6 glass-card space-y-6">
            <div className="space-y-2">
              <Label>Default Risk Per Trade (%)</Label>
              <Input type="number" placeholder="2" defaultValue="2" />
            </div>

            <div className="space-y-2">
              <Label>Max Concurrent Positions</Label>
              <Input type="number" placeholder="5" defaultValue="5" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Stop Loss</Label>
                <p className="text-sm text-muted-foreground">Automatic stop loss placement</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Take Profit</Label>
                <p className="text-sm text-muted-foreground">Automatic take profit placement</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6 glass-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Signal Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified of new trading signals</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Price Alerts</Label>
                <p className="text-sm text-muted-foreground">Notifications for price levels</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sound for important alerts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6 glass-card space-y-6">
            <div className="space-y-2">
              <Label>Binance API Key</Label>
              <Input type="password" placeholder="Enter your Binance API key" />
            </div>

            <div className="space-y-2">
              <Label>Binance Secret Key</Label>
              <Input type="password" placeholder="Enter your Binance secret key" />
            </div>

            <div className="space-y-2">
              <Label>MetaTrader 5 Login</Label>
              <Input placeholder="Enter your MT5 login" />
            </div>

            <div className="space-y-2">
              <Label>MetaTrader 5 Password</Label>
              <Input type="password" placeholder="Enter your MT5 password" />
            </div>

            <Button className="w-full gap-2">
              <Save className="w-4 h-4" />
              Save API Keys
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
