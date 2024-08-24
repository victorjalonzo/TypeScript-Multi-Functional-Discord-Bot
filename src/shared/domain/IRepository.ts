export interface IRepository <T> {
    create(data: Record<string, any>): Promise<T>
    update(filters: Record<string, any>, data: Record<string, any>): Promise<T | null>
    delete(filters: Record<string, any>): Promise<T | null>
    get(filters?: Record<string, any>, populate?: string[] | string): Promise<T | null>
    getAll(filters?: Record<string, any>, populate?: string[] | string): Promise<T[]>
}