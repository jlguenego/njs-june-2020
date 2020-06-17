"use strict";

const express = require("express");
const serveIndex = require("serve-index");
const fs = require("fs");

const app = express();
const port = 3000;
const filename = "./database/articles.json";

app.set("view engine", "ejs");

// express.urlencoded() permet de recuperer req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log("req.url: ", req.url);
  next();
});

let articles = [];
try {
  articles = JSON.parse(fs.readFileSync(filename));
} catch (err) {
  console.log("err: ", err);
  fs.writeFileSync(filename, JSON.stringify(articles, undefined, 2));
}

app.get("/stock", (req, res, next) => {
  res.render("stock", { articles });
});

app.get("/add", (req, res, next) => {
  res.render("add", {});
});

app.post("/action/add", (req, res, next) => {
  const article = req.body;
  console.log("article: ", article);
  article.id = "a" + Math.floor(Math.random() * 1e18);

  articles.push(article);
  fs.writeFile(
    filename,
    JSON.stringify(articles, undefined, 2),
    (err, result) => {
      if (err) {
        console.log("err: ", err);
        res.status(500).end();
        return;
      }
      res.redirect("/stock");
    }
  );
});

app.delete("/webservices/bulk/articles", (req, res, next) => {
  const ids = req.body;
  console.log("ids: ", ids);
  ids.forEach((id) => {
    const index = articles.findIndex((article) => article.id === id);
    if (index === -1) {
      return;
    }
    articles.splice(index, 1);
  });
  fs.writeFile(
    filename,
    JSON.stringify(articles, undefined, 2),
    (err, result) => {
      if (err) {
        console.log("err: ", err);
        res.status(500).end();
        return;
      }
      res.status(204).end();
    }
  );
});

app.use(express.static("www"));
app.use(serveIndex("www"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
