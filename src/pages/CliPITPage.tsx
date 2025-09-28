import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ClipRequest {
  momentDescription: string;
  platform: 'tiktok' | 'instagram' | 'stories';
  duration: number;
  captionStyle: 'dynamic' | 'minimal' | 'expressive';
}

export default function CliPITPage() {
  const [clipRequest, setClipRequest] = useState<ClipRequest>({
    momentDescription: '',
    platform: 'tiktok',
    duration: 15,
    captionStyle: 'dynamic'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedClip, setGeneratedClip] = useState<any>(null);

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱', maxDuration: 60, aspectRatio: '9:16' },
    { id: 'instagram', name: 'Instagram Reel', icon: '📸', maxDuration: 90, aspectRatio: '9:16' },
    { id: 'stories', name: 'Stories', icon: '📖', maxDuration: 15, aspectRatio: '9:16' },
  ];

  const captionStyles = [
    { id: 'dynamic', name: 'Dynamic', description: 'Animated text with racing effects' },
    { id: 'minimal', name: 'Minimal', description: 'Clean, simple captions' },
    { id: 'expressive', name: 'Expressive', description: 'Emotional, fan-focused text' },
  ];

  const recentHighlights = [
    { id: 1, title: "Last lap overtake at Silverstone", timestamp: "2 hours ago", available: true },
    { id: 2, title: "Perfect pit stop execution", timestamp: "1 day ago", available: true },
    { id: 3, title: "Wheel-to-wheel battle with Verstappen", timestamp: "3 days ago", available: true },
    { id: 4, title: "Victory celebration at home GP", timestamp: "1 week ago", available: false },
  ];

  const generateClip = async () => {
    setIsProcessing(true);
    
    // Simulate clip generation
    setTimeout(() => {
      setGeneratedClip({
        id: Date.now(),
        title: clipRequest.momentDescription,
        platform: clipRequest.platform,
        duration: clipRequest.duration,
        captions: `Auto-generated captions for ${clipRequest.momentDescription}`,
        downloadUrl: '#',
        shareUrl: '#'
      });
      setIsProcessing(false);
    }, 3000);
  };

  const selectedPlatform = platforms.find(p => p.id === clipRequest.platform);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="racing-title text-4xl mb-4">CliPIT</h1>
        <p className="racing-subtitle text-xl mb-2">
          AI-Powered Clip Creator
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Alonso captures highlight moments and delivers rights-cleared, auto-captioned clips ready for TikTok, Instagram, and Stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clip Request Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="racing-card p-6">
            <h3 className="racing-subtitle mb-6">Create Your Clip</h3>
            
            {/* Moment Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Describe the Moment
                </label>
                <textarea
                  value={clipRequest.momentDescription}
                  onChange={(e) => setClipRequest(prev => ({ ...prev, momentDescription: e.target.value }))}
                  placeholder="e.g., 'Fernando overtaking Hamilton on the outside at turn 3 during lap 45'"
                  className="racing-select w-full min-h-[100px] resize-none"
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {clipRequest.momentDescription.length}/200 characters
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Target Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setClipRequest(prev => ({ 
                        ...prev, 
                        platform: platform.id as any,
                        duration: Math.min(prev.duration, platform.maxDuration)
                      }))}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200",
                        "hover:border-primary/50",
                        clipRequest.platform === platform.id 
                          ? "border-primary bg-primary/10" 
                          : "border-border"
                      )}
                    >
                      <div className="text-2xl">{platform.icon}</div>
                      <div className="text-left">
                        <div className="font-semibold">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {platform.aspectRatio} • Max {platform.maxDuration}s
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Caption Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Duration (seconds)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max={selectedPlatform?.maxDuration || 60}
                    value={clipRequest.duration}
                    onChange={(e) => setClipRequest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5s</span>
                    <span className="font-semibold">{clipRequest.duration}s</span>
                    <span>{selectedPlatform?.maxDuration}s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Caption Style
                  </label>
                  <select
                    value={clipRequest.captionStyle}
                    onChange={(e) => setClipRequest(prev => ({ ...prev, captionStyle: e.target.value as any }))}
                    className="racing-select w-full"
                  >
                    {captionStyles.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.name} - {style.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateClip}
                disabled={!clipRequest.momentDescription.trim() || isProcessing}
                className={cn(
                  "racing-button-primary w-full py-3 text-lg",
                  (!clipRequest.momentDescription.trim() || isProcessing) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Clip...</span>
                  </div>
                ) : (
                  "Generate Clip"
                )}
              </button>
            </div>
          </div>

          {/* Generated Clip Preview */}
          {generatedClip && (
            <div className="racing-card p-6">
              <h3 className="racing-subtitle mb-4">Your Clip is Ready!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-[9/16] bg-primary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"></div>
                  <div className="text-4xl">▶️</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 text-white p-2 rounded text-xs">
                      {generatedClip.captions}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    {generatedClip.duration}s
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <strong>Title:</strong> {generatedClip.title}
                  </div>
                  <div>
                    <strong>Platform:</strong> {platforms.find(p => p.id === generatedClip.platform)?.name}
                  </div>
                  <div>
                    <strong>Duration:</strong> {generatedClip.duration} seconds
                  </div>
                  <div className="space-y-2">
                    <button className="racing-button-primary w-full">
                      Download Clip
                    </button>
                    <button className="racing-button-secondary w-full">
                      Share to {platforms.find(p => p.id === generatedClip.platform)?.name}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ✅ Rights-cleared and optimized for social media
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Highlights Sidebar */}
        <div className="space-y-6">
          <div className="racing-card p-6">
            <h3 className="racing-subtitle mb-4">Recent Highlights</h3>
            <div className="space-y-3">
              {recentHighlights.map((highlight) => (
                <div 
                  key={highlight.id} 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                    highlight.available 
                      ? "border-border hover:border-primary/50 hover:bg-secondary/30" 
                      : "border-border/50 opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (highlight.available) {
                      setClipRequest(prev => ({ ...prev, momentDescription: highlight.title }));
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{highlight.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{highlight.timestamp}</div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full ml-2 mt-1",
                      highlight.available ? "bg-green-500" : "bg-gray-400"
                    )}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="racing-card p-6">
            <h3 className="racing-subtitle mb-4">Features</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Auto-generated captions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Rights-cleared content</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Platform optimization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}