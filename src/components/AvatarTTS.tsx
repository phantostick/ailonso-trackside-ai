import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import alonsoAvatarVideo from '@/assets/avatar_videos/Alonso_ Avatar.mp4';
import alonsoAvatarPhoto from '@/assets/avatar_photo.jpg';

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
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const detectCommand = useCallback((text: string): {route?: string, action?: string, productId?: string, answer?: string} => {
    const lower = text.toLowerCase().trim();

    // Navigation commands (work from any page)
    for (const key of Object.keys(commandRoutes)) {
      if (lower.includes(key)) {
        return { route: commandRoutes[key] };
      }
    }

    // Pattern matching for navigation commands
    const navRegex = /(?:open|go to|show|take me to|navigate to|switch to|load|visit)\s+(?:the\s+)?(.+)/i;
    const navMatch = lower.match(navRegex);
    if (navMatch) {
      const target = navMatch[1].toLowerCase().replace(/\s+/g, ' ').trim();
      for (const key of Object.keys(commandRoutes)) {
        if (target.includes(key) || navMatch[0].includes(key)) {
          return { route: commandRoutes[key] };
        }
      }
    }

    // Page-specific commands based on current location
    if (location.pathname === '/merch') {
      // Merch page commands
      if (lower.includes('add to cart') || lower.includes('buy') || lower.includes('purchase')) {
        const productPatterns = [
          /(?:add|buy|purchase|get me)\s+(?:the\s+)?(.+?)(?:\s+to\s+(?:cart|basket)|$)/i,
          /(?:add|buy|purchase)\s+(.+?)(?:\s+to\s+(?:my\s+)?cart|$)/i
        ];

        for (const pattern of productPatterns) {
          const match = lower.match(pattern);
          if (match) {
            const productName = match[1].toLowerCase().trim();
            return { action: 'addToCart', productId: productName };
          }
        }
      }
    } else if (location.pathname === '/trivia') {
      // Trivia page commands
      if (lower.includes('answer') || lower.includes('choose') || lower.includes('select')) {
        const answerPatterns = [
          /(?:answer|choose|select)\s+(?:option\s+)?([a-d])/i,
          /(?:answer|choose|select)\s+(?:number\s+)?([1-4])/i
        ];

        for (const pattern of answerPatterns) {
          const match = lower.match(pattern);
          if (match) {
            const answer = match[1].toLowerCase();
            return { action: 'submitAnswer', answer: answer };
          }
        }
      }
    } else if (location.pathname === '/simulator') {
      // Simulator page commands
      if (lower.includes('start') && (lower.includes('race') || lower.includes('simulation'))) {
        return { action: 'startRace' };
      }
      if (lower.includes('reset') || lower.includes('clear')) {
        return { action: 'resetSimulator' };
      }
    } else if (location.pathname === '/clipit') {
      // CliPIT page commands
      if (lower.includes('generate') && lower.includes('clip')) {
        return { action: 'generateClip' };
      }
    }

    return {};
  }, [location.pathname, commandRoutes]);

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
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
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
        console.error('Speech recognition error:', event.error);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isInitialized]);

  const handleUserInput = useCallback((message: string) => {
    // Prevent processing if already speaking or if this message was already processed
    if (isSpeakingRef.current) return;

    const command = detectCommand(message);

    if (command.route) {
      // Navigation command
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
      speakAndNavigate(command.route);
    } else if (command.action) {
      // Page-specific action
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);

      // Dispatch custom event for page-specific actions
      const voiceActionEvent = new CustomEvent('voiceAction', {
        detail: {
          action: command.action,
          productId: command.productId,
          answer: command.answer
        }
      });
      window.dispatchEvent(voiceActionEvent);

      // For addToCart, don't provide immediate feedback - wait for success/failure events
      if (command.action !== 'addToCart') {
        // Provide feedback based on action
        let feedback = '';
        switch (command.action) {
          case 'submitAnswer':
            feedback = `Submitting answer ${command.answer}.`;
            break;
          case 'startRace':
            feedback = 'Starting the race simulation.';
            break;
          case 'resetSimulator':
            feedback = 'Resetting the simulator.';
            break;
          case 'generateClip':
            feedback = 'Generating your video clip.';
            break;
          default:
            feedback = 'Action performed.';
        }

        speakText(feedback);
      }
    } else {
      // General response
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
      handleAlonsoResponse(message);
    }
  }, [detectCommand, speakAndNavigate]);

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

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Control video playback based on speaking state
  useEffect(() => {
    if (videoRef.current) {
      if (isSpeaking) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to beginning
        videoRef.current.load(); // Reload video to show poster image
      }
    }
  }, [isSpeaking]);

  // Listen for voice action success/failure events
  useEffect(() => {
    const handleVoiceActionSuccess = (event: CustomEvent) => {
      const { action, productName } = event.detail;
      if (action === 'addToCart' && productName) {
        speakText(`${productName} has been added to your cart.`);
      }
    };

    const handleVoiceActionFailure = (event: CustomEvent) => {
      const { action, productId } = event.detail;
      if (action === 'addToCart') {
        speakText(`Sorry, I couldn't find a product matching "${productId}". Please try again with a different name.`);
      }
    };

    window.addEventListener('voiceActionSuccess', handleVoiceActionSuccess as EventListener);
    window.addEventListener('voiceActionFailure', handleVoiceActionFailure as EventListener);

    return () => {
      window.removeEventListener('voiceActionSuccess', handleVoiceActionSuccess as EventListener);
      window.removeEventListener('voiceActionFailure', handleVoiceActionFailure as EventListener);
    };
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
  };

  const speakText = (text: string, isGreeting = false) => {
    if (!('speechSynthesis' in window)) return;

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
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    onSpeak?.(text);
  };

  const startVoiceInput = () => {
    if (recognition.current && !isListening && !isSpeaking) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  return (
    <>
      {isHomePage ? (
        /* Home Page: Centered Avatar */
        <div className={cn("flex flex-col items-center space-y-6", className)}>
          {/* Alonso Avatar */}
          <div className="relative">
            {/* Radial Pulse Circles */}
            {(isSpeaking || isListening) && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radial-pulse"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-radial-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-radial-pulse" style={{ animationDelay: '0.6s' }}></div>
              </>
            )}
            
            <video
              ref={videoRef}
              className={cn(
                "w-64 h-64 rounded-full object-contain bg-black transform relative z-10",
                "transition-all duration-300 cursor-pointer racing-glow",
                isListening && "shazam-pulse"
              )}
              onClick={startVoiceInput}
              poster={alonsoAvatarPhoto}
              muted
              loop
              playsInline
            >
              <source src={alonsoAvatarVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Status Indicator */}
            <div className={cn(
              "absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 border-background",
              "flex items-center justify-center text-xs font-bold shadow-lg",
              isSpeaking ? "bg-racing-red animate-pulse" :
              isListening ? "bg-accent animate-pulse" : "bg-primary"
            )}>
              {isSpeaking ? "🔊" : isListening ? "🎤" : "🏎️"}
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex space-x-4 px-4">
            <button
              onClick={startVoiceInput}
              disabled={isListening || isSpeaking}
              className={cn(
                "racing-button-primary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base",
                (isListening || isSpeaking) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isListening ? "Listening..." : "🎤 Ask Alonso"}
            </button>
          </div>
        </div>
      ) : (
        /* Other Pages: Floating Avatar at Bottom Right */
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          {/* Alonso Avatar */}
          <div className="relative">
            {/* Radial Pulse Circles */}
            {(isSpeaking || isListening) && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radial-pulse"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-radial-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-radial-pulse" style={{ animationDelay: '0.6s' }}></div>
              </>
            )}
            
            <video
              ref={videoRef}
              className={cn(
                "w-20 h-20 rounded-full object-contain bg-black transform scale-150 relative z-10",
                "transition-all duration-300 cursor-pointer racing-glow shadow-lg",
                "hover:scale-110",
                isListening && "shazam-pulse"
              )}
              onClick={startVoiceInput}
              poster={alonsoAvatarPhoto}
              muted
              loop
              playsInline
            >
              <source src={alonsoAvatarVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Status Indicator */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-background",
              "flex items-center justify-center text-xs font-bold shadow-lg",
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