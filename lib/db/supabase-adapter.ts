import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DbAdapter,
  DbResult,
  FindOptions,
  FindManyOptions,
  FilterOptions,
  Filter,
} from "./types";

/**
 * Applies an array of Filter objects to a Supabase query builder.
 */
function applyFilters(query: any, filters?: Filter[]) {
  if (!filters?.length) return query;

  for (const f of filters) {
    switch (f.operator) {
      case "eq":
        query = query.eq(f.column, f.value);
        break;
      case "neq":
        query = query.neq(f.column, f.value);
        break;
      case "gt":
        query = query.gt(f.column, f.value);
        break;
      case "gte":
        query = query.gte(f.column, f.value);
        break;
      case "lt":
        query = query.lt(f.column, f.value);
        break;
      case "lte":
        query = query.lte(f.column, f.value);
        break;
      case "in":
        query = query.in(f.column, f.value as unknown[]);
        break;
      case "like":
        query = query.like(f.column, f.value);
        break;
      case "ilike":
        query = query.ilike(f.column, f.value);
        break;
    }
  }
  return query;
}

/**
 * Creates a DbAdapter backed by a Supabase client instance.
 *
 * Works with both the server client (`createClient` from server.ts)
 * and the browser client (`getClient` from client.ts).
 */
export function createSupabaseAdapter(client: SupabaseClient): DbAdapter {
  return {
    // ── findOne ────────────────────────────────────────────
    async findOne<T>(table: string, opts: FindOptions): Promise<DbResult<T>> {
      let query = client.from(table).select(opts.select ?? "*");
      query = applyFilters(query, opts.filters);
      const { data, error } = await query.single();

      return {
        data: error ? null : (data as T),
        error: error?.message ?? null,
      };
    },

    // ── findMany ──────────────────────────────────────────
    async findMany<T>(
      table: string,
      opts?: FindManyOptions,
    ): Promise<DbResult<T[]>> {
      let query = client.from(table).select(opts?.select ?? "*");
      query = applyFilters(query, opts?.filters);

      if (opts?.orderBy) {
        for (const o of opts.orderBy) {
          query = query.order(o.column, {
            ascending: o.ascending ?? true,
          });
        }
      }

      if (opts?.limit) {
        query = query.limit(opts.limit);
      }

      if (opts?.offset) {
        query = query.range(opts.offset, opts.offset + (opts.limit ?? 50) - 1);
      }

      const { data, error } = await query;

      return {
        data: error ? null : (data as T[]),
        error: error?.message ?? null,
      };
    },

    // ── create ─────────────────────────────────────────────
    async create<T>(table: string, data: Partial<T>): Promise<DbResult<T>> {
      const { data: row, error } = await client
        .from(table)
        .insert(data as any)
        .select()
        .single();

      return {
        data: error ? null : (row as T),
        error: error?.message ?? null,
      };
    },

    // ── update ─────────────────────────────────────────────
    async update<T>(
      table: string,
      data: Partial<T>,
      opts: FilterOptions,
    ): Promise<DbResult<T>> {
      let query = client.from(table).update(data as any);
      query = applyFilters(query, opts.filters);
      const { data: row, error } = await query.select().single();

      return {
        data: error ? null : (row as T),
        error: error?.message ?? null,
      };
    },

    // ── delete ─────────────────────────────────────────────
    async delete(table: string, opts: FilterOptions): Promise<DbResult<null>> {
      let query = client.from(table).delete();
      query = applyFilters(query, opts.filters);
      const { error } = await query;

      return {
        data: null,
        error: error?.message ?? null,
      };
    },

    // ── upsert ─────────────────────────────────────────────
    async upsert<T>(table: string, data: Partial<T>): Promise<DbResult<T>> {
      const { data: row, error } = await client
        .from(table)
        .upsert(data as any)
        .select()
        .single();

      return {
        data: error ? null : (row as T),
        error: error?.message ?? null,
      };
    },
  };
}
