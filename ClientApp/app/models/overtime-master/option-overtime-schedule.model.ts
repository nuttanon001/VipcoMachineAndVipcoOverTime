export interface OptionOverTimeSchedule {
    Filter?: string;
    GroupCode?: string;
    ProjectMasterId?: number;
    Create?: string;
    SDate?: Date;
    EDate?: Date;
    Skip?: number;
    Take?: number;
    /// <summary>
    /// Required = 1,
    /// WaitActual = 2,
    /// Complate = 3,
    /// Cancel = 4
    /// </summary>
    Status?: number;
}