import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Process, CPUEvent } from "../utils/types";
import { CPU_OPERATIONS } from "../utils/constants";

interface ProcessTableProps {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
}

export function ProcessTable({ processes, setProcesses }: ProcessTableProps) {
  const [editingPid, setEditingPid] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Process>>({});

  const addProcess = () => {
    const newPid = processes.length > 0 ? Math.max(...processes.map(p => p.pid)) + 1 : 1;
    const newProcess: Process = {
      pid: newPid,
      ppid: 0,
      name: `P${newPid}`,
      arrival: 0,
      exec_time: 5,
      rem_time: 5,
      priority: 1,
      nbEvents: 1,
      events: [{ t: 2, comment: "Calculate A + B" }],
    };
    setProcesses([...processes, newProcess]);
    setEditingPid(newPid);
    setEditForm(newProcess);
  };

  const deleteProcess = (pid: number) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
    if (editingPid === pid) {
      setEditingPid(null);
      setEditForm({});
    }
  };

  const startEditing = (process: Process) => {
    setEditingPid(process.pid);
    setEditForm({ ...process });
  };

  const cancelEditing = () => {
    setEditingPid(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingPid && editForm) {
      const updatedProcess = {
        ...editForm,
        rem_time: editForm.exec_time || 0,
        nbEvents: (editForm.events || []).length,
      } as Process;

      setProcesses(
        processes.map((p) => (p.pid === editingPid ? updatedProcess : p)),
      );
      setEditingPid(null);
      setEditForm({});
    }
  };

  const updateEvent = (index: number, field: keyof CPUEvent, value: string | number) => {
    const newEvents = [...(editForm.events || [])];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEditForm({ ...editForm, events: newEvents });
  };

  const addEvent = () => {
    const maxTime = editForm.exec_time || 5;
    const newTime = Math.min(
      Math.floor(Math.random() * (maxTime - 1)) + 1,
      maxTime - 1,
    );
    const newEvents = [
      ...(editForm.events || []),
      { t: newTime, comment: "Calculate A + B" },
    ];
    newEvents.sort((a, b) => a.t - b.t);
    setEditForm({ ...editForm, events: newEvents });
  };

  const removeEvent = (index: number) => {
    const newEvents = (editForm.events || []).filter((_, i) => i !== index);
    setEditForm({ ...editForm, events: newEvents });
  };

  return (
    <div className="space-y-4">
      {processes.map((process) => (
        <div
          key={process.pid}
          className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
        >
          {editingPid === process.pid ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 text-sm mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-1">
                    Arrival
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.arrival || 0}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        arrival: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.priority || 1}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm mb-1">
                    Exec Time
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.exec_time || 0}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        exec_time: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <h4 className="text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">◆</span>
                  CPU Operations List
                </h4>
                <div className="space-y-2 mb-3">
                  {(editForm.events || []).map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <select
                        value={event.comment}
                        onChange={(e) =>
                          updateEvent(index, "comment", e.target.value)
                        }
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
                        max={editForm.exec_time || 5}
                        value={event.t}
                        onChange={(e) =>
                          updateEvent(
                            index,
                            "t",
                            parseInt(e.target.value) || 1,
                          )
                        }
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-slate-800 font-medium">{process.name}</div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    Arrival: {process.arrival}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                    Priority: {process.priority}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    Exec: {process.exec_time}
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
                    onClick={() => deleteProcess(process.pid)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    title="Delete process"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pl-4 space-y-1">
                {process.events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="text-blue-500">◆</span>
                    <span>{event.comment}</span>
                    <span className="text-slate-400">—</span>
                    <span className="px-2 py-0.5 bg-slate-200 rounded text-xs">
                      t={event.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

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