const Facebook = require("./srcs/OAuth/facebook");
const express = require("express");
require("dotenv").config();

const server = express();
const facebook = new Facebook(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_CLIENT_SECRET, "http://localhost:8080/redirect", ["email"]);

server.get("/login", (req, res) => {
    res.redirect(facebook.getRedirectUrl());
});

server.get("/redirect", async (req, res) => {
    console.log(req.query);
    const Token = await (facebook.getOauthToken(req.query.code, req.query.state));
    res.send(await facebook.getUserInfo(Token, ["name", "email", "hometown"]));
});

server.listen(8080, () => console.log(`listening on http://localhost:${8080}`));