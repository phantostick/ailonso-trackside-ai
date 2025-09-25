import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  setup?: string;
  time?: string;
  isUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
  showSetup?: boolean;
}

export default function Leaderboard({ 
  entries, 
  title = "Leaderboard", 
  className,
  showSetup = false 
}: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  const getPositionBadgeColor = (position: number) => {
    switch (position) {
      case 1: return "bg-accent text-accent-foreground"; // Gold
      case 2: return "bg-muted text-foreground"; // Silver
      case 3: return "bg-racing-amber/20 text-racing-amber"; // Bronze
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className={cn("racing-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="racing-subtitle">{title}</h3>
        {entries.find(e => e.isUser) && (
          <div className="text-xs text-muted-foreground">
            Your Rank: <span className="font-bold text-accent">
              P{sortedEntries.findIndex(e => e.isUser) + 1}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedEntries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "leaderboard-item",
              entry.isUser && "ring-2 ring-primary/30 bg-primary/10"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn("position-badge", getPositionBadgeColor(index + 1))}>
                P{index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-sm font-medium truncate",
                    entry.isUser && "text-primary font-semibold"
                  )}>
                    {entry.name}
                  </span>
                  {entry.isUser && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
                
                {showSetup && entry.setup && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {entry.setup}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold">
                {typeof entry.score === 'number' ? `${entry.score}` : entry.score}
                {title.includes('Lap') ? 's' : ' AMF1'}
              </div>
              {entry.time && (
                <div className="text-xs text-muted-foreground">
                  {entry.time}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedEntries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">🏁</div>
          <p>No entries yet. Be the first to compete!</p>
        </div>
      )}
    </div>
  );
}