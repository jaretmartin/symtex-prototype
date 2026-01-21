import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceCommandOptions {
  continuous?: boolean;
  language?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface VoiceCommandState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

export function useVoiceCommand(options: VoiceCommandOptions = {}) {
  const {
    continuous = false,
    language = 'en-US',
    onResult,
    onError,
  } = options;

  const [state, setState] = useState<VoiceCommandState>({
    isListening: false,
    transcript: '',
    isSupported: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window,
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!state.isSupported) return;

    const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognitionAPI) return;
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      setState(prev => ({ ...prev, transcript }));

      if (event.results[event.results.length - 1].isFinal) {
        onResult?.(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      const error = event.error;
      setState(prev => ({ ...prev, error, isListening: false }));
      onError?.(error);
    };

    recognitionRef.current.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [continuous, language, onResult, onError, state.isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
  };
}
