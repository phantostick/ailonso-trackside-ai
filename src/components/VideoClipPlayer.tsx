import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
          <div className="racing-card p-4">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
              <video 
                src="/videos/amf1_clip1.mp4" 
                controls 
                className="w-full h-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-4xl">🎬</div>
            </div>
            <p className="text-sm font-medium text-center">Clip 1</p>
          </div>

          <div className="racing-card p-4">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
              <video 
                src="/videos/amf1_clip2.mp4" 
                controls 
                className="w-full h-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-4xl">🎬</div>
            </div>
            <p className="text-sm font-medium text-center">Clip 2</p>
          </div>
        </div>
      </div>

      {/* Edited Clips Section - Shows after text input */}
      {showEditedClips && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="font-semibold mb-4">✨ AI-Edited Clips (Ready to Share)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="racing-card p-4">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg mb-3 flex items-center justify-center">
                <video 
                  src="/videos/amf1_edit1.mp4" 
                  controls 
                  className="w-full h-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-4xl">✂️</div>
              </div>
              <p className="text-sm font-medium text-center mb-2">Edited Clip 1</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleShare('TikTok', 'Edit 1')}
                  className="racing-button-primary text-xs flex-1"
                  size="sm"
                >
                  📱 TikTok
                </Button>
                <Button 
                  onClick={() => handleShare('Instagram', 'Edit 1')}
                  className="racing-button-primary text-xs flex-1"
                  size="sm"
                >
                  📸 Instagram
                </Button>
              </div>
            </div>

            <div className="racing-card p-4">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg mb-3 flex items-center justify-center">
                <video 
                  src="/videos/amf1_edit2.mp4" 
                  controls 
                  className="w-full h-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-4xl">✂️</div>
              </div>
              <p className="text-sm font-medium text-center mb-2">Edited Clip 2</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleShare('TikTok', 'Edit 2')}
                  className="racing-button-primary text-xs flex-1"
                  size="sm"
                >
                  📱 TikTok
                </Button>
                <Button 
                  onClick={() => handleShare('Instagram', 'Edit 2')}
                  className="racing-button-primary text-xs flex-1"
                  size="sm"
                >
                  📸 Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>💡 Use voice or text to request specific race highlights</p>
      </div>
    </div>
  );
}
