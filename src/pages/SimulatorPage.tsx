import { useState, useRef } from 'react';
import { SimulatorConfig, calculateLapTime, formatLapTime, SIMULATOR_CIRCUITS } from '@/data/simulatorData';
import Leaderboard from '@/components/Leaderboard';
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Draw circuit visualization
  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    
    // Draw a simple racing line
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.bezierCurveTo(200, 50, 400, 50, 550, 200);
    ctx.bezierCurveTo(600, 300, 500, 400, 350, 350);
    ctx.bezierCurveTo(200, 300, 100, 250, 50, 200);
    ctx.stroke();
  };

  useState(() => {
    const timer = setTimeout(drawCircuit, 100);
    return () => clearTimeout(timer);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
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

        {/* Main Simulator */}
        <div className="lg:col-span-2">
          <div className="racing-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="racing-title text-2xl">Circuit Dry Run</h2>
              <div className="text-sm text-muted-foreground">
                Lap Simulator • AI Coach
              </div>
            </div>

            {/* Circuit Visualization */}
            <div className="circuit-track mb-6 h-64 flex items-center justify-center bg-primary/20 relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="max-w-full max-h-full"
              />
              {isRunning && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                  <div className="racing-card p-4 text-center">
                    <div className="animate-racing-pulse text-2xl mb-2">🏎️</div>
                    <div className="text-sm font-semibold">Running simulation...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Configuration Controls */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Tires */}
              <div>
                <label className="block text-sm font-semibold mb-2">Tyres</label>
                <select
                  value={config.tires}
                  onChange={(e) => setConfig(prev => ({ ...prev, tires: e.target.value as any }))}
                  className="racing-select w-full"
                >
                  <option value="soft">Soft</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="wet">Wet</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </div>

              {/* Aero */}
              <div>
                <label className="block text-sm font-semibold mb-2">Aero</label>
                <select
                  value={config.aero}
                  onChange={(e) => setConfig(prev => ({ ...prev, aero: e.target.value as any }))}
                  className="racing-select w-full"
                >
                  <option value="low">Low Downforce</option>
                  <option value="medium">Medium Downforce</option>
                  <option value="high">High Downforce</option>
                </select>
              </div>

              {/* Engine Mode */}
              <div>
                <label className="block text-sm font-semibold mb-2">Engine Mode</label>
                <select
                  value={config.engineMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, engineMode: e.target.value as any }))}
                  className="racing-select w-full"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                  <option value="qualifying">Qualifying</option>
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Fuel ({config.fuel}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.fuel}
                  onChange={(e) => setConfig(prev => ({ ...prev, fuel: parseInt(e.target.value) }))}
                  className="racing-slider w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={startDryRun}
                disabled={isRunning}
                className={cn(
                  "racing-button-primary px-6 py-3 flex-1",
                  isRunning && "opacity-50 cursor-not-allowed"
                )}
              >
                {isRunning ? "Running..." : "Start Dry Run"}
              </button>
              <button
                onClick={resetConfig}
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
                Share Result
              </button>
            </div>

            {/* Results */}
            {currentResult && (
              <div className="racing-card p-4 bg-secondary/50 animate-fade-in-up">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Lap Result: {formatLapTime(currentResult.lapTime)}</h4>
                  <button className="racing-button-accent px-3 py-1 text-xs">
                    Share
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Tyre wear:</span>
                    <span className="ml-2 font-semibold">{currentResult.tireWear}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fuel left:</span>
                    <span className="ml-2 font-semibold">{currentResult.fuelLeft}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reliability:</span>
                    <span className="ml-2 font-semibold">{currentResult.reliability}%</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  • {currentResult.commentary}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Coach Panel */}
        <div>
          <div className="racing-card p-5">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                FA
              </div>
              <div>
                <h3 className="font-semibold">Ai.lonso</h3>
                <div className="text-xs text-muted-foreground">AI Coach</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {alonsosComment ? (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p>{alonsosComment}</p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Configure your car setup and start a dry run to get AI coaching from Fernando.
                </div>
              )}

              <div className="border-t border-border pt-3">
                <h4 className="font-semibold mb-2">Driver Status</h4>
                <div className="space-y-1 text-xs">
                  <div>Tyre: {config.tires} • Wear: {currentResult?.tireWear || 0}%</div>
                  <div>Fuel left: {currentResult?.fuelLeft || config.fuel}%</div>
                  <div>Reliability: {currentResult?.reliability || 100}%</div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground italic">
                  Try micro-challenges: Predict fastest sector to earn points.
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="racing-button-accent px-3 py-1 text-xs">
                    Predict
                  </button>
                  <button className="racing-button-secondary px-3 py-1 text-xs">
                    Mini-Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}