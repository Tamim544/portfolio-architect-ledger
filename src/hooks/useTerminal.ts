import { useState, useCallback } from 'react';

type Log = {
  type: 'input' | 'output' | 'error';
  content: string;
};

export const useTerminal = () => {
  const [logs, setLogs] = useState<Log[]>([
    { type: 'output', content: 'SYSTEM INITIALIZED. TYPE "HELP" FOR COMMANDS.' },
  ]);

  const executeCommand = useCallback((cmd: string) => {
    const command = cmd.toLowerCase().trim();
    setLogs((prev) => [...prev, { type: 'input', content: cmd }]);

    switch (command) {
      case 'help':
        setLogs((prev) => [
          ...prev,
          { type: 'output', content: 'AVAILABLE COMMANDS: HELP, LS, CLEAR, INSPECT <PROJECT_ID>, SYSTEM' },
        ]);
        break;
      case 'ls':
        setLogs((prev) => [
          ...prev,
          { type: 'output', content: 'projects/  skills/  contact.txt  resume.pdf' },
        ]);
        break;
      case 'clear':
        setLogs([]);
        break;
      case 'system':
        setLogs((prev) => [
          ...prev,
          { type: 'output', content: 'OS: ARCHITECT_LEDGER_V1.0. NODE_COUNT: 5. UPTIME: 99.9%' },
        ]);
        break;
      default:
        if (command.startsWith('inspect ')) {
          const id = command.split(' ')[1];
          setLogs((prev) => [
            ...prev,
            { type: 'output', content: `FETCHING DATA FOR ${id.toUpperCase()}... SUCCESS.` },
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            { type: 'error', content: `COMMAND NOT FOUND: ${command}` },
          ]);
        }
    }
  }, []);

  return { logs, executeCommand };
};
