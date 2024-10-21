import { Role } from "./user";

export interface TokenResponseScheme {
    access_token: string;
    refresh_token: string;
    role: Role
  }