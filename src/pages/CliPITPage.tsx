import { useState } from 'react';

export default function CliPITPage() {
  const [isComingSoon] = useState(true);

  const sampleClips = [
    { id: 1, title: "Fernando's Masterclass Overtake at Monaco", views: "2.1M", duration: "0:45" },
    { id: 2, title: "AMF1 Team Radio Gold - 'Plan B, Plan B!'", views: "1.8M", duration: "1:22" },
    { id: 3, title: "Pit Stop Perfection - 2.1s Stop", views: "950K", duration: "0:30" },
    { id: 4, title: "Alonso vs Hamilton: Wheel-to-Wheel Epic", views: "3.2M", duration: "2:15" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        {/* Icon */}
        <div className="text-8xl mb-8 animate-racing-pulse">🎬</div>
        
        {/* Title */}
        <h1 className="racing-title text-5xl mb-6">CliPIT</h1>
        <p className="racing-subtitle text-xl mb-8">
          Viral AMF1 Team Clips & Highlights
        </p>

        {/* Description */}
        <div className="max-w-3xl mx-auto text-muted-foreground mb-12">
          <p className="text-lg">
            Alonso captures highlight moments and delivers rights-cleared, auto-captioned clips ready for TikTok, Instagram, and Stories.
          </p>
        </div>
      </div>

      {/* Sample Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sampleClips.map((clip) => (
          <div key={clip.id} className="racing-card p-6 hover:scale-105 transition-transform cursor-pointer group">
            <div className="aspect-video bg-primary/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"></div>
              <div className="text-6xl opacity-60 group-hover:opacity-80 transition-opacity">▶️</div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                {clip.duration}
              </div>
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              {clip.title}
            </h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{clip.views} views</span>
              <span>📺 AMF1 Official</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="text-center racing-card p-12">
        <div className="inline-flex items-center space-x-3 bg-secondary/50 px-6 py-3 rounded-full border border-border mb-8">
          <div className="w-3 h-3 bg-accent rounded-full animate-racing-pulse"></div>
          <span className="font-semibold">More Epic Content Coming Soon</span>
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Be the first to watch new AMF1 viral clips and highlights
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="racing-select flex-1"
            />
            <button className="racing-button-primary px-6">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
          <div className="racing-card p-4 bg-primary/5">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-semibold mb-2">Race Highlights</h3>
            <p className="text-sm text-muted-foreground">Epic overtakes and championship moments</p>
          </div>
          <div className="racing-card p-4 bg-accent/5">
            <div className="text-2xl mb-2">📻</div>
            <h3 className="font-semibold mb-2">Team Radio</h3>
            <p className="text-sm text-muted-foreground">Exclusive behind-the-scenes communications</p>
          </div>
          <div className="racing-card p-4 bg-racing-blue/5">
            <div className="text-2xl mb-2">🎬</div>
            <h3 className="font-semibold mb-2">Behind the Scenes</h3>
            <p className="text-sm text-muted-foreground">Exclusive AMF1 team content and interviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}