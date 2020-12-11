const Facebook = require("./srcs/OAuth/facebook");
const express = require("express");

const server = express();
const facebook = new Facebook();

server.get("/login", (req, res) => {
    res.redirect(facebook.getRedirectUrl());
});

server.get("/redirect", async (req, res) => {
    console.log(req.query);
    const Token = await (facebook.getOauthToken(req.query.code, req.query.state));
    res.send(await facebook.getUserInfo(Token, ["name", "email"]));
});

server.listen(8080, () => console.log(`listening on http://localhost:${8080}`));