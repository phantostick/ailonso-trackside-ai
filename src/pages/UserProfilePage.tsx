import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, Trophy, Star, ShoppingBag, Clock, Target, Flame } from 'lucide-react';
import alonsoImage from '@/assets/alonso-placeholder.jpeg';

// Mock user data
const mockUser = {
  name: "Fernando Alonso",
  username: "@nando_official",
  memberSince: "2018",
  totalAMF1Score: 15420,
  achievements: [
    { id: 1, name: "Trivia Master", description: "Answered 100 trivia questions correctly", icon: "🧠", earned: "2024-03-15" },
    { id: 2, name: "Speed Demon", description: "Set fastest lap time in simulator", icon: "🏎️", earned: "2024-02-28" },
    { id: 3, name: "Loyal Fan", description: "5+ years membership", icon: "🏆", earned: "2023-08-12" },
    { id: 4, name: "Social Butterfly", description: "Shared 50+ AMF1 moments", icon: "🦋", earned: "2024-01-20" },
    { id: 5, name: "Merchandise Collector", description: "Purchased 10+ items", icon: "👕", earned: "2023-12-10" },
  ],
  badges: [
    { id: 1, name: "Elite Racer", color: "bg-racing-gold", level: "Platinum" },
    { id: 2, name: "Trivia Champion", color: "bg-primary", level: "Gold" },
    { id: 3, name: "Community Leader", color: "bg-racing-silver", level: "Silver" },
    { id: 4, name: "Early Adopter", color: "bg-racing-bronze", level: "Bronze" },
  ],
  purchaseHistory: [
    { id: 1, item: "AMF1 Racing Cap", date: "2024-03-10", price: 45, status: "Delivered" },
    { id: 2, item: "Limited Edition T-Shirt", date: "2024-02-15", price: 35, status: "Delivered" },
    { id: 3, item: "Racing Gloves", date: "2024-01-28", price: 65, status: "Delivered" },
    { id: 4, item: "AMF1 Hoodie", date: "2023-12-20", price: 55, status: "Delivered" },
  ],
  stats: {
    triviaAnswered: 247,
    triviaCorrect: 189,
    simulatorRaces: 45,
    bestLapTime: "1:23.456",
    totalPlayTime: "28h 42m",
    rank: 12
  },
  streak: {
    current: 15,
    longest: 28,
    lastActive: "2024-03-18"
  }
};

const getMembershipYears = () => {
  const currentYear = new Date().getFullYear();
  const memberSinceYear = parseInt(mockUser.memberSince);
  return currentYear - memberSinceYear;
};

export default function UserProfilePage() {
  const membershipYears = getMembershipYears();
  const triviaAccuracy = Math.round((mockUser.stats.triviaCorrect / mockUser.stats.triviaAnswered) * 100);

  return (
    <div className="min-h-screen p-8 flex gap-6">
      {/* Sidebar with Alonso Image */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <img 
            src={alonsoImage} 
            alt="Fernando Alonso" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 flex-1">
        
        {/* Profile Header */}
        <div className="racing-card p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl font-bold text-white">
              FA
            </div>
            <div className="flex-1">
              <h1 className="racing-title text-4xl mb-2">{mockUser.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{mockUser.username}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Member for {membershipYears} years</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span>Rank #{mockUser.stats.rank}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span>{mockUser.totalAMF1Score.toLocaleString()} AMF1 Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockUser.achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 bg-secondary/20 rounded-lg border">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <p className="text-xs text-accent">Earned: {achievement.earned}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <span>Purchase History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUser.purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <h4 className="font-medium">{purchase.item}</h4>
                        <p className="text-sm text-muted-foreground">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${purchase.price}</p>
                        <Badge variant="secondary" className="text-xs">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUser.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-secondary/20 rounded-lg">
                      <div className={`w-8 h-8 ${badge.color} rounded-full flex items-center justify-center`}>
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-accent" />
                  <span>Performance Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Trivia Accuracy</span>
                    <span className="text-sm text-accent font-semibold">{triviaAccuracy}%</span>
                  </div>
                  <Progress value={triviaAccuracy} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockUser.stats.triviaCorrect}/{mockUser.stats.triviaAnswered} correct
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Simulator Races</span>
                    <span className="text-sm font-semibold">{mockUser.stats.simulatorRaces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best Lap Time</span>
                    <span className="text-sm font-semibold text-accent">{mockUser.stats.bestLapTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Play Time</span>
                    <span className="text-sm font-semibold">{mockUser.stats.totalPlayTime}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{mockUser.memberSince}</p>
                  <p className="text-sm text-muted-foreground">{membershipYears} years of racing</p>
                </div>

                <Separator />

                {/* Streak Section */}
                <div className="text-center p-4 bg-racing-amber/10 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Flame className="w-5 h-5 text-racing-amber" />
                    <span className="text-sm font-medium">Current Streak</span>
                  </div>
                  <p className="text-3xl font-bold text-racing-amber mb-1">{mockUser.streak.current}</p>
                  <p className="text-xs text-muted-foreground mb-3">days active</p>
                  
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="font-medium">Longest</p>
                      <p className="text-muted-foreground">{mockUser.streak.longest} days</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Active</p>
                      <p className="text-muted-foreground">{mockUser.streak.lastActive}</p>
                    </div>
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