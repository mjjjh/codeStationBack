declare namespace API {
  type Result<T> = {
    success: boolean;
    errorMessage: string;
    data: T;
  };
}
