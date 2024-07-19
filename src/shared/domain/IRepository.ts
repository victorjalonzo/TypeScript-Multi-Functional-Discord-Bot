export interface IRepository <T> {
    create(data: Record<string, any>): Promise<T>
    update(filters: Record<string, any>, data: Record<string, any>): Promise<T | null>
    delete(filters: Record<string, any>): Promise<Record<string, any>>
    get(filters?: Record<string, any>): Promise<T | null>
    getAll(filters?: Record<string, any>): Promise<T[] | null>
}