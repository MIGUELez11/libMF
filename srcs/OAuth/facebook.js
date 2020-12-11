const crypto = require("crypto");
const fetch = require("node-fetch");

class facebook {
    constructor(client_id, client_secret, redirect_uri, scopes) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;
        this.scopes = scopes;

        this.states = [];
        // this.adminToken = {};
        // this.setAdminToken();
    }

    // setAdmingToken generates an admin token for some operations
    // For now, I don't need it
    setAdminToken() {
        fetch(`https://graph.facebook.com/oauth/access_token?client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=client_credentials`)
            .then(res => res.json())
            .then(data => this.adminToken = { type: data.token_type, token: data.access_token });
    }

    // getRedirectUrl returns a url for the user to be redirect for facebook login
    getRedirectUrl() {
        const state = crypto.randomBytes(16).toString("hex");
        this.states.push(state);
        return (`https://www.facebook.com/v9.0/dialog/oauth?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&state=${state}&scope=${this.scopes.join(",")}`);
    }

    // getOauthToken exchanges the code for an OAuth token and returns it
    getOauthToken(code, state) {
        return new Promise((resolve) => {
            const statePosition = this.states.findIndex(State => State === state);
            //If the state we sent is equal to the current state
            if (statePosition > -1 && code.length) {
                this.states.splice(statePosition, 1);
                fetch(`https://graph.facebook.com/v9.0/oauth/access_token?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&client_secret=${this.client_secret}&code=${code}`)
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
    async getUserInfo(UserToken, fields) {
        const response = await fetch(`https://graph.facebook.com/v9.0/me?fields=${fields.join(",")}&access_token=${UserToken.token}`);
        const data = await response.json();
        return data;
    }
}


module.exports = facebook;