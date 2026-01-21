import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceCommandButtonProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  onToggle: () => void;
  className?: string;
}

export function VoiceCommandButton({
  isListening,
  isSupported,
  transcript,
  onToggle,
  className,
}: VoiceCommandButtonProps) {
  if (!isSupported) return null;

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'p-3 rounded-full transition-colors',
          isListening
            ? 'bg-red-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        )}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Mic className="w-5 h-5" />
          </motion.div>
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </motion.button>

      {isListening && transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-white whitespace-nowrap"
        >
          {transcript}
        </motion.div>
      )}
    </div>
  );
}
