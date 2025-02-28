export interface User {
  id?: number; // Optional, auto-incremented
  name: string;
  email: string;
  phone?: string;
  lastLogin?: string;
}
