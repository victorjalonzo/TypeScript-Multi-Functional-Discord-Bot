export class Result<T> {
    constructor(
      public readonly isSuccessOperation: boolean,
      public readonly error?: string,
      public readonly value?: T
    ) {}
  
    public static success<U>(value: U): Result<U> {
      return new Result<U>(true, undefined, value);
    }
  
    public static failure<U>(error: string): Result<U> {
      return new Result<U>(false, error);
    }

    public isSuccess(): this is Result<T> & { value: T } {
      return this.isSuccessOperation;
  }
}