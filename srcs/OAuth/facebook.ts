import fetch from "node-fetch";
import * as crypto from "crypto";
import {OAuthToken} from "./OAuth";

export class FacebookOAuth {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: Array<string>;
    states: Array<string>;

    adminToken: OAuthToken;

    constructor(clientId: string, clientSecret: string, redirectUri: string, scopes: Array<string>) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.scopes = scopes;
        this.states = [];
    }

    // setAdmingToken generates an admin token for some operations
    // For now, I don't need it
    setAdminToken(): void {
        fetch(`https://graph.facebook.com/oauth/access_token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`)
            .then((res: {json: () => Response}) => res.json())
            .then((data: any) => this.adminToken = { type: data.token_type, token: data.access_token })
            .catch(e => console.error(e));
    }

    // getRedirectUrl returns a url for the user to be redirect for facebook login
    getRedirectUrl(): string {
        const state = crypto.randomBytes(16).toString("hex");
        this.states.push(state);
        return (`https://www.facebook.com/v9.0/dialog/oauth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}&scope=${this.scopes.join(",")}`);
    }

    // getOauthToken exchanges the code for an OAuth token and returns it
    getOauthToken(code: string, state: string): Promise<OAuthToken> {
        return new Promise((resolve) => {
            const statePosition = this.states.findIndex(State => State === state);
            //If the state we sent is equal to the current state
            if (statePosition > -1 && code.length) {
                this.states.splice(statePosition, 1);
                fetch(`https://graph.facebook.com/v9.0/oauth/access_token?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&client_secret=${this.clientSecret}&code=${code}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error)
                            resolve(data);
                        else
                            resolve({ type: data.token_type, token: data.access_token });
                    })
                    .catch((e: Error) => console.error(e));
            }
            else
                resolve(null);
        });
    }

    // getUserInfo gets the asked fields from the user
    async getUserInfo(UserToken, fields): Promise<Object> {
        const response = await fetch(`https://graph.facebook.com/v9.0/me?fields=${fields.join(",")}&access_token=${UserToken.token}`);
        const data: Object = await response.json();
        return data;
    }
}