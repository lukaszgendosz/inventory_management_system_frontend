export interface DepartmentCreateScheme {
    name: string;
  }
  
  export interface DepartmentResponseScheme {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  
  export interface DepartmentUpdateScheme {
    name: string;
  }