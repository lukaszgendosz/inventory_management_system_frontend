export interface LocationCreateScheme {
    name: string;
  }
  
  
export interface LocationResponseScheme {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}


export interface LocationUpdateScheme {
  name: string;
}

export interface LocationsResponseScheme {
  total_pages: number;
  data: LocationResponseScheme[];
}
  