import { OAuthToken } from "./OAuth";
export declare class FacebookOAuth {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: Array<string>;
    states: Array<string>;
    adminToken: OAuthToken;
    constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: Array<string>);
    setAdminToken(): void;
    getRedirectUrl(): string;
    getOauthToken(code: string, state: string): Promise<OAuthToken>;
    getUserInfo(UserToken: any, fields: any): Promise<Object>;
}
