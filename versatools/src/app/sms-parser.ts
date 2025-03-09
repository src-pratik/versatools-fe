export interface SmsPattern {
    source: string;
    name: string;
    valueKeys: string[]; // Stores expected named groups
    regex: RegExp;
  }
  
  export interface SmsParseResult {
    source: string;
    data: Record<string, string>;
  }
  
  export class SmsParser {
    constructor(private readonly patterns: readonly SmsPattern[]) {}
  
    parse(sms: string): SmsParseResult | null {
      for (let i = 0, len = this.patterns.length; i < len; i++) {
        const pattern = this.patterns[i];
        const match = pattern.regex.exec(sms);
        if (match?.groups) {
          // Allocate only necessary keys
          const data: Record<string, string> = Object.create(null);
          for (let j = 0, keysLen = pattern.valueKeys.length; j < keysLen; j++) {
            const key = pattern.valueKeys[j];
            const value = match.groups[key];
            if (value) data[key] = value;
          }
          return { source: pattern.source, data };
        }
      }
      return null;
    }
  } 