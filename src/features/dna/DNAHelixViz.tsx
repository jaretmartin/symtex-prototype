/**
 * DNAHelixViz Component
 *
 * Animated DNA double helix visualization using CSS/Framer Motion.
 * Represents the user's AI DNA profile with interactive strands.
 */

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDNAStore, type DNAStrandData } from './dna-store';

interface DNAHelixVizProps {
  className?: string;
  height?: number;
  animated?: boolean;
  onStrandClick?: (strand: DNAStrandData) => void;
}

// Generate helix points for animation
function generateHelixPoints(count: number, height: number, phase: number = 0) {
  const points: Array<{ x1: number; y: number; x2: number; opacity: number }> = [];
  const amplitude = 40;
  const centerX = 60;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 4 + phase;
    const y = (i / count) * height;
    const x1 = centerX + Math.sin(t) * amplitude;
    const x2 = centerX - Math.sin(t) * amplitude;
    const opacity = 0.3 + Math.abs(Math.sin(t)) * 0.7;

    points.push({ x1, y, x2, opacity });
  }

  return points;
}

function DNAHelixViz({
  className,
  height = 400,
  animated = true,
  onStrandClick,
}: DNAHelixVizProps): JSX.Element {
  const { strands, showHelixAnimation, selectedStrandId, profile } = useDNAStore();

  // Generate helix visualization points
  const helixPoints = useMemo(() => generateHelixPoints(20, height - 40), [height]);

  // Map strands to helix positions
  const strandPositions = useMemo(() => {
    return strands.map((strand, index) => {
      const pointIndex = Math.floor((index / strands.length) * helixPoints.length);
      const point = helixPoints[pointIndex] || helixPoints[0];
      const isLeft = index % 2 === 0;

      return {
        strand,
        x: isLeft ? point.x1 : point.x2,
        y: point.y + 20,
        isLeft,
      };
    });
  }, [strands, helixPoints]);

  return (
    <div className={cn('relative bg-card rounded-xl border border-border overflow-hidden', className)}>
      {/* Overall strength indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs text-muted-foreground mb-1">DNA Strength</div>
        <div className="text-2xl font-bold text-foreground">{profile.overallStrength}%</div>
        <div className="text-xs text-muted-foreground">{profile.totalDataPoints.toLocaleString()} data points</div>
      </div>

      {/* SVG Helix */}
      <svg
        width="120"
        height={height}
        viewBox={`0 0 120 ${height}`}
        className="mx-auto"
      >
        {/* Background glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Helix backbone strands */}
        {helixPoints.map((point, index) => (
          <g key={index}>
            {/* Left strand segment */}
            {index < helixPoints.length - 1 && (
              <motion.line
                x1={point.x1}
                y1={point.y + 20}
                x2={helixPoints[index + 1].x1}
                y2={helixPoints[index + 1].y + 20}
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={point.opacity}
                initial={{ pathLength: 0 }}
                animate={animated && showHelixAnimation ? { pathLength: 1 } : {}}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              />
            )}

            {/* Right strand segment */}
            {index < helixPoints.length - 1 && (
              <motion.line
                x1={point.x2}
                y1={point.y + 20}
                x2={helixPoints[index + 1].x2}
                y2={helixPoints[index + 1].y + 20}
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
                opacity={point.opacity}
                initial={{ pathLength: 0 }}
                animate={animated && showHelixAnimation ? { pathLength: 1 } : {}}
                transition={{ delay: index * 0.05 + 0.025, duration: 0.3 }}
              />
            )}

            {/* Cross-links (base pairs) */}
            {index % 2 === 0 && (
              <motion.line
                x1={point.x1}
                y1={point.y + 20}
                x2={point.x2}
                y2={point.y + 20}
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={animated && showHelixAnimation ? { opacity: 0.5 } : {}}
                transition={{ delay: index * 0.05 + 0.1, duration: 0.2 }}
              />
            )}
          </g>
        ))}

        {/* Strand nodes */}
        {strandPositions.map(({ strand, x, y, isLeft }) => {
          const isSelected = selectedStrandId === strand.id;
          return (
            <motion.g
              key={strand.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: strandPositions.indexOf({ strand, x, y, isLeft }) * 0.1, duration: 0.3 }}
              style={{ cursor: 'pointer' }}
              onClick={() => onStrandClick?.(strand)}
            >
              {/* Glow effect for strong strands */}
              {strand.strength >= 80 && (
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 14 : 10}
                  fill={strand.color}
                  opacity={0.3}
                  filter="url(#glow)"
                />
              )}

              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 10 : 6}
                fill={strand.color}
                stroke={isSelected ? '#fff' : 'transparent'}
                strokeWidth={2}
                className="transition-all duration-200"
              />

              {/* Strength indicator ring */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 14 : 10}
                fill="none"
                stroke={strand.color}
                strokeWidth={1}
                strokeDasharray={`${(strand.strength / 100) * 62.8} 62.8`}
                strokeLinecap="round"
                transform={`rotate(-90 ${x} ${y})`}
                opacity={0.6}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Strand labels (positioned outside SVG) */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
        {strandPositions.map(({ strand, x, y, isLeft }) => (
          <motion.div
            key={strand.id}
            className={cn(
              'absolute text-xs whitespace-nowrap pointer-events-auto cursor-pointer',
              'px-2 py-0.5 rounded-full transition-colors',
              selectedStrandId === strand.id
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            style={{
              top: y + 55, // Offset from SVG position
              left: isLeft ? 'calc(50% - 85px)' : 'calc(50% + 35px)',
              transform: 'translateY(-50%)',
            }}
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + strandPositions.indexOf({ strand, x, y, isLeft }) * 0.05 }}
            onClick={() => onStrandClick?.(strand)}
          >
            {strand.name}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Personal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Work</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          Click strand for details
        </div>
      </div>
    </div>
  );
}

export default memo(DNAHelixViz);
