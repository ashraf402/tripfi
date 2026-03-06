import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export type SanitizeContext = "text" | "email" | "name" | "chat" | "search";

export interface SanitizeResult {
  value: string;
  isClean: boolean;
  threat?: string;
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|prior)\s+instructions/i,
  /you\s+are\s+now\s+(dan|jailbreak|unrestricted)/i,
  /forget\s+(your|all|previous)\s+(instructions|prompt|rules)/i,
  /act\s+as\s+(an?\s+)?(unrestricted|unfiltered|evil|dan)/i,
  /new\s+(system\s+)?prompt:/i,
  /\bsystem\s*:\s*new\b/i,
  /disregard\s+(your|all|previous)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(unrestricted|unfiltered)/i,
  /override\s+(your\s+)?(instructions|rules|guidelines)/i,
  /bypass\s+(your\s+)?(restrictions|filters|guidelines)/i,
  /\bjailbreak\b/i,
  /do\s+anything\s+now/i,
];

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
  /(--|;|\/\*|\*\/)/,
  /'\s*(OR|AND)\s*'?\d/i,
];

const PATH_TRAVERSAL_PATTERNS = [/\.\.(\/|\\)/, /%2e%2e(%2f|%5c)/i];

export function sanitize(
  input: string,
  context: SanitizeContext = "text",
): SanitizeResult {
  if (!input || typeof input !== "string") {
    return { value: "", isClean: true };
  }

  // Step 1: Strip HTML and scripts via DOMPurify
  let clean = purify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();

  // Step 2: Context-specific handling
  switch (context) {
    case "email":
      clean = clean.toLowerCase().replace(/[^a-z0-9@._+-]/g, "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
        return { value: "", isClean: false, threat: "invalid_email" };
      }
      break;

    case "name":
      clean = clean.replace(/[^a-zA-Z\s'\-.]/g, "").slice(0, 100);
      break;

    case "chat":
      for (const pattern of PROMPT_INJECTION_PATTERNS) {
        if (pattern.test(clean)) {
          return { value: "", isClean: false, threat: "prompt_injection" };
        }
      }
      for (const pattern of SQL_INJECTION_PATTERNS) {
        if (pattern.test(clean)) {
          return {
            value: clean.replace(/['";\-\*\/]/g, ""),
            isClean: false,
            threat: "sql_injection",
          };
        }
      }
      clean = clean.slice(0, 2000);
      break;

    case "search":
      clean = clean.replace(/[<>'"`;]/g, "").slice(0, 200);
      break;

    case "text":
    default:
      for (const pattern of PATH_TRAVERSAL_PATTERNS) {
        if (pattern.test(clean)) {
          return { value: "", isClean: false, threat: "path_traversal" };
        }
      }
      clean = clean.slice(0, 1000);
      break;
  }

  return { value: clean, isClean: true };
}

export function sanitizeChat(input: string): SanitizeResult {
  return sanitize(input, "chat");
}

export function sanitizeEmail(input: string): SanitizeResult {
  return sanitize(input, "email");
}

export function sanitizeName(input: string): SanitizeResult {
  return sanitize(input, "name");
}

export function sanitizeText(input: string): SanitizeResult {
  return sanitize(input, "text");
}
