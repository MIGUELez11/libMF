const crypto = require("crypto");
const fetch = require("node-fetch");
// import crypto from "crypto";
// import fetch from "node-fetch";

interface OAuthToken {
    type: String,
    token: String
}

class facebook {
    clientId: String;
    clientSecret: String;
    redirectUri: String;
    scopes: Array<String>;
    states: Array<String>;

    adminToken: OAuthToken;

    constructor(clientId: String, clientSecret: String, redirectUri: String, scopes: Array<String>) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.scopes = scopes;

        this.states = [];
        // this.adminToken = {};
        // this.setAdminToken();
    }

    // setAdmingToken generates an admin token for some operations
    // For now, I don't need it
    setAdminToken(): void {
        fetch(`https://graph.facebook.com/oauth/access_token?clientId=${this.clientId}&clientSecret=${this.clientSecret}&grant_type=client_credentials`)
            .then(res => res.json())
            .then(data => this.adminToken = { type: data.token_type, token: data.access_token });
    }

    // getRedirectUrl returns a url for the user to be redirect for facebook login
    getRedirectUrl(): String {
        const state = crypto.randomBytes(16).toString("hex");
        this.states.push(state);
        return (`https://www.facebook.com/v9.0/dialog/oauth?clientId=${this.clientId}&redirectUri=${this.redirectUri}&state=${state}&scope=${this.scopes.join(",")}`);
    }

    // getOauthToken exchanges the code for an OAuth token and returns it
    getOauthToken(code: String, state: String): Promise<OAuthToken> {
        return new Promise((resolve) => {
            const statePosition = this.states.findIndex(State => State === state);
            //If the state we sent is equal to the current state
            if (statePosition > -1 && code.length) {
                this.states.splice(statePosition, 1);
                fetch(`https://graph.facebook.com/v9.0/oauth/access_token?clientId=${this.clientId}&redirectUri=${this.redirectUri}&clientSecret=${this.clientSecret}&code=${code}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error)
                            resolve(data);
                        else
                            resolve({ type: data.token_type, token: data.access_token });
                    })
            }
            else
                resolve(false);
        });
    }

    // getUserInfo gets the asked fields from the user
    async getUserInfo(UserToken, fields): Promise<Object> {
        const response = await fetch(`https://graph.facebook.com/v9.0/me?fields=${fields.join(",")}&access_token=${UserToken.token}`);
        const data: Object = await response.json();
        return data;
    }
}


export default facebook;