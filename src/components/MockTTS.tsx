import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MockTTSProps {
  onHighlightRequest?: (request: string) => void;
  text?: string;
  isSpeaking?: boolean;
  className?: string;
}

export default function MockTTS({ onHighlightRequest, text, isSpeaking: externalIsSpeaking, className }: MockTTSProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', text: string}>>([]);

  const mockResponses = [
    "I found some great overtaking moments from the last 3 races. Let me generate those highlights for you.",
    "Perfect! I'll create a compilation of the best radio communications from that race weekend.",
    "Those celebration moments are gold! I'm processing the clips now with auto-captions.",
    "Great request! I'm pulling the most shareable pit stop moments from that session.",
    "I've identified 5 amazing highlights from that timeframe. Generating clips optimized for TikTok now."
  ];

  const handleVoiceInput = () => {
    setIsListening(true);
    
    // Mock voice recognition
    setTimeout(() => {
      setIsListening(false);
      const mockRequests = [
        "Show me Fernando's overtakes from the last race",
        "Get me the best team radio moments from Monaco",
        "Find celebration clips from the Spanish Grand Prix",
        "I want pit stop highlights from this season",
        "Create clips of the podium celebrations"
      ];
      const randomRequest = mockRequests[Math.floor(Math.random() * mockRequests.length)];
      handleRequest(randomRequest);
    }, 2000);
  };

  const handleRequest = (request: string) => {
    const newMessages = [...messages, { type: 'user' as const, text: request }];
    setMessages(newMessages);
    
    // Mock AI response
    setIsSpeaking(true);
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    setTimeout(() => {
      setMessages([...newMessages, { type: 'ai' as const, text: response }]);
      setIsSpeaking(false);
      onHighlightRequest?.(request);
    }, 1500);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleRequest(userInput);
      setUserInput('');
    }
  };

  const displayIsSpeaking = externalIsSpeaking ?? isSpeaking;
  const displayText = text || (messages.length > 0 ? messages[messages.length - 1].text : '');

  return (
    <div className={className || "racing-card p-6"}>
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center relative">
          <div className="text-3xl">🤖</div>
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse"></div>
          )}
          {displayIsSpeaking && (
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-bounce"></div>
          )}
        </div>
        <h3 className="racing-subtitle mb-2">{text ? "Fernando's AI Coach" : "CliPIT AI Assistant"}</h3>
        {text && displayText && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
            <p className="text-sm">🗣️ "{displayText}"</p>
          </div>
        )}
        {!text && (
          <>
        <h3 className="racing-subtitle mb-2">CliPIT AI Assistant</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ask me to find and trim specific race highlights
        </p>
        
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={handleVoiceInput}
            disabled={isListening || isSpeaking}
            className="racing-button-primary"
          >
            {isListening ? '🎤 Listening...' : '🎤 Voice Request'}
          </Button>
          <Button
            onClick={() => setShowChat(!showChat)}
            variant="outline"
            className="racing-button-secondary"
          >
            💬 Text Chat
          </Button>
        </div>

        {showChat && (
          <div className="border rounded-lg p-4 max-w-md mx-auto">
            <div className="h-40 overflow-y-auto mb-4 text-left space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`p-2 rounded text-xs ${
                  msg.type === 'user' 
                    ? 'bg-primary/10 ml-8' 
                    : 'bg-muted mr-8'
                }`}>
                  <span className="font-semibold">
                    {msg.type === 'user' ? 'You: ' : 'AI: '}
                  </span>
                  {msg.text}
                </div>
              ))}
              {isSpeaking && (
                <div className="bg-muted mr-8 p-2 rounded text-xs">
                  <span className="font-semibold">AI: </span>
                  <span className="animate-pulse">Thinking...</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask for specific highlights..."
                className="racing-input text-xs"
                disabled={isSpeaking}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={isSpeaking || !userInput.trim()}
                className="racing-button-primary text-xs"
              >
                Send
              </Button>
            </form>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p className="mb-1">Try saying: "Show me overtakes from Monaco" or "Find pit stop highlights"</p>
          <p><strong>AI Score:</strong> Measures engagement potential (0-100) based on action intensity, audio quality, and visual appeal</p>
        </div>
        </>
        )}
      </div>
    </div>
  );
}