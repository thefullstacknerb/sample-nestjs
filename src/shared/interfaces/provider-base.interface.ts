export interface ProviderBase<T> {
  /** Create new item */
  create(body: any, ...args: any[]): Promise<Partial<T>>;

  /** Fetch multiple items */
  findMany(query?: any): Promise<Partial<T>[]>;

  /** Fetch one item by Id */
  findOne(id: number, query?: any): Promise<Partial<T>>;

  /** Update item */
  update(id: number, body: any, ...args: any[]): Promise<Partial<T>>;
}
