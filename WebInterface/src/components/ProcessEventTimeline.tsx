import { motion } from 'motion/react';
import { Execute } from '../utils/types';
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { GANTT_CONSTANTS } from '../utils/constants';

interface ProcessEventTimelineProps {
  executes: Execute[];
  processColors: Map<number, string>;
  currentTime: number;
}

const { PX_PER_UNIT } = GANTT_CONSTANTS;

export function ProcessEventTimeline({
  executes,
  processColors,
  currentTime,
}: ProcessEventTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<{
    pid: number;
    eventIndex: number;
  } | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-800">CPU Internal Events</h2>
          <p className="text-sm text-slate-600">Events positioned by backend execution time (ti)</p>
        </div>
      </div>

      <div className="space-y-6">
        {executes.map((execute) => {
          const color = processColors.get(execute.p.pid) || '#3b82f6';
          
          const duration = execute.te - execute.ts;
          const timelineWidth = duration * PX_PER_UNIT;

          return (
            <motion.div
              key={execute.p.pid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-x-hidden"
            >
              
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-5 h-5 rounded-md shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <div className="text-sm font-semibold text-slate-800">{execute.p.name}</div>
                  <div className="text-xs text-slate-500">
                    From {execute.ts} → {execute.te} • {execute.event_count} event{execute.event_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              
              <div className="relative overflow-x-auto pb-2">
                <div
                  className="relative h-12 bg-slate-100 rounded-lg border border-slate-300 shadow-inner"
                  style={{ width: `${timelineWidth}px`, minWidth: '300px' }}
                >
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-60 rounded-lg" />

                  {Array.from({ length: duration + 1 }).map((_, i) => {
                    const absoluteTime = execute.ts + i;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-slate-300"
                        style={{ left: `${i * PX_PER_UNIT}px` }}
                      >
                        <span className="absolute -bottom-5 -left-2 text-xs text-slate-500">
                          {absoluteTime}
                        </span>
                      </div>
                    );
                  })}

               
                  {execute.events.map((event, index) => {
                   
                    const relativePosition = (event.t - execute.ts) * PX_PER_UNIT;
                    const isHovered =
                      hoveredEvent?.pid === execute.p.pid &&
                      hoveredEvent?.eventIndex === index;
                    const isActive = currentTime === event.t;

                    return (
                      <div key={index}>
                       
                        <motion.div
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute top-0 bottom-0 w-1 cursor-pointer transform origin-top"
                          style={{
                            left: `${relativePosition - 2}px`,
                            backgroundColor: isActive ? '#10b981' : color,
                            boxShadow: isActive
                              ? '0 0 10px rgba(16, 185, 129, 0.5)'
                              : isHovered
                              ? '0 0 8px rgba(0, 0, 0, 0.3)'
                              : 'none',
                            zIndex: isHovered || isActive ? 20 : 10,
                          }}
                          onMouseEnter={() =>
                            setHoveredEvent({ pid: execute.p.pid, eventIndex: index })
                          }
                          onMouseLeave={() => setHoveredEvent(null)}
                        />

                      
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
                            left: `${relativePosition - 6}px`,
                            backgroundColor: isActive ? '#10b981' : color,
                            zIndex: isHovered || isActive ? 20 : 10,
                          }}
                          onMouseEnter={() =>
                            setHoveredEvent({ pid: execute.p.pid, eventIndex: index })
                          }
                          onMouseLeave={() => setHoveredEvent(null)}
                        />

                        {(isHovered || isActive) && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-[-50px] px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-30"
                            style={{
                              left: `${relativePosition - 60}px`,
                              minWidth: '120px',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-300">⚡</span>
                              <span className="font-medium">{event.comment}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Time: {event.t}
                            </div>
                          
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

                  {currentTime >= execute.ts && currentTime <= execute.te && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-lg z-30 pointer-events-none"
                      style={{
                        left: `${(currentTime - execute.ts) * PX_PER_UNIT}px`,
                      }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>
                  )}
                </div>

                <div className="text-xs text-slate-400 mt-6 text-center">
                  Timeline scale: 1 unit = {PX_PER_UNIT}px
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}