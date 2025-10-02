import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AvatarTTSProps {
  onSpeak?: (text: string) => void;
  className?: string;
}

export default function AvatarTTS({ onSpeak, className }: AvatarTTSProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [alonsosResponse, setAlonsosResponse] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserMessage(transcript);
        handleAlonsoResponse(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const alonsosKnowledge = {
    greeting: ["¡Hola! I'm Fernando Alonso, ready to help you with racing!", "Welcome to AMF1! What would you like to know?"],
    racing: ["Racing is about precision, patience, and passion. Every millisecond counts!", "The key is finding the perfect balance between speed and control."],
    car: ["The car setup is crucial - tires, aerodynamics, engine mapping... everything must work in harmony.", "A good car can make an average driver fast, but a great driver makes any car competitive."],
    track: ["Every circuit tells a story. You must learn its rhythm, respect its challenges.", "Monaco is special to me - it's where precision matters most."],
    default: ["That's an interesting question! Racing teaches us that every challenge is an opportunity.", "Remember, in F1 and in life, consistency beats raw speed.", "The most important thing is to never give up, ¿sí?"]
  };

  const getAlonsoResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hola')) {
      return alonsosKnowledge.greeting[Math.floor(Math.random() * alonsosKnowledge.greeting.length)];
    } else if (lowerMsg.includes('car') || lowerMsg.includes('setup') || lowerMsg.includes('vehicle')) {
      return alonsosKnowledge.car[Math.floor(Math.random() * alonsosKnowledge.car.length)];
    } else if (lowerMsg.includes('track') || lowerMsg.includes('circuit') || lowerMsg.includes('monaco')) {
      return alonsosKnowledge.track[Math.floor(Math.random() * alonsosKnowledge.track.length)];
    } else if (lowerMsg.includes('race') || lowerMsg.includes('racing') || lowerMsg.includes('f1')) {
      return alonsosKnowledge.racing[Math.floor(Math.random() * alonsosKnowledge.racing.length)];
    } else {
      return alonsosKnowledge.default[Math.floor(Math.random() * alonsosKnowledge.default.length)];
    }
  };

  const handleAlonsoResponse = (message: string) => {
    const response = getAlonsoResponse(message);
    setAlonsosResponse(response);
    speakText(response);
    setShowChat(true);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
      onSpeak?.(text);
    }
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      setShowChat(true);
      recognition.current.start();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userMessage.trim()) {
      handleAlonsoResponse(userMessage);
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
     <div className="relative">
        <div className={cn(
          "w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent",
          "flex items-center justify-center text-4xl font-bold text-white",
          "transition-all duration-300 cursor-pointer racing-glow",
          isSpeaking && "animate-racing-pulse",
          isListening && "ring-4 ring-primary/50 animate-pulse"
        )}>
          FA
        </div>
        
        {/* Status Indicator */}
        <div className={cn(
          "absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-background",
          "flex items-center justify-center text-xs font-bold",
          isSpeaking ? "bg-racing-red animate-pulse" : 
          isListening ? "bg-accent animate-pulse" : "bg-primary"
        )}>
          {isSpeaking ? "🔊" : isListening ? "🎤" : "🏎️"}
        </div>
      </div>


      {/* Interaction Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={startListening}
          disabled={isListening || isSpeaking}
          className={cn(
            "racing-button-primary px-6 py-3",
            (isListening || isSpeaking) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isListening ? "Listening..." : "🎤 Ask Alonso"}
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className="racing-button-secondary px-6 py-3"
        >
          💬 Type Message
        </button>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <div className="w-full max-w-2xl racing-card p-6 animate-fade-in-up">
          <h3 className="racing-subtitle mb-4">Chat with Ai.lonso</h3>
          
          {/* Messages */}
          <div className="space-y-4 mb-4">
            {userMessage && (
              <div className="flex justify-end">
                <div className="bg-secondary rounded-lg p-3 max-w-xs">
                  <p className="text-sm">{userMessage}</p>
                </div>
              </div>
            )}
            
            {alonsosResponse && (
              <div className="flex justify-start">
                <div className="bg-primary/20 rounded-lg p-3 max-w-xs border border-primary/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                      FA
                    </div>
                    <span className="text-xs font-semibold text-primary">Ai.lonso</span>
                  </div>
                  <p className="text-sm">{alonsosResponse}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleTextSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask Fernando anything about racing..."
              className="flex-1 racing-select"
            />
            <button
              type="submit"
              disabled={!userMessage.trim() || isSpeaking}
              className="racing-button-primary px-4"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
