import React, { useCallback, useMemo, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MODEL_NAME = 'gemini-1.5-flash'; // or 'gemini-pro'

// 🔑 ElevenLabs API key + Fernando Alonso voice ID
const ELEVEN_API_KEY = "sk_3ed9d67877691c9c93b6cca151f30b728ed09c607c8a14d6";
const ALONSO_VOICE_ID = "GLfd7kTn1d1gIbUNmCBV";

interface VoiceAssistantProps {
  onSearchCommand?: (query: string) => void;
  setSearchQuery?: (query: string) => void;
  onDebugLog?: (msg: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearchCommand, setSearchQuery, onDebugLog }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [assistantReply, setAssistantReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // 🎤 ElevenLabs TTS for Alonso voice
  const speak = useCallback(async (text: string) => {
    if (!text) return;
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ALONSO_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: 0.4,
              similarity_boost: 0.9,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error("ElevenLabs TTS error:", await response.text());
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error with ElevenLabs TTS:", err);
    }
  }, []);

  // Gemini AI client
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
            disabled={!assistantReply}
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
