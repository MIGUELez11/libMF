interface OAuthToken {
    type: String;
    token: String;
}
export declare class FacebookOAuth {
    #private;
    constructor(clientId: String, clientSecret: String, redirectUri: String, scopes: Array<String>);
    private setAdminToken;
    getRedirectUrl(): String;
    getOauthToken(code: String, state: String): Promise<OAuthToken>;
    getUserInfo(UserToken: any, fields: any): Promise<Object>;
}
export default FacebookOAuth;
