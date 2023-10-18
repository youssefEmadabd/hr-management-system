import { Request, Express } from 'express';

interface UserInterface extends Express.User {
    sub: string;
    iss?: string;
    aud?: string[];
    iat?: number;
    exp?: number;
    azp?: string;
    scope?: string;
    role?: string;
    headers?: any;
}

export interface RequestInterface extends Request, UserInterface {
    user: UserInterface;
    body: any;
    params: any;
    query: any;
}

export interface Documents<IModel> {
    pages?: number;
    documents: IModel[];
    count?: number;
}
