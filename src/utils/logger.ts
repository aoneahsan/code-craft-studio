/**
 * Logger utility for Code Craft Studio
 * Provides consistent logging with configurable levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  enabled?: boolean;
}

class Logger {
  private config: LoggerConfig = {
    level: 'warn',
    prefix: '[CodeCraftStudio]',
    enabled: true,
  };

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
  };

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled || this.config.level === 'none') {
      return false;
    }
    return this.levels[level] >= this.levels[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.config.prefix || '';
    return `${timestamp} ${prefix} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog('error')) {
      if (error instanceof Error) {
        console.error(this.formatMessage('error', message), error.message, error.stack, ...args);
      } else if (error) {
        console.error(this.formatMessage('error', message), error, ...args);
      } else {
        console.error(this.formatMessage('error', message), ...args);
      }
    }
  }

  /**
   * Sets the log level based on environment
   * In production, defaults to 'error' only
   * In development, defaults to 'warn'
   */
  setEnvironmentLevel(): void {
    const isProduction = process.env.NODE_ENV === 'production';
    this.configure({
      level: isProduction ? 'error' : 'warn',
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Configure based on environment on import
if (typeof process !== 'undefined' && process.env) {
  logger.setEnvironmentLevel();
}

// Export for advanced configuration
export default logger;