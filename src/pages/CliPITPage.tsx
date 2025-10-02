import { useState } from 'react';
import VideoClipPlayer from '@/components/VideoClipPlayer';

interface RaceClip {
  id: string;
  title: string;
  duration: string;
  raceEvent: string;
  aiScore: number;
  platforms: string[];
  videoUrl: string; // ✅ changed from thumbnail emoji to video file
  category: 'overtake' | 'pit-stop' | 'radio' | 'celebration' | 'crash' | 'podium';
  downloads: number;
  shares: number;
}

export default function CliPITPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editedClip, setEditedClip] = useState<RaceClip | null>(null); // ✅ edited video

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'tiktok', name: 'TikTok', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'stories', name: 'Stories', icon: '📖' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏁' },
    { id: 'overtake', name: 'Overtakes', icon: '🚗' },
    { id: 'pit-stop', name: 'Pit Stops', icon: '⚡' },
    { id: 'radio', name: 'Team Radio', icon: '📻' },
    { id: 'celebration', name: 'Celebrations', icon: '🎉' },
    { id: 'podium', name: 'Podium', icon: '🏆' },
  ];

  const aiGeneratedClips: RaceClip[] = [
    {
      id: '1',
      title: "Fernando's Legendary Silverstone Overtake",
      duration: "0:15",
      raceEvent: "British Grand Prix 2024",
      aiScore: 98,
      platforms: ['tiktok', 'instagram', 'stories'],
      videoUrl: "/videos/overtake.mp4",
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
      videoUrl: "/videos/pitstop.mp4",
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
      videoUrl: "/videos/radio.mp4",
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
      videoUrl: "/videos/celebration.mp4",
      category: 'celebration',
      downloads: 7800,
      shares: 5400
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="racing-title text-4xl mb-4">CliPIT</h1>
        <p className="racing-subtitle text-xl mb-2">AI-Generated Race Highlights</p>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          AI automatically generates race highlights that are rights-cleared, auto-captioned, and ready for TikTok, Instagram, or Stories.
        </p>
      </div>

      {/* Video Clip Player */}
      <div className="mb-6">
        <VideoClipPlayer onGenerate={(clip: RaceClip) => setEditedClip(clip)} />
      </div>

      {/* Edited Clip Section */}
      {editedClip && (
        <div className="mb-10">
          <h3 className="racing-subtitle mb-4">Your Edited Clip</h3>
          <div className="racing-card p-4">
            <video src={editedClip.videoUrl} controls className="w-full rounded-lg" />
            <div className="mt-2 text-sm text-muted-foreground">
              {editedClip.title} • {editedClip.raceEvent}
            </div>
          </div>
        </div>
      )}

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

      {/* Clips Grid - now 4 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredClips.map((clip) => (
          <div key={clip.id} className="racing-card p-0 overflow-hidden group hover:scale-105 transition-all duration-300">
            {/* Video Thumbnail */}
            <video
              src={clip.videoUrl}
              className="aspect-[9/16] w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            />
            {/* Clip Info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {clip.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">{clip.raceEvent}</p>
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span>↓ {(clip.downloads / 1000).toFixed(1)}k</span>
                <span>↗ {(clip.shares / 1000).toFixed(1)}k</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="racing-button-primary text-xs py-2">Download</button>
                <button className="racing-button-secondary text-xs py-2">Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
