import type { Params } from "react-router-dom";
import type { Context } from './server';

export interface LoaderFunction<D = any, C = Context> {
    (args: DataFunctionArgs<C>): Promise<Response> | Response | Promise<D> | D;
}

export interface DataFunctionArgs<C = any> {
    request: Request;
    context: C;
    params: Params;
}

export interface ActionFunction<D = any, C = Context> {
    (args: DataFunctionArgs<C>): Promise<Response> | Response | Promise<D> | D;
}
