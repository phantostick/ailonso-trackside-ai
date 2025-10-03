import { useState } from 'react';
import VideoClipPlayer from '@/components/VideoClipPlayer';

interface RaceClip {
  id: string;
  title: string;
  duration: string;
  raceEvent: string;
  aiScore: number;
  platforms: string[];
  thumbnail: string;
  category: 'overtake' | 'pit-stop' | 'radio' | 'celebration' | 'crash' | 'podium';
  downloads: number;
  shares: number;
}

export default function CliPITPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'tiktok', name: 'TikTok', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'stories', name: 'Stories', icon: '📖' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🚦' },
    { id: 'overtake', name: 'Overtakes', icon: '🚗' },
    { id: 'pit-stop', name: 'Pit Stops', icon: '⚡' },
    { id: 'radio', name: 'Team Radio', icon: '📻' },
    { id: 'celebration', name: 'Celebrations', icon: '🎉' },
    { id: 'podium', name: 'Podium', icon: '🏁' },
  ];

  const aiGeneratedClips: RaceClip[] = [
    {
      id: '1',
      title: "Fernando's Legendary Silverstone Overtake",
      duration: "0:15",
      raceEvent: "British Grand Prix 2024",
      aiScore: 98,
      platforms: ['tiktok', 'instagram', 'stories'],
      thumbnail: "🏎️",
      category: 'overtake',
      downloads: 12500,
      shares: 8900
    },
    {
      id: '2',
      title: "2.1s Perfect Pit Stop Excellence",
      duration: "0:08",
      raceEvent: "Monaco Grand Prix 2024",
      aiScore: 96,
      platforms: ['tiktok', 'instagram'],
      thumbnail: "⚡",
      category: 'pit-stop',
      downloads: 9800,
      shares: 6700
    },
    {
      id: '3',
      title: "\"Plan B, Plan B!\" - Epic Team Radio",
      duration: "0:12",
      raceEvent: "Spanish Grand Prix 2024",
      aiScore: 94,
      platforms: ['tiktok', 'stories'],
      thumbnail: "📻",
      category: 'radio',
      downloads: 15600,
      shares: 11200
    },
    {
      id: '4',
      title: "Home Victory Celebration Dance",
      duration: "0:20",
      raceEvent: "Spanish Grand Prix 2024",
      aiScore: 92,
      platforms: ['instagram', 'stories'],
      thumbnail: "🎉",
      category: 'celebration',
      downloads: 7800,
      shares: 5400
    },
    {
      id: '5',
      title: "Podium Champagne Shower Magic",
      duration: "0:18",
      raceEvent: "Canadian Grand Prix 2024",
      aiScore: 90,
      platforms: ['tiktok', 'instagram', 'stories'],
      thumbnail: "🏁",
      category: 'podium',
      downloads: 11200,
      shares: 8300
    },
    {
      id: '6',
      title: "Wheel-to-Wheel Battle with Verstappen",
      duration: "0:25",
      raceEvent: "Austrian Grand Prix 2024",
      aiScore: 89,
      platforms: ['tiktok', 'instagram'],
      thumbnail: "🏎️",
      category: 'overtake',
      downloads: 13400,
      shares: 9600
    }
  ];

  const filteredClips = aiGeneratedClips.filter(clip => {
    const matchesPlatform = selectedPlatform === 'all' || clip.platforms.includes(selectedPlatform);
    const matchesCategory = selectedCategory === 'all' || clip.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.raceEvent.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🚦';
  };

  const getPlatformIcons = (clipPlatforms: string[]) => {
    return clipPlatforms.map(p => {
      const platform = platforms.find(pl => pl.id === p);
      return platform?.icon || '📱';
    }).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="racing-title text-4xl mb-4">CliPIT</h1>
        <p className="racing-subtitle text-xl mb-2">
          AI-Generated Race Highlights
        </p>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          AI automatically generates race highlights that are rights-cleared, auto-captioned, and ready for TikTok, Instagram, or Stories. Every fan becomes a content creator with instant access to shareable clips.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="racing-card p-4 mb-6">
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">2.4M</div>
            <div className="text-xs text-muted-foreground">Total Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">1.8M</div>
            <div className="text-xs text-muted-foreground">Social Shares</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">98%</div>
            <div className="text-xs text-muted-foreground">Rights Cleared</div>
          </div>
        </div>
      </div>

      {/* Video Clip Player with Voice Recording */}
      <div className="mb-6">
        <VideoClipPlayer />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="racing-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search highlights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="racing-select"
            />
            
            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="racing-select"
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="racing-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              {filteredClips.length} clips available
            </div>
          </div>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClips.map((clip) => (
          <div key={clip.id} className="racing-card p-0 overflow-hidden hover:scale-105 transition-all duration-300 group">
            {/* Clip Thumbnail */}
            <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center relative">
              <div className="text-6xl opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer">
                {clip.thumbnail}
              </div>
              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                AI Score: {clip.aiScore}
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {clip.duration}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 text-white p-2 rounded text-xs">
                  Auto-captioned • Rights-cleared
                </div>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-white text-2xl">▶️</div>
                </div>
              </div>
            </div>

            {/* Clip Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {clip.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {clip.raceEvent}
                  </p>
                </div>
                <div className="text-lg ml-2">
                  {getCategoryIcon(clip.category)}
                </div>
              </div>

              {/* Platform Icons */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex space-x-1">
                  {clip.platforms.map((platform) => (
                    <span key={platform} className="text-sm">
                      {platforms.find(p => p.id === platform)?.icon}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <span>↓ {(clip.downloads / 1000).toFixed(1)}k</span>
                  <span>↗ {(clip.shares / 1000).toFixed(1)}k</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="racing-button-primary text-xs py-2">
                  Download
                </button>
                <button className="racing-button-secondary text-xs py-2">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Processing Info */}
      <div className="mt-12 racing-card p-6">
        <div className="text-center mb-6">
          <h3 className="racing-subtitle mb-2">How CliPIT AI Works</h3>
          <p className="text-muted-foreground">
            Our AI analyzes every race in real-time to identify the most shareable moments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🤖</span>
            </div>
            <h4 className="font-semibold mb-2">AI Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Scans race footage for exciting moments using computer vision
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✂️</span>
            </div>
            <h4 className="font-semibold mb-2">Auto-Clip</h4>
            <p className="text-sm text-muted-foreground">
              Automatically extracts highlights with perfect timing
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-racing-amber/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📝</span>
            </div>
            <h4 className="font-semibold mb-2">Auto-Caption</h4>
            <p className="text-sm text-muted-foreground">
              Generates engaging captions optimized for each platform
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-racing-blue/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✅</span>
            </div>
            <h4 className="font-semibold mb-2">Rights-Clear</h4>
            <p className="text-sm text-muted-foreground">
              Ensures all content is licensed and ready to share
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}