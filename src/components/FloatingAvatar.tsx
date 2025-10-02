import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FloatingAvatarProps {
  className?: string;
}

export default function FloatingAvatar({ className }: FloatingAvatarProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [alonsosResponse, setAlonsosResponse] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const recognition = useRef<SpeechRecognition | null>(null);
  const processedRef = useRef(false);
  const wakeWordDetected = useRef(false);

  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 'AIzaSyCiIddqNVAVHDuMfGp87XIhTpwc2v7iRis';
  let genAI: GoogleGenerativeAI | null = null;
  try { genAI = new GoogleGenerativeAI(apiKey); } catch {}

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Get time-based greeting
  const getTimeBasedGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

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

  const detectCommand = useCallback((text: string): {route?: string} => {
    const lower = text.toLowerCase().trim();
    console.log('Checking command for text:', lower);

    // Direct keyword matching (most reliable)
    for (const key of Object.keys(commandRoutes)) {
      if (lower.includes(key)) {
        console.log('Direct match found for key:', key, '->', commandRoutes[key]);
        return { route: commandRoutes[key] };
      }
    }

    // Pattern matching for navigation commands
    const navRegex = /(?:open|go to|show|take me to|navigate to|switch to|load|visit)\s+(?:the\s+)?(.+)/i;
    const match = lower.match(navRegex);
    if (match) {
      console.log('Regex match found:', match);
      const fullMatch = match[0];
      const target = match[1].toLowerCase().replace(/\s+/g, ' ').trim();
      console.log('Full match:', fullMatch, 'Extracted target:', target);

      // Check if the target matches any of our commands
      for (const key of Object.keys(commandRoutes)) {
        if (target.includes(key) || fullMatch.includes(key)) {
          console.log('Pattern match found for key:', key, '->', commandRoutes[key]);
          return { route: commandRoutes[key] };
        }
      }
    }

    console.log('No command detected');
    return {};
  }, []);

  const speakAndNavigate = useCallback((route: string) => {
    const label = route === '/' ? 'home' : route.replace('/', '').replace('merch', 'Style Studio');
    const reply = `Opening ${label} now.`;
    setAlonsosResponse(reply);
    setConversation(prev => [...prev, { role: 'assistant', content: reply }]);
    speakText(reply);
    navigate(route);
  }, [navigate]);

  const callGemini = useCallback(async (message: string) => {
    if (!genAI) {
      const fallback = 'Gemini is not configured.';
      setAlonsosResponse(fallback);
      speakText(fallback);
      return;
    }
    setIsThinking(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const history = conversation.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
      const prompt = `You are Ai.lonso, an Aston Martin F1 companion. Be concise (<60 words), insightful, and friendly. Avoid fabricating stats.\nConversation so far:\n${history}\nUser: ${message}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setAlonsosResponse(text);
      setConversation(prev => [...prev, { role: 'assistant', content: text }]);
      speakText(text);
    } catch (e: any) {
      const msg = e?.message || 'Gemini request failed';
      setError(msg);
      setAlonsosResponse('There was an issue answering that.');
    } finally {
      setIsThinking(false);
    }
  }, [conversation, genAI]);

  const processUserMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    setConversation(prev => [...prev, { role: 'user', content: message }]);
    const { route } = detectCommand(message);
    if (route) {
      speakAndNavigate(route);
    } else {
      callGemini(message);
    }
  }, [callGemini, speakAndNavigate, detectCommand]);

  const speakText = (text: string, isGreeting = false) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setIsSpeaking(false);
        // After speaking, restart listening (unless it's a greeting)
        if (!isGreeting) {
          setTimeout(() => {
            startContinuousListening();
          }, 500);
        }
      };

      speechSynthesis.speak(utterance);
    }
  };

  const startContinuousListening = useCallback(() => {
    console.log('startContinuousListening called');
    if (recognition.current) {
      // Always stop first to ensure clean state
      try {
        recognition.current.stop();
        console.log('Stopped existing recognition');
      } catch (e) {
        console.log('Stop error (expected):', e);
      }

      // Reset state
      processedRef.current = false;
      wakeWordDetected.current = false;
      setInterimText('');
      setUserMessage('');
      setAlonsosResponse('');
      setError(null);
      console.log('State reset complete');

      // Small delay to ensure proper cleanup
      setTimeout(() => {
        try {
          setIsListening(true);
          recognition.current?.start();
          console.log('Recognition started successfully');
        } catch (e) {
          console.warn('Failed to start recognition:', e);
          setIsListening(false);
          // Retry after a longer delay
          setTimeout(() => startContinuousListening(), 2000);
        }
      }, 100);
    } else {
      console.log('No recognition object available');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognition.current) {
      try { recognition.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  // Wake word detection
  const checkForWakeWord = useCallback((text: string): boolean => {
    const lower = text.toLowerCase();
    const wakeWords = ['alonso', 'fernando', 'hey alonso', 'ai.lonso', 'assistant', 'hey', 'hi'];
    return wakeWords.some(word => lower.includes(word));
  }, []);

  // Initial greeting on app start
  useEffect(() => {
    if (!isInitialized) {
      const greeting = `${getTimeBasedGreeting()}! I'm Ai.lonso, your Aston Martin F1 companion. How can I help you today?`;
      setTimeout(() => {
        speakText(greeting, true); // Mark as greeting
        setIsInitialized(true);
      }, 1000); // Small delay to ensure speech synthesis is ready
    }
  }, [isInitialized, getTimeBasedGreeting]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') {
      setError('Speech Recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser.');
      return;
    }

    const rec: SpeechRecognition = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      console.log('Speech recognition started');
      setError(null);
      setIsListening(true);
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Speech recognition result received');
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }

      console.log('Interim text:', interim);
      console.log('Final text:', finalText);

      if (interim) setInterimText(interim);

      if (finalText && !processedRef.current) {
        console.log('Processing final text:', finalText);
        processedRef.current = true;
        const cleaned = finalText.trim();
        setInterimText('');
        setUserMessage(cleaned);

        // Check if this is a command first
        const { route } = detectCommand(cleaned);
        console.log('Recognized text:', cleaned);
        console.log('Detected route:', route);

        if (route) {
          // It's a navigation command, process it
          console.log('Processing as navigation command to:', route);
          processUserMessage(cleaned);
          setIsListening(false);
          return;
        }

        // Check for wake word if not already detected
        if (!wakeWordDetected.current) {
          if (checkForWakeWord(cleaned)) {
            wakeWordDetected.current = true;
            const response = "I'm listening!";
            setAlonsosResponse(response);
            speakText(response);
            return;
          } else {
            // Not a wake word or command, ignore and continue listening
            processedRef.current = false;
            return;
          }
        }

        // Process as regular message (question for AI)
        processUserMessage(cleaned);
        setIsListening(false);
      }
    };

    rec.onerror = (e: any) => {
      if (e?.error === 'not-allowed') {
        setError('Microphone permission denied. Click the avatar to enable.');
      } else if (e?.error === 'no-speech') {
        // Silent restart for continuous listening
        setTimeout(() => startContinuousListening(), 1000);
      } else if (e?.error === 'aborted') {
        // Recognition was aborted, restart automatically
        setTimeout(() => startContinuousListening(), 500);
      } else {
        setError('Speech error: ' + (e?.error || 'unknown'));
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      // Auto-restart for continuous listening
      setTimeout(() => {
        if (isInitialized) {
          startContinuousListening();
        }
      }, 500);
    };

    recognition.current = rec;

    return () => {
      try { recognition.current?.stop(); } catch {}
      setIsListening(false);
    };
  }, [isInitialized, checkForWakeWord, processUserMessage, startContinuousListening]);

  // Start listening after greeting is complete
  useEffect(() => {
    if (isInitialized && recognition.current) {
      setTimeout(() => {
        startContinuousListening();
      }, 500); // Small delay after greeting
    }
  }, [isInitialized, startContinuousListening]);

  // Reset conversation when navigating to new page
  useEffect(() => {
    setShowChat(false);
    setUserMessage('');
    setAlonsosResponse('');
    setInterimText('');
  }, [location.pathname]);

  return (
    <>
      {isHomePage ? (
        /* Home Page: Centered Avatar */
        <div className={cn(
          "flex flex-col items-center justify-center space-y-6",
          className
        )}>
          {/* Centered Avatar */}
          <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent",
              "flex items-center justify-center text-4xl font-bold text-white",
              "transition-all duration-300 cursor-pointer racing-glow",
              isSpeaking && "animate-vibrate",
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
              {isSpeaking ? "🔊" : isListening ? "🎤" : isThinking ? "⚙️" : "🏎️"}
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className="racing-button-secondary px-6 py-3"
            >
              💬 Chat History
            </button>
          </div>

          {/* Chat Interface */}
          {showChat && (
            <div className="w-full max-w-2xl racing-card p-6 animate-fade-in-up">
              <h3 className="racing-subtitle mb-4">Chat with Ai.lonso</h3>
              <div className="text-xs text-muted-foreground mb-4 space-y-1">
                <p><strong>Commands:</strong> "Open Style Studio", "Go to simulator", "Open trivia", "Profile", "Clip It".</p>
                <p>Otherwise I'll answer using Gemini.</p>
                {error && <span className="text-red-400">{error}</span>}
              </div>

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
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-lg p-3 max-w-xs border border-border/40 animate-pulse">
                      <p className="text-xs italic text-muted-foreground">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Other Pages: Floating Avatar */
        <>
          {/* Floating Avatar */}
          <div className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2",
            className
          )}>
            {/* Chat Bubble */}
            {(showChat || alonsosResponse) && (
              <div className="bg-primary/95 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg border border-primary/20 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                    FA
                  </div>
                  <span className="text-xs font-semibold text-primary">Ai.lonso</span>
                </div>

                {userMessage && (
                  <div className="text-xs text-muted-foreground mb-2 italic">
                    "{userMessage}"
                  </div>
                )}

                {alonsosResponse && (
                  <div className="text-sm">{alonsosResponse}</div>
                )}

                {isThinking && (
                  <div className="text-xs italic text-muted-foreground mt-2">
                    Thinking...
                  </div>
                )}

                {isListening && interimText && (
                  <div className="text-xs italic text-muted-foreground mt-2">
                    "{interimText}"
                  </div>
                )}
              </div>
            )}

            {/* Avatar Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                "w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent",
                "flex items-center justify-center text-2xl font-bold text-white",
                "transition-all duration-300 shadow-lg hover:shadow-xl",
                "border-2 border-white/20 backdrop-blur-sm",
                isSpeaking && "animate-vibrate",
                isListening && "ring-4 ring-accent/50 animate-pulse scale-105",
                isThinking && "ring-4 ring-blue-400/50 animate-pulse"
              )}
            >
              {isSpeaking ? "🔊" : isListening ? "🎤" : isThinking ? "⚙️" : "🏎️"}
            </button>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {isListening && <span className="animate-pulse">Listening...</span>}
              {error && <span className="text-red-400">Error</span>}
            </div>
          </div>

          {/* Full Screen Chat Modal (optional) */}
          {showChat && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-xl border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Chat with Ai.lonso</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((msg, idx) => (
                    <div key={idx} className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "rounded-lg p-3 max-w-xs",
                        msg.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      )}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-lg p-3 max-w-xs animate-pulse">
                        <p className="text-xs italic text-muted-foreground">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  <p><strong>Commands:</strong> "Open Style Studio", "Go to simulator", "Open trivia", "Profile", "Clip It"</p>
                  <p>Say "Alonso" or "Hey Alonso" to wake me up!</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}