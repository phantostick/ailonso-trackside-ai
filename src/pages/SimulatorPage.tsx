import { useState } from 'react';
import { SimulatorConfig, calculateLapTime, formatLapTime, SIMULATOR_CIRCUITS } from '@/data/simulatorData';
import Leaderboard from '@/components/Leaderboard';
import MockTTS from '@/components/MockTTS';
import CircuitImage from '@/components/CircuitImage';
import AdvancedSimulatorPanel from '@/components/AdvancedSimulatorPanel';
import RaceWeekSimulator from '@/components/RaceWeekSimulator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Trophy, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulatorResult {
  id: string;
  name: string;
  score: number;
  setup: string;
  time: string;
  isUser?: boolean;
}

// Mock data for race week status
const isRaceWeek = true; // In real app, this would check current date against F1 calendar
const currentRaceWeek = {
  name: "Japanese Grand Prix",
  circuit: "Suzuka",
  status: "Practice 3 - Live",
  timeToQualifying: "2h 23m"
};

type SimulatorMode = 'selection' | 'normal' | 'raceweek';

export default function SimulatorPage() {
  const [mode, setMode] = useState<SimulatorMode>('selection');
  const [config, setConfig] = useState<SimulatorConfig>({
    tires: 'soft',
    aero: 'medium',
    engineMode: 'balanced',
    fuel: 50,
    suspension: 'medium',
    brakeBalance: 60,
    differential: 'medium'
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startDryRun = async () => {
    setIsRunning(true);
    setCurrentResult(null);
    setAlonsosComment('Starting dry run with your configuration...');
    setIsSpeaking(true);
    
    // Simulate the lap
    setTimeout(() => {
      const result = calculateLapTime(config, selectedCircuit);
      setCurrentResult(result);
      setAlonsosComment(result.commentary);
      
      // TTS will handle speaking
      setTimeout(() => setIsSpeaking(false), 3000);
      
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
      fuel: 50,
      suspension: 'medium',
      brakeBalance: 60,
      differential: 'medium'
    });
    setCurrentResult(null);
    setAlonsosComment('');
  };


  // Show selection screen
  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="racing-title text-5xl mb-4">Racecraft Simulators</h1>
            <p className="racing-subtitle text-xl">Choose Your Racing Experience</p>
          </div>

          {/* Simulator Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Race Simulator */}
            <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Race Simulator</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Advanced F1 setup tool with real-time lap time calculations, car configuration, and Fernando's AI coaching.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>✓</span>
                    <span>Multiple circuits available</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>✓</span>
                    <span>Advanced car setup options</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>✓</span>
                    <span>AI coaching & feedback</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>✓</span>
                    <span>Personal leaderboards</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setMode('normal')}
                  className="w-full mt-6"
                  size="lg"
                >
                  Enter Race Simulator
                </Button>
              </CardContent>
            </Card>

            {/* Race Week Simulator */}
            <Card className={`group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
              isRaceWeek 
                ? 'hover:border-racing-amber/50 bg-gradient-to-br from-racing-amber/5 to-transparent' 
                : 'opacity-60 cursor-not-allowed hover:border-border'
            }`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-racing-amber/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-racing-amber/30 transition-colors">
                  <Trophy className="w-8 h-8 text-racing-amber" />
                </div>
                <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                  <span>Race Week Predictor</span>
                  {isRaceWeek && (
                    <Badge variant="secondary" className="bg-racing-amber/20 text-racing-amber">
                      LIVE
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {isRaceWeek ? (
                  <>
                    <p className="text-muted-foreground">
                      Predict Fernando's best qualifying lap time and compete with other fans for AMF1 points!
                    </p>

                    <div className="bg-racing-amber/10 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-sm font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>{currentRaceWeek.name}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{currentRaceWeek.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Qualifying in {currentRaceWeek.timeToQualifying}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span>🏆</span>
                        <span>Win up to 1000 AMF1 points</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span>📊</span>
                        <span>Live leaderboards</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        <span>⏰</span>
                        <span>Real-time predictions</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setMode('raceweek')}
                      className="w-full mt-6 bg-racing-amber hover:bg-racing-amber/90"
                      size="lg"
                    >
                      Join Race Week Predictor
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Race week predictor is only available during F1 race weekends. Check back during practice, qualifying, or race sessions!
                    </p>
                    
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        Next race weekend starts in 12 days
                      </p>
                    </div>

                    <Button 
                      disabled
                      className="w-full mt-6"
                      size="lg"
                    >
                      Not Available (Off-Season)
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">🏎️ Experience F1 Like Never Before</h3>
                <p className="text-sm text-muted-foreground">
                  Whether you're honing your setup skills or competing with the community during live race weekends, 
                  our simulators bring you closer to the action. Earn AMF1 points, climb leaderboards, and get 
                  real-time coaching from Fernando Alonso's AI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show Race Week Simulator
  if (mode === 'raceweek') {
    return <RaceWeekSimulator onBack={() => setMode('selection')} />;
  }

  // Show Normal Simulator (existing code)
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header with Circuit Selection */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="racing-title text-4xl mb-2">Racecraft Simulator</h1>
          <p className="racing-subtitle">Advanced F1 Setup & Strategy Tool</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button onClick={() => setMode('selection')} variant="outline">
            ← Back to Simulators
          </Button>
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

        {/* Circuit Image */}
        <div className="lg:col-span-2">
          <div className="racing-card p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Circuit: {selectedCircuit.name}</h3>
              <div className="text-sm text-muted-foreground">
                Base Time: {formatLapTime(selectedCircuit.baseTime)}
              </div>
            </div>
            
            <div className="h-80 bg-secondary/20 rounded-lg p-4">
              <CircuitImage 
                circuitId={selectedCircuit.id}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="font-semibold text-primary">
                  {Math.round(selectedCircuit.characteristics.straight_speed_importance * 100)}%
                </div>
                <div className="text-muted-foreground">Speed Importance</div>
              </div>
              <div>
                <div className="font-semibold text-accent">
                  {Math.round(selectedCircuit.characteristics.cornering_importance * 100)}%
                </div>
                <div className="text-muted-foreground">Cornering Importance</div>
              </div>
              <div>
                <div className="font-semibold text-racing-blue">
                  {Math.round(selectedCircuit.characteristics.tire_wear_factor * 100)}%
                </div>
                <div className="text-muted-foreground">Tire Wear Factor</div>
              </div>
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
              <h3 className="font-semibold mb-2">Fernando's AI Coach</h3>
            </div>
            
            <MockTTS 
              text={alonsosComment}
              isSpeaking={isSpeaking}
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
