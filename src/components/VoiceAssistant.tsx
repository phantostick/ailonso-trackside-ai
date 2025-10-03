import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * NOTE: FRONTEND API KEY USAGE
 * You will need to expose your Gemini API key to the browser for this direct-call approach.
 * This is NOT recommended for production without usage restrictions or a proxy backend.
 * For development, create a .env file with: VITE_GEMINI_API_KEY=your_key_here
 * And access it via import.meta.env.VITE_GEMINI_API_KEY
 */

const MODEL_NAME = 'gemini-1.5-flash'; // or 'gemini-pro'

interface VoiceAssistantProps {
  // Optional: allow parent to receive extracted search term
  onSearchCommand?: (query: string) => void;
  // Optional: provide external setter for UI search bar
  setSearchQuery?: (query: string) => void;
  // If you want to log or debug externally
  onDebugLog?: (msg: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearchCommand, setSearchQuery, onDebugLog }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [assistantReply, setAssistantReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Prepare voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Attempt to pick an English, natural-sounding female/neutral voice
      const preferred = voices.find(v => /en-US/i.test(v.lang) && /Google US English|Jenny|Aria|Samantha|Lisa/i.test(v.name)) ||
        voices.find(v => /en/i.test(v.lang));
      setSelectedVoice(preferred || null);
      setVoiceReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utter.voice = selectedVoice;
    utter.rate = 1; // You can tweak rate/pitch
    utter.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }, [selectedVoice]);

  // Gemini client instance (memoized)
  const genAI = useMemo(() => {
    if (!apiKey) return null;
    try {
      return new GoogleGenerativeAI(apiKey);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [apiKey]);

  const processTranscriptForCommand = useCallback((text: string) => {
    // Basic command patterns: "search hoodie", "find cap", "look for helmet"
    const pattern = /\b(search|find|look\s+for)\s+([a-zA-Z0-9'-]+)/i;
    const match = text.match(pattern);
    if (match) {
      const keyword = match[2].toLowerCase();
      if (onDebugLog) onDebugLog(`Detected search command: ${keyword}`);
      if (setSearchQuery) setSearchQuery(keyword);
      if (onSearchCommand) onSearchCommand(keyword);
      return keyword;
    }
    return null;
  }, [onSearchCommand, setSearchQuery, onDebugLog]);

  const callGemini = useCallback(async (prompt: string) => {
    if (!genAI) {
      setError('Gemini client not initialized. Is VITE_GEMINI_API_KEY set?');
      return;
    }
    setIsProcessing(true);
    setError(null);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      // Provide system-style guidance in user prompt (since no server side system role)
      const fullPrompt = `You are a helpful Aston Martin F1 merchandise and racing companion. Keep replies concise unless user asks for detail.\nUser said: ${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      setAssistantReply(text);
      speak(text);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error calling Gemini');
    } finally {
      setIsProcessing(false);
    }
  }, [genAI, speak]);

  const handleStart = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Browser does not support SpeechRecognition');
      return;
    }
    resetTranscript();
    setAssistantReply('');
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  }, [browserSupportsSpeechRecognition, resetTranscript]);

  const handleStop = useCallback(() => {
    SpeechRecognition.stopListening();
    // After stopping, process transcript
    if (transcript.trim()) {
      const keyword = processTranscriptForCommand(transcript);
      callGemini(transcript + (keyword ? ` (User intends to search for: ${keyword})` : ''));
    }
  }, [transcript, processTranscriptForCommand, callGemini]);

  const handleReset = useCallback(() => {
    resetTranscript();
    setAssistantReply('');
    setError(null);
  }, [resetTranscript]);

  return (
    <Card className="w-full max-w-xl mx-auto space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Voice Assistant
          {listening && <Badge variant="default">Listening</Badge>}
          {isProcessing && <Badge variant="secondary">Thinking</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!browserSupportsSpeechRecognition && (
          <div className="text-sm text-destructive">
            Your browser does not support Speech Recognition.
          </div>
        )}
        {!apiKey && (
          <div className="text-sm text-destructive">
            Missing VITE_GEMINI_API_KEY. Add it to your .env file.
          </div>
        )}
        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Transcript</h4>
          <div className="p-3 rounded bg-secondary/40 min-h-[60px] text-sm whitespace-pre-wrap">
            {transcript || <span className="text-muted-foreground">Say something like: "Search hoodie"</span>}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Assistant Reply</h4>
          <div className="p-3 rounded bg-secondary/40 min-h-[60px] text-sm whitespace-pre-wrap">
            {assistantReply || <span className="text-muted-foreground">Waiting for a reply...</span>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={handleStart} disabled={listening || !browserSupportsSpeechRecognition}>Start Listening</Button>
          <Button variant="outline" onClick={handleStop} disabled={!listening}>Stop & Send</Button>
          <Button variant="secondary" onClick={handleReset} disabled={listening && !transcript}>Reset</Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (assistantReply) speak(assistantReply);
            }}
            disabled={!assistantReply || !voiceReady}
          >
            Replay Voice
          </Button>
        </div>

        <div className="text-xs text-muted-foreground leading-snug pt-2 space-y-1">
          <p><strong>Commands:</strong> "search hoodie", "find cap", "look for helmet" will auto-update your search bar.</p>
          <p>API calls are direct from the browser. Do NOT ship this approach to production without rate limiting or a proxy.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
