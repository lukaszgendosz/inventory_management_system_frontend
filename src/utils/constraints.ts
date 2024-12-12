export const BASE_URL = 'http://localhost:5000';

export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
  }
export interface baseQueryParams {
    page: number | undefined;
    page_size: number | undefined;
    search: string | undefined;
    order_by: string | undefined;
    sort_order: SortOrder | undefined;
  }

export enum EventType {
    CHECKOUT = "checkout",
    CHECKIN = "checkin",
    UPDATE = "update",
    DELETE = "delete",
    CREATE = "create",
  }
