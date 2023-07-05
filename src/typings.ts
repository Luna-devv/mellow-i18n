import { FastifyReply, FastifyRequest } from "fastify";

export interface Route { run: RouteRun<unknown> }
export type RouteRun<T> = (request: FastifyRequest, reply: FastifyReply) => Promise<T | RouteErrorResponse | undefined>;
export interface RouteErrorResponse {
    statusCode: number;
    message: string;
}