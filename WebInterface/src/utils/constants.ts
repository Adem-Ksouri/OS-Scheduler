
export const CPU_OPERATIONS = [
  'Calculate A + B',
  'Store result in register',
  'Load data from memory',
  'Perform logical AND',
  'Execute bitwise shift',
  'Compare values',
  'Jump to address',
  'Push to stack',
  'Pop from stack',
  'Increment counter',
  'Decode instruction',
  'Fetch operand',
  'Write to cache',
  'Read from buffer',
  'Set flag bit',
  'Clear register',
  'Multiply operands',
  'Divide numbers',
  'Calculate checksum',
  'Update program counter',
  'Save context',
  'Load instruction',
  'Validate input',
  'Format output',
  'Allocate memory',
] as const;

export const PROCESS_COLORS = [
  '#3b82f6',
  '#8b5cf6', 
  '#ec4899',
  '#f59e0b', 
  '#10b981', 
  '#06b6d4', 
  '#f97316', 
  '#6366f1', 
] as const;


export const STATE_COLORS = {
  Ready: 'bg-blue-100 text-blue-700 border-blue-300',
  Running: 'bg-green-100 text-green-700 border-green-300',
  'Not Arrived': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Finished: 'bg-slate-100 text-slate-600 border-slate-300',
} as const;


export const GANTT_CONSTANTS = {
  PX_PER_UNIT: 40,
  LEFT_PADDING: 140,
  RIGHT_PADDING: 60,
  ROW_HEIGHT: 72,
  RULER_HEIGHT: 50,
  MIN_SEGMENT_WIDTH: 24,
} as const;

export const EVENT_STYLE = {
  opacity: 'opacity-100',
  border: 'border-2 border-solid',
} as const;