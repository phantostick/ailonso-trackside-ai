import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, Clock, Flame, Users, Calendar, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock race week data
const raceWeekData = {
  currentRace: {
    name: "Japanese Grand Prix",
    circuit: "Suzuka International Racing Course",
    date: "2024-04-07",
    status: "Active",
    timeRemaining: "2d 14h 23m",
  },
  driverTarget: {
    name: "Fernando Alonso",
    team: "Aston Martin",
    currentBest: "1:30.456",
    practiceAvg: "1:31.234",
  },
  predictions: {
    total: 1247,
    yourPrediction: null as string | null,
    leaderboard: [
      { id: 1, name: "SpeedDemon_99", prediction: "1:30.123", points: 0, isLeading: true },
      { id: 2, name: "F1Master", prediction: "1:30.245", points: 0 },
      { id: 3, name: "RacingPro", prediction: "1:30.287", points: 0 },
      { id: 4, name: "AlonsoFan", prediction: "1:30.334", points: 0 },
      { id: 5, name: "You", prediction: "1:30.456", points: 0, isUser: true },
    ]
  },
  rewards: {
    winner: 1000,
    top10: 250,
    top50: 100,
    participated: 25,
  }
};

interface RaceWeekSimulatorProps {
  onBack: () => void;
}

export default function RaceWeekSimulator({ onBack }: RaceWeekSimulatorProps) {
  const [prediction, setPrediction] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitPrediction = () => {
    if (!prediction) {
      toast({
        title: "Prediction Required",
        description: "Please enter your lap time prediction",
        variant: "destructive",
      });
      return;
    }

    // Validate lap time format (basic check)
    const timePattern = /^\d:\d{2}\.\d{3}$/;
    if (!timePattern.test(prediction)) {
      toast({
        title: "Invalid Format",
        description: "Please use format like 1:30.456",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    raceWeekData.predictions.yourPrediction = prediction;
    
    toast({
      title: "Prediction Submitted! 🏎️",
      description: `Your prediction: ${prediction} has been recorded`,
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getPositionSuffix = (pos: number) => {
    if (pos === 1) return "st";
    if (pos === 2) return "nd";
    if (pos === 3) return "rd";
    return "th";
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="racing-title text-4xl mb-2">Race Week Predictor 🏁</h1>
            <p className="racing-subtitle">Predict Fernando's Best Lap Time & Win AMF1 Points</p>
          </div>
          <Button onClick={onBack} variant="outline">
            ← Back to Simulators
          </Button>
        </div>

        {/* Race Info Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span>{raceWeekData.currentRace.name}</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-racing-amber text-racing-amber-foreground">
                <Flame className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold">{raceWeekData.currentRace.circuit}</p>
                <p className="text-sm text-muted-foreground">{raceWeekData.currentRace.date}</p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold">Time Remaining</p>
                <p className="text-sm text-muted-foreground">{raceWeekData.currentRace.timeRemaining}</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold">{raceWeekData.predictions.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Predictions</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold">Up to {raceWeekData.rewards.winner} AMF1</p>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Prediction Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Driver Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-accent" />
                  <span>Target Driver: {raceWeekData.driverTarget.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Best Lap</p>
                    <p className="text-2xl font-bold text-primary">{raceWeekData.driverTarget.currentBest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Practice Average</p>
                    <p className="text-2xl font-bold text-accent">{raceWeekData.driverTarget.practiceAvg}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <Badge variant="outline" className="bg-primary/10">
                    <span className="mr-2">🏎️</span>
                    {raceWeekData.driverTarget.team}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Input */}
            <Card>
              <CardHeader>
                <CardTitle>Make Your Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Predict Fernando's Best Qualifying Lap Time
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="1:30.456"
                          value={prediction}
                          onChange={(e) => setPrediction(e.target.value)}
                          className="flex-1 px-4 py-3 border border-border rounded-lg text-lg font-mono text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <Button 
                          onClick={handleSubmitPrediction}
                          className="px-8"
                          size="lg"
                        >
                          Submit Prediction
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Format: M:SS.mmm (e.g., 1:30.456)
                      </p>
                    </div>
                    
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">💡 Prediction Tips:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Consider track conditions and weather</li>
                        <li>• Analyze Fernando's practice times</li>
                        <li>• Factor in car setup and tire strategy</li>
                        <li>• Remember: qualifying pace vs race pace</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Prediction Submitted!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your prediction: <span className="font-mono font-bold text-primary">{prediction}</span>
                    </p>
                    <Badge variant="secondary">
                      You'll earn {raceWeekData.rewards.participated} AMF1 points just for participating!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {raceWeekData.predictions.leaderboard.map((entry, index) => (
                    <div 
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.isUser ? 'bg-primary/10 border-primary/30' : 'bg-secondary/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-racing-gold text-white' :
                          index === 1 ? 'bg-racing-silver text-white' :
                          index === 2 ? 'bg-racing-bronze text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${entry.isUser ? 'text-primary font-bold' : ''}`}>
                            {entry.name}
                          </p>
                          {entry.isUser && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">You</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold">{entry.prediction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AMF1 Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🥇 Winner (Exact)</span>
                    <span className="font-bold text-racing-gold">{raceWeekData.rewards.winner} AMF1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🏆 Top 10</span>
                    <span className="font-bold">{raceWeekData.rewards.top10} AMF1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">📈 Top 50</span>
                    <span className="font-bold">{raceWeekData.rewards.top50} AMF1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🎯 Participation</span>
                    <span className="font-bold text-primary">{raceWeekData.rewards.participated} AMF1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Race Weekend Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Weekend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Practice 1</span>
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice 2</span>
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice 3</span>
                    <span className="text-muted-foreground">In Progress</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Qualifying</span>
                    <span className="text-racing-amber">2h 23m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Race</span>
                    <span className="text-muted-foreground">Tomorrow</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}