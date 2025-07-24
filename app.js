const express = require("express");
const fs = require("fs");
const path = require("path");
const { engine } = require("express-handlebars");

const app = express();

// 告訴 Express：「要用 handlebars 來處理 .handlebars 的檔案。」並且設 main.handlebars 為預設版型（layout）。
app.engine("handlebars", engine({ defaultLayout: "main" }));
// 告訴 Express：「我們的模板檔案是 .handlebars 結尾的。」
app.set("view engine", "handlebars");
// 告	告訴 Express：「所有的模板檔案都放在 views/ 這個資料夾裡。」
app.set("views", "./views");

// 設定靜態檔案的目錄
app.use(express.static(path.join(__dirname, "public")));

// 🔹 讀取所有 JSON 檔案，並轉成 JS 物件陣列
function getArticles() {
  const articleDir = path.join(__dirname, "data", "articles");
  const articleFiles = fs.readdirSync(articleDir);

  const articles = articleFiles.map(filename => {
    const filePath = path.join(articleDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  });

  return articles;
}

// 建立首頁路由
app.get("/", (req, res) => {
  const articles = getArticles();
  res.render("home", { articles });
});

app.get("/articles", (req, res) => {
  const articles = getArticles();
  res.render("articles", { articles });
});

app.get("/articles/:id", (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, "data", "articles", `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("找不到這篇文章");
  }

  const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.render("articles_pokemon", {
    article,
    cssFile: `/css/articles_pokemon.css` 
  });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");   
});
