import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceCommandButtonProps {
  onCommand: (command: string) => void;
  className?: string;
}

export function VoiceCommandButton({ onCommand, className }: VoiceCommandButtonProps) {
  const { isListening, transcript, isSupported, toggleListening } = useVoiceCommand({
    onResult: onCommand,
  });

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={isListening ? 'danger' : 'secondary'}
            onClick={toggleListening}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <MicOff className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse animation when listening */}
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-error/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isListening ? 'Stop listening' : 'Voice command (say "Hey Symtex")'}
        </TooltipContent>
      </Tooltip>

      {/* Live transcript */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-3 py-1.5 bg-popover border rounded-md shadow-lg text-sm">
              "{transcript}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
