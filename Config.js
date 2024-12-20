import React, { useState } from 'react';
import { Settings, Terminal, Server, Network, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NodeConfigUI = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [selectedNode, setSelectedNode] = useState(1);
  const [configValues, setConfigValues] = useState({
    port: 3000,
    peers: 5,
    maxConnections: 10,
    syncInterval: 30,
    networkMode: 'mainnet'
  });
  const [commandHistory, setCommandHistory] = useState([
    { id: 1, command: 'start node', timestamp: '10:30:45', status: 'success' },
    { id: 2, command: 'sync peers', timestamp: '10:31:00', status: 'pending' }
  ]);
  const [command, setCommand] = useState('');

  const handleConfigChange = (key, value) => {
    setConfigValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newCommand = {
      id: Date.now(),
      command: command.trim(),
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending'
    };

    setCommandHistory(prev => [newCommand, ...prev]);
    setCommand('');

    // Simulate command completion
    setTimeout(() => {
      setCommandHistory(prev => 
        prev.map(cmd => 
          cmd.id === newCommand.id 
            ? { ...cmd, status: Math.random() > 0.2 ? 'success' : 'error' }
            : cmd
        )
      );
    }, 2000);
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-4">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 inline-block mr-2" />
                Configuration
              </button>
              <button
                onClick={() => setActiveTab('command')}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'command'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Terminal className="w-4 h-4 inline-block mr-2" />
                Command Center
              </button>
            </nav>
          </div>
        </div>

        {/* Configuration Panel */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Node Configuration</CardTitle>
                <CardDescription>Configure node settings and parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Port</label>
                    <input
                      type="number"
                      value={configValues.port}
                      onChange={(e) => handleConfigChange('port', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Peers</label>
                    <input
                      type="number"
                      value={configValues.peers}
                      onChange={(e) => handleConfigChange('peers', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Network Mode</label>
                    <select
                      value={configValues.networkMode}
                      onChange={(e) => handleConfigChange('networkMode', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="mainnet">Mainnet</option>
                      <option value="testnet">Testnet</option>
                      <option value="devnet">Devnet</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
                <CardDescription>Current network configuration and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Active Connections</span>
                    <span className="text-sm font-medium">8/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Sync Status</span>
                    <span className="text-sm font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Network Mode</span>
                    <span className="text-sm font-medium">{configValues.networkMode}</span>
                  </div>
                  <div className="pt-4">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Command Center */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Command Terminal</CardTitle>
                <CardDescription>Execute node commands and view history</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommandSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="Enter command..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Execute
                    </button>
                  </div>
                </form>

                <div className="mt-6 space-y-2">
                  {commandHistory.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <Terminal className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm">{cmd.command}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">{cmd.timestamp}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cmd.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : cmd.status === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {cmd.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeConfigUI;