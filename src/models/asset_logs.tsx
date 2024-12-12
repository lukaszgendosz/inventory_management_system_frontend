import { EventType } from "../utils/constraints";
import { AssetResponseScheme } from "./asset";
import { UserResponseScheme } from "./user";

export interface AssetLogResponseScheme {
    id: number;
    event_type: EventType;
    updated_values?: JSON;
    user?: UserResponseScheme | null;
    asset?: AssetResponseScheme | null;
    created_at: Date;
  }