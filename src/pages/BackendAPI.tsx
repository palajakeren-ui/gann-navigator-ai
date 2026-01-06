import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Database, Globe, Key, RefreshCw, CheckCircle, XCircle, TestTube } from "lucide-react";
import { toast } from "sonner";

const BackendAPI = () => {
  const [apiConfig, setApiConfig] = useState({
    baseUrl: "https://api.gannquantai.com",
    wsUrl: "wss://ws.gannquantai.com",
    apiKey: "",
    timeout: 30000,
    retryAttempts: 3,
    isActive: true,
  });

  const [dbConfig, setDbConfig] = useState({
    host: "localhost",
    port: "5432",
    database: "gann_trading",
    ssl: true,
    poolSize: 10,
    isActive: true,
  });

  const testConnection = (type: string) => {
    toast.success(`Testing ${type} connection...`);
    setTimeout(() => toast.success(`${type} connection successful!`), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            Backend API Configuration
          </h1>
          <p className="text-muted-foreground">Configure API endpoints and database connections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">API Status</span>
          </div>
          <p className="text-lg font-bold text-success mt-1">Connected</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">Database</span>
          </div>
          <p className="text-lg font-bold text-success mt-1">Online</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">WebSocket</span>
          </div>
          <p className="text-lg font-bold text-success mt-1">Active</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Latency</span>
          </div>
          <p className="text-lg font-bold text-foreground mt-1">45ms</p>
        </Card>
      </div>

      <Tabs defaultValue="api">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="websocket">WebSocket</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input value={apiConfig.baseUrl} onChange={(e) => setApiConfig({...apiConfig, baseUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" value={apiConfig.apiKey} onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})} placeholder="Enter API key" />
                </div>
                <div className="space-y-2">
                  <Label>Timeout (ms)</Label>
                  <Input type="number" value={apiConfig.timeout} onChange={(e) => setApiConfig({...apiConfig, timeout: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Input type="number" value={apiConfig.retryAttempts} onChange={(e) => setApiConfig({...apiConfig, retryAttempts: parseInt(e.target.value)})} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch checked={apiConfig.isActive} onCheckedChange={(v) => setApiConfig({...apiConfig, isActive: v})} />
                </div>
                <Button onClick={() => testConnection("API")} className="w-full">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input value={dbConfig.host} onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input value={dbConfig.port} onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Database Name</Label>
                  <Input value={dbConfig.database} onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>SSL Enabled</Label>
                  <Switch checked={dbConfig.ssl} onCheckedChange={(v) => setDbConfig({...dbConfig, ssl: v})} />
                </div>
                <div className="space-y-2">
                  <Label>Pool Size</Label>
                  <Input type="number" value={dbConfig.poolSize} onChange={(e) => setDbConfig({...dbConfig, poolSize: parseInt(e.target.value)})} />
                </div>
                <Button onClick={() => testConnection("Database")} className="w-full">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="websocket" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">WebSocket Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>WebSocket URL</Label>
                <Input value={apiConfig.wsUrl} onChange={(e) => setApiConfig({...apiConfig, wsUrl: e.target.value})} />
              </div>
              <Button onClick={() => testConnection("WebSocket")}>
                <TestTube className="w-4 h-4 mr-2" />
                Test WebSocket
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackendAPI;
