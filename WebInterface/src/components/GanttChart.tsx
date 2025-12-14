import { motion } from 'motion/react';
import { Process, GanttBlock, Execute } from '../utils/types';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { GANTT_CONSTANTS } from '../utils/constants';

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  currentTime: number;
  processColors: Map<number, string>;
  processes: Process[];
  executes: Execute[];
}

const {
  PX_PER_UNIT,
  LEFT_PADDING,
  RIGHT_PADDING,
  ROW_HEIGHT,
  RULER_HEIGHT,
  MIN_SEGMENT_WIDTH,
} = GANTT_CONSTANTS;

export function GanttChart({
  ganttBlocks,
  currentTime,
  processColors,
  processes,
  executes,
}: GanttChartProps) {
  const maxTimeFromBlocks =
    ganttBlocks.length > 0 ? Math.max(...ganttBlocks.map((b) => b.endTime)) : 0;
  const totalExecTime = processes.reduce((sum, p) => sum + p.exec_time, 0);
  const maxTime = Math.max(maxTimeFromBlocks + 5, totalExecTime + 10, 30);

  const contentWidth = LEFT_PADDING + maxTime * PX_PER_UNIT + RIGHT_PADDING;
  const timeTicks = Array.from({ length: maxTime + 1 }, (_, i) => i);

  
  const processBlockGroups = processes.map((process) => {
    const blocks = ganttBlocks.filter((b) => b.pid === process.pid);

  
    const merged: GanttBlock[] = [];
    blocks.forEach((block) => {
      const last = merged[merged.length - 1];
      if (last && last.endTime === block.startTime) {
        last.endTime = block.endTime;
      } else {
        merged.push({ ...block });
      }
    });

    return { process, blocks: merged };
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Real-Time Gantt Chart Timeline</h2>
          <p className="text-sm text-slate-600">
            Animated execution timeline with CPU operations shown as yellow markers
          </p>
        </div>
      </div>

          <div
        className="overflow-x-auto overflow-y-visible bg-slate-50 rounded-xl border border-slate-200"
        style={{ maxHeight: '1000px' }}
      >
        {ganttBlocks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Click Play to start the simulation</p>
            <p className="text-sm">Events will appear at their exact execution times</p>
          </div>
        ) : (
          <div
            className="relative bg-slate-50"
            style={{
              width: `${contentWidth}px`,
              minHeight: `${RULER_HEIGHT + processes.length * ROW_HEIGHT + 40}px`,
            }}
          >
          
            <div
              className="sticky top-0 z-20 bg-slate-50 border-b-2 border-slate-300"
              style={{ height: `${RULER_HEIGHT}px` }}
            >
              <div className="relative h-full">
                <div className="absolute inset-0 flex items-end pb-2">
                  <div
                    style={{ width: `${LEFT_PADDING}px` }}
                    className="flex-shrink-0"
                  />
                  {timeTicks.map((time) => {
                    const xPos = time * PX_PER_UNIT;
                    return (
                      <div
                        key={time}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${LEFT_PADDING + xPos}px` }}
                      >
                        <div className="w-0.5 h-3 bg-slate-400 mb-1" />
                        <span className="text-xs text-slate-600 font-mono">
                          {time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
              {timeTicks.map((time) => {
                const xPos = LEFT_PADDING + time * PX_PER_UNIT;
                return (
                  <div
                    key={`grid-${time}`}
                    className="absolute top-0 bottom-0 w-px bg-slate-200"
                    style={{ left: `${xPos}px` }}
                  />
                );
              })}
            </div>

          
            <div className="relative z-10">
              {processBlockGroups.map(({ process, blocks }, rowIndex) => {
                const color = processColors.get(process.pid) || '#3b82f6';
                const rowTop = RULER_HEIGHT + rowIndex * ROW_HEIGHT;

                return (
                  <div
                    key={process.pid}
                    className="absolute left-0 right-0 border-b border-slate-200"
                    style={{
                      top: `${rowTop}px`,
                      height: `${ROW_HEIGHT}px`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-slate-50 border-r border-slate-200 z-10"
                      style={{ width: `${LEFT_PADDING}px` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-800">{process.name}</div>
                          <div className="text-xs text-slate-500">
                            Exec: {process.exec_time}
                          </div>
                        </div>
                      </div>
                    </div>

                    {blocks.map((block, blockIndex) => {
                      const startX = LEFT_PADDING + block.startTime * PX_PER_UNIT;
                      const duration = block.endTime - block.startTime;
                      const segmentWidth = Math.max(
                        duration * PX_PER_UNIT - 4,
                        MIN_SEGMENT_WIDTH
                      );

                      const isRunning =
                        block.endTime >= currentTime - 1 &&
                        block.startTime < currentTime;

                      const cpuEventMarkers = calculateEventMarkers(
                        process,
                        block,
                        executes
                      );

                      return (
                        <EventSegment
                          key={`${block.pid}-${blockIndex}`}
                          block={block}
                          startX={startX}
                          width={segmentWidth}
                          color={color}
                          isRunning={isRunning}
                          duration={duration}
                          cpuEventMarkers={cpuEventMarkers}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

           
            {currentTime > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  left: `${LEFT_PADDING + currentTime * PX_PER_UNIT}px`,
                }}
                transition={{
                  left: { duration: 0.5, ease: 'linear' },
                  opacity: { duration: 0.3 },
                }}
                className="absolute top-0 w-0.5 bg-red-500 z-30 pointer-events-none shadow-lg"
                style={{
                  height: `${RULER_HEIGHT + processes.length * ROW_HEIGHT}px`,
                }}
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full bg-red-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg font-mono">
                  t = {currentTime}
                </div>
                <div className="absolute inset-0 bg-red-500 blur-sm opacity-50" />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {ganttBlocks.length > 0 && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Process Colors</h3>
            <div className="flex flex-wrap gap-3">
              {processes.map((process) => {
                const color = processColors.get(process.pid) || '#3b82f6';
                return (
                  <div key={process.pid} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-600 text-sm">{process.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-yellow-600">⚡</span>
              CPU Operations
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow" />
                <span className="text-slate-600">Internal CPU events</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Hover over yellow markers to see operation details at specific execution times
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function calculateEventMarkers(
  process: Process,
  block: GanttBlock,
  executes: Execute[]
): Array<{ absoluteTime: number; comment: string }> {
  const markers: Array<{ absoluteTime: number; comment: string }> = [];

 
  const processExecutes = executes.filter(e => e.p.pid === process.pid && e.ts <= block.startTime);
  
  let executionTimeBeforeBlock = 0;
  processExecutes.forEach(e => {
    if (e.te <= block.startTime) {
      executionTimeBeforeBlock += (e.te - e.ts);
    }
  });

  const duration = block.endTime - block.startTime;
  const blockExecutionStart = executionTimeBeforeBlock;
  const blockExecutionEnd = executionTimeBeforeBlock + duration;

  process.events.forEach(evt => {
    if (evt.t >= blockExecutionStart && evt.t < blockExecutionEnd) {
      const relativeExecutionTime = evt.t - blockExecutionStart;
      const absoluteTime = block.startTime + relativeExecutionTime;
      markers.push({
        absoluteTime,
        comment: evt.comment,
      });
    }
  });

  return markers;
}


interface EventSegmentProps {
  block: GanttBlock;
  startX: number;
  width: number;
  color: string;
  isRunning: boolean;
  duration: number;
  cpuEventMarkers: Array<{ absoluteTime: number; comment: string }>;
}

function EventSegment({
  block,
  startX,
  width,
  color,
  isRunning,
  duration,
  cpuEventMarkers,
}: EventSegmentProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  return (
    <>
    
      {showTooltip && hoveredMarker === null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-2xl border border-slate-700 z-[100] whitespace-nowrap pointer-events-none"
          style={{
            left: `${startX + width / 2}px`,
            top: '-60px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="space-y-1">
            <div>
              <strong>Process:</strong> {block.name}
            </div>
            <div>
              <strong>Start:</strong> t={block.startTime} | <strong>End:</strong> t={block.endTime}
            </div>
            <div>
              <strong>Duration:</strong> {duration} units
            </div>
          </div>
          <div className="absolute w-2 h-2 bg-slate-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1 border-b border-r border-slate-700" />
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: isRunning ? [1, 1.03, 1] : 1,
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 0.6,
            repeat: isRunning ? Infinity : 0,
            repeatType: 'reverse',
          },
          opacity: { duration: 0.3 },
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`absolute rounded-lg overflow-visible group cursor-pointer opacity-90 border-2 ${
          isRunning ? 'ring-4 ring-yellow-400 shadow-xl z-20' : 'shadow-md z-10'
        }`}
        style={{
          left: `${startX}px`,
          width: `${width}px`,
          height: `${ROW_HEIGHT - 24}px`,
          top: '12px',
          backgroundColor: color,
          borderColor: isRunning ? '#fbbf24' : color,
        }}
      >
        <div className="h-full flex flex-col items-center justify-center text-white px-2 relative z-10">
          <div className="text-xs font-medium truncate w-full text-center">
            Execution
          </div>
          <div className="text-xs opacity-90 mt-0.5 font-mono">{duration}u</div>
        </div>

        {cpuEventMarkers.map((marker, idx) => {
          const markerX = (marker.absoluteTime - block.startTime) * PX_PER_UNIT;
          const isHovered = hoveredMarker === idx;
          return (
            <div
              key={idx}
              className="relative"
              style={{ pointerEvents: 'auto' }}
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-300 opacity-80 z-20 origin-top pointer-events-none"
                style={{ left: `${markerX}px` }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1.5 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg cursor-pointer z-40"
                style={{ left: `${markerX - 8}px` }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(idx);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(null);
                }}
                title={marker.comment}
              >
                {isHovered && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute inset-0 bg-yellow-400 rounded-full pointer-events-none"
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {cpuEventMarkers.map((marker, idx) => {
        const markerX = (marker.absoluteTime - block.startTime) * PX_PER_UNIT;
        const isHovered = hoveredMarker === idx;

        if (!isHovered) return null;

        return (
          <motion.div
            key={`tooltip-${idx}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bg-yellow-600 text-white text-xs rounded-lg px-3 py-2 shadow-2xl border border-yellow-500 z-[100] whitespace-nowrap pointer-events-none"
            style={{
              left: `${startX + markerX - 70}px`,
              top: '-50px',
              minWidth: '140px',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-200">⚡</span>
              <strong>CPU Operation</strong>
            </div>
            <div className="text-[11px] space-y-1">
              <div>{marker.comment}</div>
              <div className="text-yellow-200">
                Time: {marker.absoluteTime.toFixed(1)}
              </div>
            </div>
            <div
              className="absolute w-2 h-2 bg-yellow-600 transform rotate-45 border-b border-r border-yellow-500"
              style={{
                bottom: '-4px',
                left: '70px',
              }}
            />
          </motion.div>
        );
      })}
    </>
  );
}