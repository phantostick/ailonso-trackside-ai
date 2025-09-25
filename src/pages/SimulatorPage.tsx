import { useState } from 'react';
import { SimulatorConfig, calculateLapTime, formatLapTime, SIMULATOR_CIRCUITS } from '@/data/simulatorData';
import Leaderboard from '@/components/Leaderboard';
import AvatarTTS from '@/components/AvatarTTS';
import CircuitVisualization from '@/components/CircuitVisualization';
import AdvancedSimulatorPanel from '@/components/AdvancedSimulatorPanel';
import { cn } from '@/lib/utils';

interface SimulatorResult {
  id: string;
  name: string;
  score: number;
  setup: string;
  time: string;
  isUser?: boolean;
}

export default function SimulatorPage() {
  const [config, setConfig] = useState<SimulatorConfig>({
    tires: 'soft',
    aero: 'medium',
    engineMode: 'balanced',
    fuel: 50
  });

  const [results, setResults] = useState<SimulatorResult[]>([
    { id: '1', name: 'You', score: 88.946, setup: 'soft • low • aggressive', time: '3:26:35 PM', isUser: true },
    { id: '2', name: 'You', score: 90.762, setup: 'hard • low • aggressive', time: '3:26:28 PM', isUser: true },
    { id: '3', name: 'You', score: 90.493, setup: 'soft • balanced • balanced', time: '3:26:11 PM', isUser: true },
  ]);

  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [alonsosComment, setAlonsosComment] = useState<string>('');
  const [selectedCircuit, setSelectedCircuit] = useState(SIMULATOR_CIRCUITS[0]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startDryRun = async () => {
    setIsRunning(true);
    setCurrentResult(null);
    setAlonsosComment('Starting dry run with your configuration...');
    
    // Simulate the lap
    setTimeout(() => {
      const result = calculateLapTime(config, selectedCircuit);
      setCurrentResult(result);
      setAlonsosComment(result.commentary);
      speakText(result.commentary);
      
      // Add to leaderboard
      const newEntry: SimulatorResult = {
        id: Date.now().toString(),
        name: 'You',
        score: result.lapTime,
        setup: `${config.tires} • ${config.aero} • ${config.engineMode}`,
        time: new Date().toLocaleTimeString(),
        isUser: true
      };
      
      setResults(prev => [newEntry, ...prev].slice(0, 10));
      setIsRunning(false);
    }, 2000);
  };

  const resetConfig = () => {
    setConfig({
      tires: 'soft',
      aero: 'medium',
      engineMode: 'balanced',
      fuel: 50
    });
    setCurrentResult(null);
    setAlonsosComment('');
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with Circuit Selection */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="racing-title text-4xl mb-2">Racing Simulator</h1>
          <p className="racing-subtitle">Advanced F1 Setup & Strategy Tool</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Circuit</label>
            <select
              value={selectedCircuit.id}
              onChange={(e) => setSelectedCircuit(SIMULATOR_CIRCUITS.find(c => c.id === e.target.value) || SIMULATOR_CIRCUITS[0])}
              className="racing-select"
            >
              {SIMULATOR_CIRCUITS.map(circuit => (
                <option key={circuit.id} value={circuit.id}>{circuit.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaderboard */}
        <div className="lg:row-span-2">
          <Leaderboard 
            entries={results} 
            title="Best Lap Times"
            showSetup={true}
            className="h-full"
          />
        </div>

        {/* Circuit Visualization */}
        <div className="lg:col-span-2">
          <div className="racing-card p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Circuit: {selectedCircuit.name}</h3>
              <div className="text-sm text-muted-foreground">
                Base Time: {formatLapTime(selectedCircuit.baseTime)}
              </div>
            </div>
            
            <div className="h-80">
              <CircuitVisualization 
                circuitId={selectedCircuit.id}
                isRunning={isRunning}
              />
            </div>
          </div>

          {/* Advanced Simulator Panel */}
          <AdvancedSimulatorPanel
            config={config}
            setConfig={setConfig}
            onStartSimulation={startDryRun}
            onResetConfig={resetConfig}
            isRunning={isRunning}
            currentResult={currentResult}
          />

          {/* Results Display */}
          {currentResult && (
            <div className="racing-card p-6 mt-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h4 className="racing-title text-xl">
                  🏁 Lap Time: {formatLapTime(currentResult.lapTime)}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {selectedCircuit.name}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {currentResult.sector1.toFixed(3)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Sector 1</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {currentResult.sector2.toFixed(3)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Sector 2</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-racing-blue mb-1">
                    {currentResult.sector3.toFixed(3)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Sector 3</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tire Wear:</span>
                  <span className="font-semibold">{currentResult.tireWear}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fuel Left:</span>
                  <span className="font-semibold">{currentResult.fuelLeft}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reliability:</span>
                  <span className="font-semibold">{currentResult.reliability}%</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-sm font-medium">🗣️ Fernando: "{currentResult.commentary}"</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Coach Avatar */}
        <div className="space-y-6">
          <div className="racing-card p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2">AI Coach</h3>
            </div>
            
            <AvatarTTS 
              className="mb-4"
            />

            <div className="space-y-3 text-sm">
              <div className="border-t border-border pt-3">
                <h4 className="font-semibold mb-2">Current Setup</h4>
                <div className="space-y-1 text-xs">
                  <div>Circuit: {selectedCircuit.name}</div>
                  <div>Tires: {config.tires}</div>
                  <div>Aero: {config.aero}</div>
                  <div>Engine: {config.engineMode}</div>
                  <div>Fuel: {config.fuel}%</div>
                </div>
              </div>

              {currentResult && (
                <div className="border-t border-border pt-3">
                  <h4 className="font-semibold mb-2">Performance</h4>
                  <div className="space-y-1 text-xs">
                    <div>Lap Time: {formatLapTime(currentResult.lapTime)}</div>
                    <div>Tire Wear: {currentResult.tireWear}%</div>
                    <div>Reliability: {currentResult.reliability}%</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="racing-card p-4">
            <h4 className="font-semibold mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="racing-button-accent w-full py-2 text-sm">
                🎯 Predict Best Sector
              </button>
              <button className="racing-button-secondary w-full py-2 text-sm">
                🧠 Strategy Quiz  
              </button>
              <button className="racing-button-secondary w-full py-2 text-sm">
                📊 Compare Times
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}