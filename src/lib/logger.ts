/**
 * Logger utility for development and production
 * Provides structured logging with different severity levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const isDevelopment = import.meta.env.DEV;

const colors = {
  debug: '#7c3aed',
  info: '#3b82f6',
  warn: '#f59e0b',
  error: '#ef4444',
};

const createLogger = () => {
  const log = (level: LogLevel, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = { timestamp, level, message, data };

    if (isDevelopment) {
      const color = colors[level];
      console.log(
        `%c[${level.toUpperCase()}]`,
        `color: ${color}; font-weight: bold;`,
        message,
        data || ''
      );
    } else {
      // In production, you might send logs to a service
      console.log(JSON.stringify(entry));
    }
  };

  return {
    debug: (message: string, data?: unknown) => log('debug', message, data),
    info: (message: string, data?: unknown) => log('info', message, data),
    warn: (message: string, data?: unknown) => log('warn', message, data),
    error: (message: string, data?: unknown) => log('error', message, data),
  };
};

export const logger = createLogger();
