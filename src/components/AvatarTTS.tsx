import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface AvatarTTSProps {
  onSpeak?: (text: string) => void;
  className?: string;
}

export default function AvatarTTS({ onSpeak, className }: AvatarTTSProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alonsosResponse, setAlonsosResponse] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const recognition = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const processedRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Navigation voice commands
  const commandRoutes: Record<string, string> = {
    'style studio': '/merch',
    'merchandise': '/merch',
    'merch': '/merch',
    'open merch': '/merch',
    'racecraft simulator': '/simulator',
    'simulator': '/simulator',
    'open simulator': '/simulator',
    'go to simulator': '/simulator',
    'trivia': '/trivia',
    'green light trivia': '/trivia',
    'green-light trivia': '/trivia',
    'open trivia': '/trivia',
    'go to trivia': '/trivia',
    'profile': '/profile',
    'open profile': '/profile',
    'go to profile': '/profile',
    'home': '/',
    'go home': '/',
    'main page': '/',
    'clip it': '/clipit',
    'clipit': '/clipit',
    'clip pit': '/clipit',
    'open clip it': '/clipit',
    'go to clip it': '/clipit',
  };

  // Get time-based greeting
  const getTimeBasedGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const detectCommand = useCallback((text: string): {route?: string} => {
    const lower = text.toLowerCase().trim();

    // Direct keyword matching (most reliable)
    for (const key of Object.keys(commandRoutes)) {
      if (lower.includes(key)) {
        return { route: commandRoutes[key] };
      }
    }

    // Pattern matching for navigation commands
    const navRegex = /(?:open|go to|show|take me to|navigate to|switch to|load|visit)\s+(?:the\s+)?(.+)/i;
    const match = lower.match(navRegex);
    if (match) {
      const fullMatch = match[0];
      const target = match[1].toLowerCase().replace(/\s+/g, ' ').trim();

      // Check if the target matches any of our commands
      for (const key of Object.keys(commandRoutes)) {
        if (target.includes(key) || fullMatch.includes(key)) {
          return { route: commandRoutes[key] };
        }
      }
    }

    return {};
  }, []);

  const speakAndNavigate = useCallback((route: string) => {
    const pageName = Object.keys(commandRoutes).find(key => commandRoutes[key] === route);
    const label = pageName || (route === '/' ? 'home' : route.replace('/', ''));
    const reply = `Navigating to ${label}. What would you like to do next?`;
    setAlonsosResponse(reply);
    speakText(reply);
    navigate(route);
  }, [navigate, commandRoutes]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          handleUserInput(finalTranscript);
        }
      };

      recognition.current.onerror = (event: any) => {
        setIsListening(false);
        // Auto-restart after error
        if (event.error !== 'not-allowed') {
          clearPendingRestart();
          restartTimeoutRef.current = window.setTimeout(() => {
            startContinuousListening();
          }, 1000);
        }
      };

      recognition.current.onend = () => {
        setIsListening(false);
        // Auto-restart if initialized and not speaking
        if (isInitialized && !isSpeakingRef.current) {
          clearPendingRestart();
          restartTimeoutRef.current = window.setTimeout(() => {
            startContinuousListening();
          }, 400);
        }
      };
    }
  }, [isInitialized]);

  const handleUserInput = useCallback((message: string) => {
    // Prevent processing if already speaking or if this message was already processed
    if (isSpeakingRef.current) return;

    const { route } = detectCommand(message);
    if (route) {
      // Stop recognition before speaking
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
      speakAndNavigate(route);
    } else {
      // Stop recognition before speaking
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
      handleAlonsoResponse(message);
    }
  }, [detectCommand, speakAndNavigate]);

  const startContinuousListening = useCallback(() => {
    if (!recognition.current || isSpeaking) return;

    clearTimeout(restartTimeoutRef.current!);
    try {
      recognition.current.start();
    } catch (e) {
      // Already started or other error
    }
  }, [isSpeaking]);

  const clearPendingRestart = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  // Initial greeting on component mount
  useEffect(() => {
    const greetingHasBeenPlayed = sessionStorage.getItem('greetingPlayed');

    if (!greetingHasBeenPlayed && !isInitialized) {
      const greeting = `${getTimeBasedGreeting()}! I'm Fernando Alonso, your Aston Martin F1 companion. How can I help you today?`;
      setTimeout(() => {
        speakText(greeting, true); // Mark as greeting
        sessionStorage.setItem('greetingPlayed', 'true');
        setIsInitialized(true);
      }, 1000);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized, getTimeBasedGreeting]);

  // Start listening after greeting is complete
  useEffect(() => {
    if (isInitialized && recognition.current) {
      setTimeout(() => {
        startContinuousListening();
      }, 500);
    }
  }, [isInitialized, startContinuousListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

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

  const speakText = (text: string, isGreeting = false) => {
    if (!('speechSynthesis' in window)) return;

    clearPendingRestart();

    // Stop any ongoing recognition
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);

    setIsSpeaking(true);
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;

      if (!isGreeting) {
        // Restart listening after response
        clearPendingRestart();
        restartTimeoutRef.current = window.setTimeout(() => {
          startContinuousListening();
        }, 800); // Slightly longer delay to prevent immediate re-triggering
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;

      if (!isGreeting) {
        clearPendingRestart();
        restartTimeoutRef.current = window.setTimeout(() => {
          startContinuousListening();
        }, 800);
      }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    onSpeak?.(text);
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
    <>
      {isHomePage ? (
        /* Home Page: Centered Avatar */
        <div className={cn("flex flex-col items-center space-y-6", className)}>
          {/* Alonso Avatar */}
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
          </div>

        </div>
      ) : (
        /* Other Pages: Floating Avatar at Bottom Right */
        <div className="fixed bottom-6 right-6 z-50">
          {/* Alonso Avatar */}
          <div className="relative">
            <div
              className={cn(
                "w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent",
                "flex items-center justify-center text-2xl font-bold text-white",
                "transition-all duration-300 cursor-pointer racing-glow shadow-lg",
                "hover:scale-110",
                isSpeaking && "animate-racing-pulse",
                isListening && "ring-4 ring-primary/50 animate-pulse"
              )}
              onClick={() => setShowChat(!showChat)}
            >
              FA
            </div>

            {/* Status Indicator */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background",
              "flex items-center justify-center text-xs font-bold",
              isSpeaking ? "bg-racing-red animate-pulse" :
              isListening ? "bg-accent animate-pulse" : "bg-primary"
            )}>
              {isSpeaking ? "🔊" : isListening ? "🎤" : "🏎️"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}