import { motion } from 'motion/react';
import { Process } from '../App';
import { Activity } from 'lucide-react';
import { useState } from 'react';

interface ProcessEventTimelineProps {
  processes: Process[];
  processColors: Map<string, string>;
  currentTime: number;
}

export function ProcessEventTimeline({
  processes,
  processColors,
  currentTime,
}: ProcessEventTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<{
    processId: string;
    eventIndex: number;
  } | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-slate-800">CPU Internal Events</h2>
          <p className="text-slate-600">Hover over markers to view operations</p>
        </div>
      </div>

      <div className="space-y-6">
        {processes.map((process) => {
          const color = processColors.get(process.id) || '#3b82f6';
          const timelineWidth = process.burstTime * 40; // 40px per time unit

          return (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Process Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-5 h-5 rounded-md shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <div className="text-slate-800">{process.id}</div>
                  <div className="text-xs text-slate-500">
                    {process.events.length} operation{process.events.length !== 1 ? 's' : ''} • Burst: {process.burstTime} units
                  </div>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="relative overflow-x-auto pb-2">
                <div
                  className="relative h-12 bg-slate-100 rounded-lg border border-slate-300 shadow-inner"
                  style={{ width: `${timelineWidth}px`, minWidth: '300px' }}
                >
                  {/* Timeline track */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-60 rounded-lg" />
                  
                  {/* Time markers */}
                  {Array.from({ length: process.burstTime + 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-slate-300"
                      style={{ left: `${i * 40}px` }}
                    >
                      <span className="absolute -bottom-5 -left-2 text-xs text-slate-500">
                        {i}
                      </span>
                    </div>
                  ))}

                  {/* Event markers */}
                  {process.events.map((event, index) => {
                    const position = event.time * 40;
                    const isHovered =
                      hoveredEvent?.processId === process.id &&
                      hoveredEvent?.eventIndex === index;
                    const isActive = currentTime >= event.time && currentTime < event.time + 0.5;

                    return (
                      <div key={index}>
                        {/* Event marker line */}
                        <motion.div
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute top-0 bottom-0 w-1 cursor-pointer transform origin-top"
                          style={{
                            left: `${position - 2}px`,
                            backgroundColor: isActive ? '#10b981' : color,
                            boxShadow: isActive
                              ? '0 0 10px rgba(16, 185, 129, 0.5)'
                              : isHovered
                              ? '0 0 8px rgba(0, 0, 0, 0.3)'
                              : 'none',
                            zIndex: isHovered || isActive ? 20 : 10,
                          }}
                          onMouseEnter={() =>
                            setHoveredEvent({ processId: process.id, eventIndex: index })
                          }
                          onMouseLeave={() => setHoveredEvent(null)}
                        />

                        {/* Event marker dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{
                            scale: isHovered || isActive ? 1.3 : 1,
                            y: isActive ? [0, -3, 0] : 0,
                          }}
                          transition={{
                            scale: { duration: 0.2 },
                            y: { duration: 0.5, repeat: isActive ? Infinity : 0 },
                          }}
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer"
                          style={{
                            left: `${position - 6}px`,
                            backgroundColor: isActive ? '#10b981' : color,
                            zIndex: isHovered || isActive ? 20 : 10,
                          }}
                          onMouseEnter={() =>
                            setHoveredEvent({ processId: process.id, eventIndex: index })
                          }
                          onMouseLeave={() => setHoveredEvent(null)}
                        />

                        {/* Tooltip on hover or active */}
                        {(isHovered || isActive) && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-[-45px] px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-30"
                            style={{
                              left: `${position - 60}px`,
                              minWidth: '120px',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-300">⚡</span>
                              <span>{event.operation}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Time: {event.time}
                            </div>
                            {/* Tooltip arrow */}
                            <div
                              className="absolute w-2 h-2 bg-slate-900 transform rotate-45"
                              style={{
                                bottom: '-4px',
                                left: '50%',
                                marginLeft: '-4px',
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* Current time indicator (for animation) */}
                  {currentTime >= 0 && currentTime <= process.burstTime && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-lg z-30 pointer-events-none"
                      style={{
                        left: `${currentTime * 40}px`,
                      }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>
                  )}
                </div>

                {/* Scale label */}
                <div className="text-xs text-slate-400 mt-6 text-center">
                  Timeline scale: 1 unit = 40px
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
