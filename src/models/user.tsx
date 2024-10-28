import { CompanyResponseScheme } from "./company";
import { DepartmentResponseScheme } from "./department";
import { LocationResponseScheme } from "./location";

export enum Role {
  Admin = "admin",
  Manager = "manager",
  User = "user",
}

export interface UserCreateScheme {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  notes?: string | null;
  location_id?: number | null;
  company_id?: number | null;
  department_id?: number | null;
}


export interface UserLoginScheme {
  email: string;
  password: string;
}


export interface UserResponseScheme {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
  notes?: string | null;
  company?: CompanyResponseScheme | null;
  location?: LocationResponseScheme | null;
  department?: DepartmentResponseScheme | null;
  is_active: boolean;
}


export interface UserUpdateScheme {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  notes?: string | null;
  location_id?: number | null;
  company_id?: number | null;
  department_id?: number | null;
  is_active?: boolean;
}

export interface UsersResponseScheme {
  total_pages: number;
  data: UserResponseScheme[];
}