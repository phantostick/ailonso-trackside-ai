import { useState } from 'react';
import { SimulatorConfig } from '@/data/simulatorData';
import { cn } from '@/lib/utils';

interface AdvancedSimulatorPanelProps {
  config: SimulatorConfig;
  setConfig: (config: SimulatorConfig) => void;
  onStartSimulation: () => void;
  onResetConfig: () => void;
  isRunning: boolean;
  currentResult: any;
}

export default function AdvancedSimulatorPanel({ 
  config, 
  setConfig, 
  onStartSimulation, 
  onResetConfig, 
  isRunning,
  currentResult 
}: AdvancedSimulatorPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'setup' | 'telemetry' | 'strategy'>('setup');

  const tireColors = {
    soft: 'bg-red-500',
    medium: 'bg-yellow-500', 
    hard: 'bg-gray-400',
    wet: 'bg-blue-500',
    intermediate: 'bg-green-500'
  };

  const engineModeIcons = {
    conservative: '🐌',
    balanced: '⚖️',
    aggressive: '🔥',
    qualifying: '⚡'
  };

  return (
    <div className="racing-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="racing-title text-2xl">Advanced Simulator</h2>
        <div className="text-sm text-muted-foreground">
          F1 Simulator • AI Coach
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted/50 rounded-lg p-1">
        {(['setup', 'telemetry', 'strategy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize",
              selectedTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Setup Tab */}
      {selectedTab === 'setup' && (
        <div className="space-y-6">
          {/* Tire Selection with Visual */}
          <div>
            <label className="block text-sm font-semibold mb-3">Tire Compound</label>
            <div className="grid grid-cols-5 gap-2">
              {(['soft', 'medium', 'hard', 'wet', 'intermediate'] as const).map((tire) => (
                <button
                  key={tire}
                  onClick={() => setConfig({ ...config, tires: tire })}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                    config.tires === tire
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-full mb-1", tireColors[tire])}></div>
                  <span className="text-xs font-medium capitalize">{tire}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aerodynamics with Sliders */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Aerodynamics: {config.aero}
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm w-20">Low</span>
                <div className="flex-1 flex space-x-1">
                  {['low', 'medium', 'high'].map((level, index) => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, aero: level as any })}
                      className={cn(
                        "flex-1 h-3 rounded",
                        config.aero === level ? "bg-primary" : "bg-muted",
                        index < ['low', 'medium', 'high'].indexOf(config.aero) + 1 ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm w-20">High</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {config.aero === 'low' && "Better top speed, less cornering grip"}
                {config.aero === 'medium' && "Balanced downforce for most conditions"}  
                {config.aero === 'high' && "Maximum cornering grip, reduced top speed"}
              </div>
            </div>
          </div>

          {/* Engine Mode with Icons */}
          <div>
            <label className="block text-sm font-semibold mb-3">Engine Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(['conservative', 'balanced', 'aggressive', 'qualifying'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setConfig({ ...config, engineMode: mode })}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all",
                    config.engineMode === mode
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-xl">{engineModeIcons[mode]}</span>
                  <div className="text-left">
                    <div className="font-medium capitalize">{mode}</div>
                    <div className="text-xs text-muted-foreground">
                      {mode === 'conservative' && 'Save fuel & engine'}
                      {mode === 'balanced' && 'Optimal race pace'}
                      {mode === 'aggressive' && 'Maximum attack'}
                      {mode === 'qualifying' && 'One lap pace'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Load */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Fuel Load: {config.fuel}% ({Math.round(config.fuel * 1.1)}L)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={config.fuel}
              onChange={(e) => setConfig({ ...config, fuel: parseInt(e.target.value) })}
              className="racing-slider w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Sprint Distance</span>
              <span>Race Distance</span>
            </div>
          </div>

          {/* Suspension */}
          <div>
            <label className="block text-sm font-semibold mb-3">Suspension: {config.suspension || 'medium'}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['soft', 'medium', 'stiff'] as const).map((setting) => (
                <button
                  key={setting}
                  onClick={() => setConfig({ ...config, suspension: setting })}
                  className={cn(
                    "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all capitalize",
                    (config.suspension || 'medium') === setting
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  {setting}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {(config.suspension || 'medium') === 'soft' && "Better over bumps, less responsive"}
              {(config.suspension || 'medium') === 'medium' && "Balanced for most conditions"}
              {(config.suspension || 'medium') === 'stiff' && "Sharp response, needs smooth track"}
            </div>
          </div>

          {/* Brake Balance */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Brake Balance: {config.brakeBalance || 60}% Front
            </label>
            <input
              type="range"
              min="50"
              max="70"
              value={config.brakeBalance || 60}
              onChange={(e) => setConfig({ ...config, brakeBalance: parseInt(e.target.value) })}
              className="racing-slider w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Rear Bias</span>
              <span>Front Bias</span>
            </div>
          </div>

          {/* Differential */}
          <div>
            <label className="block text-sm font-semibold mb-3">Differential: {config.differential || 'medium'}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['open', 'medium', 'locked'] as const).map((setting) => (
                <button
                  key={setting}
                  onClick={() => setConfig({ ...config, differential: setting })}
                  className={cn(
                    "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all capitalize",
                    (config.differential || 'medium') === setting
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  {setting}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {(config.differential || 'medium') === 'open' && "Better rotation, less traction"}
              {(config.differential || 'medium') === 'medium' && "Balanced for most corners"}
              {(config.differential || 'medium') === 'locked' && "More traction, less agile"}
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Tab */}
      {selectedTab === 'telemetry' && (
        <div className="space-y-4">
          {currentResult ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentResult.sector1.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Sector 1</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{currentResult.sector2.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Sector 2</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-racing-blue">{currentResult.sector3.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Sector 3</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Tire Degradation</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentResult.tireWear}%` }}
                      />
                    </div>
                    <span className="text-sm">{currentResult.tireWear}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Reliability</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${currentResult.reliability}%` }}
                      />
                    </div>
                    <span className="text-sm">{currentResult.reliability}%</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Run a simulation to see telemetry data
            </div>
          )}
        </div>
      )}

      {/* Strategy Tab */}
      {selectedTab === 'strategy' && (
        <div className="space-y-4">
          <div className="racing-card p-4 bg-secondary/50">
            <h4 className="font-semibold mb-2">Recommended Strategy</h4>
            <div className="space-y-2 text-sm">
              <div>🏎️ Start: {config.tires} tires, {config.fuel}% fuel</div>
              <div>⚡ Engine: {config.engineMode} mode</div>
              <div>🔧 Aero: {config.aero} downforce</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Strategy tips will appear here based on your setup choices and circuit characteristics.</p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onStartSimulation}
          disabled={isRunning}
          className={cn(
            "racing-button-primary px-6 py-3 flex-1",
            isRunning && "opacity-50 cursor-not-allowed"
          )}
        >
          {isRunning ? "Running Simulation..." : "🏁 Start Race"}
        </button>
        <button
          onClick={onResetConfig}
          className="racing-button-secondary px-4 py-3"
        >
          Reset
        </button>
        <button
          disabled={!currentResult}
          className={cn(
            "racing-button-accent px-4 py-3",
            !currentResult && "opacity-50 cursor-not-allowed"
          )}
        >
          📤 Share
        </button>
      </div>
    </div>
  );
}