import { CompanyResponseScheme } from "./company";
import { LocationResponseScheme } from "./location";  
import { ModelResponseScheme } from "./model";
import { SupplierResponseScheme } from "./supplier";
import { UserResponseScheme } from "./user";

export enum Status {
    Available = "available",
    CheckedOut = "checked_out",
    Reserved = "reserved",
    Broken = "broken",
    Lost = "lost",
    Archived = "archived",
  }
  
export interface AssetCreateScheme {
    name: string | null;
    serial_number: string;
    status: Status;
    checkout_type?: CheckoutType | null;
    purchase_date?: string | null;
    purchase_cost?: number | null;
    invoice_number?: string | null;
    varrianty_expiration_date?: string | null;
    notes?: string | null;
    location_id?: number | null;
    company_id?: number | null;
    supplier_id?: number | null;
    model_id?: number | null;
    user_id?: number | null;
  }
  
  
  export interface AssetResponseScheme {
    id: number;
    name: string;
    serial_number: string;
    status: Status;
    checkout_type?: CheckoutType | null;
    purchase_date?: string | null;
    purchase_cost?: number | null;
    invoice_number?: string | null;
    varrianty_expiration_date?: string | null;
    notes?: string | null;
    company?: CompanyResponseScheme | null;
    supplier?: SupplierResponseScheme | null;
    user?: UserResponseScheme | null;
    asset?: AssetResponseScheme | null;
    model?: ModelResponseScheme | null;
    location?: LocationResponseScheme | null;
  }
  
  
  export interface AssetUpdateScheme {
    name?: string | null;
    serial_number?: string | null;
    status?: Status | null;
    checkout_type?: CheckoutType | null;
    purchase_date?: string | null;
    purchase_cost?: number | null;
    invoice_number?: string | null;
    varrianty_expiration_date?: string | null;
    notes?: string | null;
    model_id?: number | null;
    supplier_id?: number | null;
    location_id?: number | null;
    company_id?: number | null;
    user_id?: number | null;
  }

  export interface AssetsResponseScheme {
    total_pages: number;
    data: AssetResponseScheme[];
  }

  export enum CheckoutType {
    User = "user",
    Asset = "asset",
    Location = "location",
  }