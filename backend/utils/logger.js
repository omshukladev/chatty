import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, printf } = format;

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Set the log level based on the environment
// In development → log everything (debug + info + warn + error)
// In production → log only warnings & errors (less noisy)
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "warn";
};

// Custom format for console logging with colors
// Console format → colored, readable
// File format → JSON (machine-readable for analysis)
// You’re writing logs to:
// app.log → all logs
// error.log → only errors
const consoleLogFormat = format.combine(
  format.colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Format for file logging (JSON for better parsing)
const fileLogFormat = format.combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json());

// Create a Winston logger
const logger = createLogger({
  level: level(),
  levels,
  format: fileLogFormat,
  transports: [
    // Write logs to console
    new transports.Console({
      format: consoleLogFormat,
    }),
    // Write all logs with level 'info' and below to app.log
    new transports.File({ filename: "app.log" }),
    // Write only error logs to error.log
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

// Add colors to Winston logger
format.colorize().addColors(colors);

export default logger;
