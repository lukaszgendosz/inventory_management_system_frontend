import { ManufacturerResponseScheme } from "./manufacturer";

export interface ModelCreateScheme {
    name: string;
    model_number?: string | null;
    notes?: string | null;
    manufacturer_id?: number | null;
}

export interface ModelResponseScheme {
    id: number;
    name: string;
    model_number?: string | null;
    notes?: string | null;
    manufacturer?: ManufacturerResponseScheme | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface ModelUpdateScheme {
    name?: string | null;
    model_number?: string | null;
    notes?: string | null;
    manufacturer_id?: number | null;
}

export interface ModelsResponseScheme {
    total_pages: number;
    data: ModelResponseScheme[];
  }

  