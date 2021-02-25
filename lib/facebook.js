"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class facebook {
    constructor(clientId, clientSecret, redirectUri, scopes) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.scopes = scopes;
        this.states = [];
    }
    setAdminToken() {
        node_fetch_1.default(`https://graph.facebook.com/oauth/access_token?clientId=${this.clientId}&clientSecret=${this.clientSecret}&grant_type=client_credentials`)
            .then(res => res.json())
            .then(data => this.adminToken = { type: data.token_type, token: data.access_token });
    }
    getRedirectUrl() {
        const state = "hola";
        this.states.push(state);
        return (`https://www.facebook.com/v9.0/dialog/oauth?clientId=${this.clientId}&redirectUri=${this.redirectUri}&state=${state}&scope=${this.scopes.join(",")}`);
    }
    getOauthToken(code, state) {
        return new Promise((resolve) => {
            const statePosition = this.states.findIndex(State => State === state);
            if (statePosition > -1 && code.length) {
                this.states.splice(statePosition, 1);
                node_fetch_1.default(`https://graph.facebook.com/v9.0/oauth/access_token?clientId=${this.clientId}&redirectUri=${this.redirectUri}&clientSecret=${this.clientSecret}&code=${code}`)
                    .then(response => response.json())
                    .then(data => {
                    if (data.error)
                        resolve(data);
                    else
                        resolve({ type: data.token_type, token: data.access_token });
                });
            }
            else
                resolve(null);
        });
    }
    getUserInfo(UserToken, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(`https://graph.facebook.com/v9.0/me?fields=${fields.join(",")}&access_token=${UserToken.token}`);
            const data = yield response.json();
            return data;
        });
    }
}
exports.default = facebook;
//# sourceMappingURL=facebook.js.map