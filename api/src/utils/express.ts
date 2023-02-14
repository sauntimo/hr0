import { Response } from "express";

export type ExpressResponse<T = never, U = never, V = never> = Response<
  unknown,
  { sub: string; body: T; params: U; query: V }
>;
