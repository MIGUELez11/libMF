import fetch from "node-fetch";
import * as crypto from "crypto";
import {OAuthToken} from "./OAuth";

export class GoogleOAuth {
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
        this.scopes = scopes
        this.states = [];
    }

    // setAdmingToken generates an admin token for some operations
    // For now, I don't need it
    setAdminToken(): void {
        fetch(`https://graph.facebook.com/oauth/access_token?client_id=${this.clientId}&clientSecret=${this.clientSecret}&grant_type=client_credentials`)
            .then(res => res.json())
            .then(data => this.adminToken = { type: data.token_type, token: data.access_token })
            .catch((e: Error) => console.error(e));
    }

    // getRedirectUrl returns a url for the user to be redirect for facebook login
    getRedirectUrl(): string {
        const state = crypto.randomBytes(16).toString("hex");
        this.states.push(state);
        return (`https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&state=${state}&scope=${this.scopes.join(" ")}&prompt=select_account`);
    }

    // getOauthToken exchanges the code for an OAuth token and returns it
    getOauthToken(code: string, state: string): Promise<OAuthToken> {
        // return Promise.resolve({type: "", token: ""});
        console.log("code", code, "\nState:", state);
        return new Promise((resolve): void => {
            const statePosition = this.states.findIndex(State => State === state);
            //If the state we sent is equal to the current state
            if (statePosition > -1 && code.length) {
                this.states.splice(statePosition, 1);
                fetch(`https://oauth2.googleapis.com/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        redirect_uri: this.redirectUri,
                        code: code,
                        grant_type: "authorization_code"
                    })
                })
                    .then((response: any) => {
                        console.log("Hola");
                        return response.json()
                    })
                    .then((data: any) => {
                        console.log("data: ", data);
                        if (data.error)
                            resolve(data);
                        else
                            resolve({ type: data.token_type, token: data.access_token });
                    })
                    .catch(e => {
                        console.error(e);
                        resolve(null)
                    });
            }
            else
                resolve(null);
        });
    }

    // getUserInfo gets the asked fields from the user
    async getUserInfo(UserToken, fields): Promise<Object> {
        try {
            const response = await fetch(`https://www.googleapis.com/auth/userinfo.profile?fields=${fields.join(",")}&access_token=${UserToken.token}`);
            const data: Object = await response.json();
            return data;
        }
        catch (e: any) {
            return e;
        }
    }
}