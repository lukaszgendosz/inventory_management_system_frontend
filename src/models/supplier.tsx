export interface SupplierCreateScheme {
    name: string;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
}

export interface SupplierResponseScheme {
    id: number;
    name: string;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
    created_at: string;
    updated_at: string;
}

export interface SupplierUpdateScheme {
    name?: string | null;
    support_url?: string | null;
    support_phone?: string | null;
    support_email?: string | null;
}

export interface SuppliersResponseScheme {
    total_pages: number;
    data: SupplierResponseScheme[];
  }
