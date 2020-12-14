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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _clientId, _clientSecret, _redirectUri, _scopes, _states, _adminToken;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookOAuth = void 0;
const crypto_1 = require("crypto");
const node_fetch_1 = require("node-fetch");
class FacebookOAuth {
    constructor(clientId, clientSecret, redirectUri, scopes) {
        _clientId.set(this, void 0);
        _clientSecret.set(this, void 0);
        _redirectUri.set(this, void 0);
        _scopes.set(this, void 0);
        _states.set(this, void 0);
        _adminToken.set(this, void 0);
        __classPrivateFieldSet(this, _clientId, clientId);
        __classPrivateFieldSet(this, _clientSecret, clientSecret);
        __classPrivateFieldSet(this, _redirectUri, redirectUri);
        __classPrivateFieldSet(this, _scopes, scopes);
        __classPrivateFieldSet(this, _states, []);
    }
    setAdminToken() {
        node_fetch_1.default(`https://graph.facebook.com/oauth/access_token?client_id=${__classPrivateFieldGet(this, _clientId)}&client_secret=${__classPrivateFieldGet(this, _clientSecret)}&grant_type=client_credentials`)
            .then(res => res.json())
            .then(data => __classPrivateFieldSet(this, _adminToken, { type: data.token_type, token: data.access_token }));
    }
    getRedirectUrl() {
        const state = crypto_1.default.randomBytes(16).toString("hex");
        __classPrivateFieldGet(this, _states).push(state);
        return (`https://www.facebook.com/v9.0/dialog/oauth?client_id=${__classPrivateFieldGet(this, _clientId)}&redirect_uri=${__classPrivateFieldGet(this, _redirectUri)}&state=${state}&scope=${__classPrivateFieldGet(this, _scopes).join(",")}`);
    }
    getOauthToken(code, state) {
        return new Promise((resolve) => {
            const statePosition = __classPrivateFieldGet(this, _states).findIndex(State => State === state);
            if (statePosition > -1 && code.length) {
                __classPrivateFieldGet(this, _states).splice(statePosition, 1);
                node_fetch_1.default(`https://graph.facebook.com/v9.0/oauth/access_token?client_id=${__classPrivateFieldGet(this, _clientId)}&redirect_uri=${__classPrivateFieldGet(this, _redirectUri)}&client_secret=${__classPrivateFieldGet(this, _clientSecret)}&code=${code}`)
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
exports.FacebookOAuth = FacebookOAuth;
_clientId = new WeakMap(), _clientSecret = new WeakMap(), _redirectUri = new WeakMap(), _scopes = new WeakMap(), _states = new WeakMap(), _adminToken = new WeakMap();
exports.default = FacebookOAuth;
//# sourceMappingURL=facebook.js.map