export interface CompanyCreateScheme {
    name: string;
  }
  
  export interface CompanyResponseScheme {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CompanyUpdateScheme {
    name: string;
  }