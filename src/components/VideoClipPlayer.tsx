import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface VideoClipPlayerProps {
  className?: string;
}

export default function VideoClipPlayer({ className }: VideoClipPlayerProps) {
  const [showEditedClips, setShowEditedClips] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Customization states
  const [customText, setCustomText] = useState('');
  const [customHashtag, setCustomHashtag] = useState('#AMF1');
  const [selectedMusic, setSelectedMusic] = useState('energetic');
  const [selectedFilter, setSelectedFilter] = useState('racing');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      toast.success('Recording saved');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      setShowEditedClips(true);
      toast.success('Showing edited clips!');
    }
  };

  const handleShare = (platform: string, videoName: string) => {
    toast.success(`Sharing ${videoName} to ${platform}`);
    // In production, this would integrate with actual sharing APIs
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className || "racing-card p-6"}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="racing-subtitle mb-2">AI-Generated Race Clips</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Request specific highlights or view pre-generated clips
        </p>
      </div>

      {/* Voice Recording Section */}
      <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? "racing-button-secondary" : "racing-button-primary"}
            >
              {isRecording ? `⏹️ Stop (${formatTime(recordingTime)})` : '🎤 Voice Request'}
            </Button>
          </div>
          
          {audioURL && (
            <div className="w-full space-y-2">
              <p className="text-xs text-center text-muted-foreground">Your voice request:</p>
              <audio 
                src={audioURL} 
                controls 
                className="w-full max-w-md mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Text Input Section */}
      <form onSubmit={handleTextSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your highlight request..."
            className="racing-input"
          />
          <Button 
            type="submit" 
            disabled={!userInput.trim()}
            className="racing-button-primary"
          >
            Send
          </Button>
        </div>
      </form>

      {/* Original Clips Section */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4">📹 Available Clips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden bg-card/50 border-primary/20">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
              <img 
                src="/images/amf1-thumb1.jpg" 
                alt="AMF1 Clip 1"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/20 transition-all">
                <video 
                  src="/videos/amf1_clip1.mp4" 
                  controls 
                  className="w-full h-full"
                />
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium">Race Highlight #1</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-card/50 border-primary/20">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
              <img 
                src="/images/amf1-thumb2.jpg" 
                alt="AMF1 Clip 2"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/20 transition-all">
                <video 
                  src="/videos/amf1_clip2.mp4" 
                  controls 
                  className="w-full h-full"
                />
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium">Race Highlight #2</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Style Studio Customization */}
      <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Style Studio - Customize Your Clip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text & Captions
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Visual Style
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                🎵 Audio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-text" className="text-sm font-medium">
                  Custom Caption Text
                </Label>
                <Input
                  id="custom-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Add your custom caption..."
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-hashtag" className="text-sm font-medium">
                  Hashtag
                </Label>
                <Input
                  id="custom-hashtag"
                  value={customHashtag}
                  onChange={(e) => setCustomHashtag(e.target.value)}
                  placeholder="#AMF1"
                  className="bg-background/50"
                />
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter" className="text-sm font-medium">
                  Visual Filter
                </Label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger id="filter" className="bg-background/50">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="racing">🏁 Racing Green</SelectItem>
                    <SelectItem value="cinematic">🎬 Cinematic</SelectItem>
                    <SelectItem value="vibrant">✨ Vibrant</SelectItem>
                    <SelectItem value="vintage">📺 Vintage</SelectItem>
                    <SelectItem value="neon">💚 Neon Glow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Add Slow Motion
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Add Zoom Effect
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="music" className="text-sm font-medium">
                  Background Music
                </Label>
                <Select value={selectedMusic} onValueChange={setSelectedMusic}>
                  <SelectTrigger id="music" className="bg-background/50">
                    <SelectValue placeholder="Select music" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">⚡ Energetic</SelectItem>
                    <SelectItem value="epic">🎺 Epic</SelectItem>
                    <SelectItem value="electronic">🎹 Electronic</SelectItem>
                    <SelectItem value="rock">🎸 Rock</SelectItem>
                    <SelectItem value="none">🔇 No Music</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
              <span className="bg-primary/10 px-2 py-1 rounded">Text: {customText || 'Default'}</span>
              <span className="bg-primary/10 px-2 py-1 rounded">Filter: {selectedFilter}</span>
              <span className="bg-primary/10 px-2 py-1 rounded">Music: {selectedMusic}</span>
            </div>
            <Button 
              className="w-full"
              onClick={() => toast.success('Customization applied! Preview below.')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Apply Customization
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edited Clips Section - Shows after text input with 9:16 ratio */}
      {showEditedClips && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI-Edited Clip (Ready to Share)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                {/* 9:16 Aspect Ratio Container for vertical video */}
                <div className="relative bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '9/16' }}>
                  <video 
                    src="/videos/amf1_edit1.mp4" 
                    controls 
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center text-6xl">✂️</div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">📱 Optimized for Social Media</p>
                    <p className="text-xs text-muted-foreground">9:16 vertical format • Auto-captioned • Rights-cleared</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleShare('TikTok', 'Edit 1')}
                      className="text-xs"
                      size="sm"
                      variant="outline"
                    >
                      📱 TikTok
                    </Button>
                    <Button 
                      onClick={() => handleShare('Instagram', 'Edit 1')}
                      className="text-xs"
                      size="sm"
                      variant="outline"
                    >
                      📸 Reels
                    </Button>
                    <Button 
                      onClick={() => handleShare('Stories', 'Edit 1')}
                      className="text-xs"
                      size="sm"
                      variant="outline"
                    >
                      📖 Stories
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => toast.success('Downloading your customized clip...')}
                  >
                    Download Clip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>💡 Use voice or text to request specific race highlights</p>
      </div>
    </div>
  );
}
