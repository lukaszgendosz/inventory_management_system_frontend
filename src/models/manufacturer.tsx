export interface ManufacturerCreateScheme {
    name: string;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
}
  
  
  export interface ManufacturerResponseScheme {
    id: number;
    name: string;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }
  
  
  export interface ManufacturerUpdateScheme {
    name?: string | null;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
  }

  export interface ManufacturersResponseScheme {
    total_pages: number;
    data: ManufacturerResponseScheme[];
  }