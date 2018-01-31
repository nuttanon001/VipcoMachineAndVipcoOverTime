export interface FormErrors {
    [id: string]: string;
}

export interface ValidationMaster {
    [id: string]: FormErrors;
}

export interface ValidationResult {
    [id: string]: boolean;
}