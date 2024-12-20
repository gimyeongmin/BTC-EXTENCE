import React, { useState } from 'react';
import { Terminal, Play, Save, RotateCw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NodeCommandUI = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [activePreset, setActivePreset] = useState(null);

  const commandPresets = [
    {
      id: 'start',
      name: 'Start Node',
      command: 'node start --port 3000 --network mainnet',
      description: 'Start a new node instance'
    },
    {
      id: 'stop',
      name: 'Stop Node',
      command: 'node stop --graceful',
      description: 'Gracefully stop the node'
    },
    {
      id: 'sync',
      name: 'Sync Blockchain',
      command: 'node sync --force',
      description: 'Force sync with network'
    },
    {
      id: 'peers',
      name: 'List Peers',
      command: 'node peers list --active',
      description: 'Show active peer connections'
    },
    {
      id: 'status',
      name: 'Node Status',
      command: 'node status --verbose',
      description: 'Display detailed node status'
    }
  ];

  const executeCommand = (cmd) => {
    const newCommand = {
      id: Date.now(),
      command: cmd,
      timestamp: new Date().toLocaleTimeString(),
      status: 'running',
      output: ''
    };

    setCommandHistory(prev => [newCommand, ...prev]);

    // Simulate command execution
    setTimeout(() => {
      const outputs = {
        'node start': 'Node started successfully. Listening on port 3000',
        'node stop': 'Node stopped gracefully. All connections closed.',
        'node sync': 'Blockchain sync initiated. Current progress: 98.5%',
        'node peers': 'Active peers: 8\n1. 192.168.1.101:3000\n2. 192.168.1.102:3000',
        'node status': 'Status: Running\nUptime: 2h 15m\nPeers: 8/10\nSync: 98.5%'
      };

      const baseCommand = cmd.split(' ').slice(0, 2).join(' ');
      const output = outputs[baseCommand] || 'Command executed successfully.';
      const status = Math.random() > 0.1 ? 'success' : 'error';

      setCommandHistory(prev =>
        prev.map(c =>
          c.id === newCommand.id
            ? { ...c, status, output }
            : c
        )
      );
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    executeCommand(command);
    setCommand('');
    setActivePreset(null);
  };

  const handlePresetClick = (preset) => {
    setCommand(preset.command);
    setActivePreset(preset.id);
  };

  const clearHistory = () => {
    setCommandHistory([]);
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Command Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Node Command Center</CardTitle>
            <CardDescription>Execute node commands or select from presets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command or select preset..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </button>
              </div>
            </form>

            {/* Command Presets */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Command Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commandPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`p-3 rounded-md text-left transition-colors ${
                      activePreset === preset.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white hover:bg-gray-50'
                    } border shadow-sm`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Command History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Command History</CardTitle>
              <CardDescription>Recent command executions and their results</CardDescription>
            </div>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Clear
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commandHistory.map((cmd) => (
                <div
                  key={cmd.id}
                  className="bg-gray-50 rounded-md overflow-hidden"
                >
                  <div className="p-3 flex items-center justify-between bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <code className="text-sm font-mono">{cmd.command}</code>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{cmd.timestamp}</span>
                      {cmd.status === 'running' ? (
                        <span className="flex items-center text-xs text-yellow-600">
                          <RotateCw className="w-3 h-3 mr-1 animate-spin" />
                          Running
                        </span>
                      ) : cmd.status === 'success' ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Error
                        </span>
                      )}
                    </div>
                  </div>
                  {cmd.output && (
                    <div className="p-3 bg-black text-white font-mono text-sm whitespace-pre-wrap">
                      {cmd.output}
                    </div>
                  )}
                </div>
              ))}
              {commandHistory.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No commands executed yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NodeCommandUI;import React, { useState } from 'react';
import { Terminal, Play, Save, RotateCw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NodeCommandUI = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [activePreset, setActivePreset] = useState(null);

  const commandPresets = [
    {
      id: 'start',
      name: 'Start Node',
      command: 'node start --port 3000 --network mainnet',
      description: 'Start a new node instance'
    },
    {
      id: 'stop',
      name: 'Stop Node',
      command: 'node stop --graceful',
      description: 'Gracefully stop the node'
    },
    {
      id: 'sync',
      name: 'Sync Blockchain',
      command: 'node sync --force',
      description: 'Force sync with network'
    },
    {
      id: 'peers',
      name: 'List Peers',
      command: 'node peers list --active',
      description: 'Show active peer connections'
    },
    {
      id: 'status',
      name: 'Node Status',
      command: 'node status --verbose',
      description: 'Display detailed node status'
    }
  ];

  const executeCommand = (cmd) => {
    const newCommand = {
      id: Date.now(),
      command: cmd,
      timestamp: new Date().toLocaleTimeString(),
      status: 'running',
      output: ''
    };

    setCommandHistory(prev => [newCommand, ...prev]);

    // Simulate command execution
    setTimeout(() => {
      const outputs = {
        'node start': 'Node started successfully. Listening on port 3000',
        'node stop': 'Node stopped gracefully. All connections closed.',
        'node sync': 'Blockchain sync initiated. Current progress: 98.5%',
        'node peers': 'Active peers: 8\n1. 192.168.1.101:3000\n2. 192.168.1.102:3000',
        'node status': 'Status: Running\nUptime: 2h 15m\nPeers: 8/10\nSync: 98.5%'
      };

      const baseCommand = cmd.split(' ').slice(0, 2).join(' ');
      const output = outputs[baseCommand] || 'Command executed successfully.';
      const status = Math.random() > 0.1 ? 'success' : 'error';

      setCommandHistory(prev =>
        prev.map(c =>
          c.id === newCommand.id
            ? { ...c, status, output }
            : c
        )
      );
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    executeCommand(command);
    setCommand('');
    setActivePreset(null);
  };

  const handlePresetClick = (preset) => {
    setCommand(preset.command);
    setActivePreset(preset.id);
  };

  const clearHistory = () => {
    setCommandHistory([]);
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Command Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Node Command Center</CardTitle>
            <CardDescription>Execute node commands or select from presets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command or select preset..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </button>
              </div>
            </form>

            {/* Command Presets */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Command Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commandPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`p-3 rounded-md text-left transition-colors ${
                      activePreset === preset.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white hover:bg-gray-50'
                    } border shadow-sm`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Command History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Command History</CardTitle>
              <CardDescription>Recent command executions and their results</CardDescription>
            </div>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Clear
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commandHistory.map((cmd) => (
                <div
                  key={cmd.id}
                  className="bg-gray-50 rounded-md overflow-hidden"
                >
                  <div className="p-3 flex items-center justify-between bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <code className="text-sm font-mono">{cmd.command}</code>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{cmd.timestamp}</span>
                      {cmd.status === 'running' ? (
                        <span className="flex items-center text-xs text-yellow-600">
                          <RotateCw className="w-3 h-3 mr-1 animate-spin" />
                          Running
                        </span>
                      ) : cmd.status === 'success' ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Error
                        </span>
                      )}
                    </div>
                  </div>
                  {cmd.output && (
                    <div className="p-3 bg-black text-white font-mono text-sm whitespace-pre-wrap">
                      {cmd.output}
                    </div>
                  )}
                </div>
              ))}
              {commandHistory.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No commands executed yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NodeCommandUI;