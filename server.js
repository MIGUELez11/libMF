const { FacebookOAuth, GoogleOAuth } = require("./dist/main");
const express = require("express");
require("dotenv").config();
const server = express();
const google = new GoogleOAuth(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8080/redirect", ["https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"]);


server.get("/login", (req, res) => {
    res.redirect(google.getRedirectUrl());
});

server.get("/redirect", async (req, res) => {
    const { code, state } = req.query;
    const Token = await (google.getOauthToken(code, state));
    res.send(Token);
});

server.listen(8080, () => console.log(`listening on http://localhost:${8080}`));