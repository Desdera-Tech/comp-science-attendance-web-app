export type ApiEnvelope<T> = {
  message: string;
  data?: T;
  error?: string;
};
