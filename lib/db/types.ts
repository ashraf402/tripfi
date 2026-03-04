// Standardized DB Result
export interface DbResult<T> {
  data: T | null;
  error: string | null;
}

// Filter / Query Options
export interface Filter {
  column: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "like"
    | "ilike";
  value: unknown;
}

export interface OrderBy {
  column: string;
  ascending?: boolean;
}

export interface FindOptions {
  select?: string;
  filters?: Filter[];
}

export interface FindManyOptions extends FindOptions {
  orderBy?: OrderBy[];
  limit?: number;
  offset?: number;
}

export interface FilterOptions {
  filters: Filter[];
}

// Database Adapter Interface
export interface DbAdapter {
  /**
   * Fetch a single row from a table.
   * Returns the first matching row or null.
   */
  findOne<T = Record<string, unknown>>(
    table: string,
    opts: FindOptions,
  ): Promise<DbResult<T>>;

  /**
   * Fetch multiple rows from a table.
   * Supports filtering, ordering, and pagination.
   */
  findMany<T = Record<string, unknown>>(
    table: string,
    opts?: FindManyOptions,
  ): Promise<DbResult<T[]>>;

  /**
   * Insert a new row into a table.
   * Returns the inserted row.
   */
  create<T = Record<string, unknown>>(
    table: string,
    data: Partial<T>,
  ): Promise<DbResult<T>>;

  /**
   * Update rows matching the given filters.
   * Returns the first updated row.
   */
  update<T = Record<string, unknown>>(
    table: string,
    data: Partial<T>,
    opts: FilterOptions,
  ): Promise<DbResult<T>>;

  /**
   * Delete rows matching the given filters.
   */
  delete(table: string, opts: FilterOptions): Promise<DbResult<null>>;

  /**
   * Insert or update a row (upsert).
   * Returns the resulting row.
   */
  upsert<T = Record<string, unknown>>(
    table: string,
    data: Partial<T>,
  ): Promise<DbResult<T>>;
}
