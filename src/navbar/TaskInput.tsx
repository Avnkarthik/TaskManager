import React, { useEffect, useState } from 'react';

interface TaskInputProps {
  onSave: (taskText: string, dueDate?: string) => void;
  onCancel: () => void;
  initialValue?: string;
  initialDate?: string;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onSave,
  onCancel,
  initialValue = '',
  initialDate = '',
}) => {
  const [input, setInput] = useState(initialValue);
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    setInput(initialValue);
    setDate(initialDate);
  }, [initialValue, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSave(input.trim(), date);
      setInput('');
      setDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a new task"
        autoFocus
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginTop: '0.5rem' }}
      />
      <button type="submit" className="inb__1">Save</button>
      <button
        type="button"
        onClick={onCancel}
        style={{ marginLeft: '0.5rem' }}
        className="inb__1"
      >
        Cancel
      </button>
    </form>
  );
};