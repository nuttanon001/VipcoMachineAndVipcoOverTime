export interface Page {
    PageNumber?: number;
    TotalPages?: number;
    TotalElements?: number;
    Size?: number;
    SortField?: string;
    SortOrder?: number;
    Filter?: string;
}

export interface Scroll {
    Skip?: number;
    Take?: number;
    SortField?: string;
    SortOrder?: number;
    Filter?: string;
    Reload?: boolean;
    Where?: string;
    HasCondition?: boolean;
}