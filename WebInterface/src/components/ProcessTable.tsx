import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Process, CPUEvent } from '../App';

interface ProcessTableProps {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
}

// CPU operations for dropdown
const CPU_OPERATIONS = [
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
];

export function ProcessTable({ processes, setProcesses }: ProcessTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Process>>({});

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    const newProcess: Process = {
      id: newId,
      arrivalTime: 0,
      burstTime: 5,
      priority: 1,
      remainingTime: 5,
      events: [{ time: 2, operation: 'Calculate A + B' }],
    };
    setProcesses([...processes, newProcess]);
    setEditingId(newId);
    setEditForm(newProcess);
  };

  const deleteProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const startEditing = (process: Process) => {
    setEditingId(process.id);
    setEditForm({ ...process });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingId && editForm) {
      const updatedProcess = {
        ...editForm,
        remainingTime: editForm.burstTime || 0,
      } as Process;

      setProcesses(
        processes.map((p) => (p.id === editingId ? updatedProcess : p))
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const updateEvent = (index: number, field: keyof CPUEvent, value: any) => {
    const newEvents = [...(editForm.events || [])];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEditForm({ ...editForm, events: newEvents });
  };

  const addEvent = () => {
    const maxTime = editForm.burstTime || 5;
    const newTime = Math.min(Math.floor(Math.random() * (maxTime - 1)) + 1, maxTime - 1);
    const newEvents = [...(editForm.events || []), { time: newTime, operation: 'Calculate A + B' }];
    newEvents.sort((a, b) => a.time - b.time);
    setEditForm({ ...editForm, events: newEvents });
  };

  const removeEvent = (index: number) => {
    const newEvents = (editForm.events || []).filter((_, i) => i !== index);
    setEditForm({ ...editForm, events: newEvents });
  };

  return (
    <div className="space-y-4">
      {/* Process Cards */}
      <div className="space-y-3">
        {processes.map((process) => (
          <div key={process.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            {editingId === process.id ? (
              // Edit Mode
              <div className="space-y-4">
                {/* Header Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Process ID</label>
                    <input
                      type="text"
                      value={editForm.id || ''}
                      onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Arrival</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.arrivalTime || 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, arrivalTime: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Priority</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.priority || 1}
                      onChange={(e) =>
                        setEditForm({ ...editForm, priority: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Burst Time</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.burstTime || 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, burstTime: parseInt(e.target.value) || 1 })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Event List */}
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <h4 className="text-slate-700 mb-3 flex items-center gap-2">
                    <span className="text-blue-600">●</span>
                    CPU Operations List
                  </h4>
                  <div className="space-y-2 mb-3">
                    {(editForm.events || []).map((event, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <select
                          value={event.operation}
                          onChange={(e) => updateEvent(index, 'operation', e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded text-sm flex-1"
                        >
                          {CPU_OPERATIONS.map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-400 text-xs">@t=</span>
                        <input
                          type="number"
                          min="1"
                          max={editForm.burstTime || 5}
                          value={event.time}
                          onChange={(e) => updateEvent(index, 'time', parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-sm text-center"
                        />
                        <button
                          onClick={() => removeEvent(index)}
                          className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                          title="Remove event"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addEvent}
                    className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Event
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={saveEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-800">{process.id}</div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      Arrival: {process.arrivalTime}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      Priority: {process.priority}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      Burst: {process.burstTime}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(process)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                      title="Edit process"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProcess(process.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Delete process"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Event List Display */}
                <div className="pl-4 space-y-1">
                  {process.events.map((event, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-blue-500">●</span>
                      <span>{event.operation}</span>
                      <span className="text-slate-400">—</span>
                      <span className="px-2 py-0.5 bg-slate-200 rounded">({event.time})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addProcess}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors border-2 border-dashed border-blue-300"
      >
        <Plus className="w-5 h-5" />
        Add Process
      </button>
    </div>
  );
}