import express from 'express';
const app = express();
app.set("port", 3000);
app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});

app.get("/", (req, res) => {
    res.send("Hello World from nodejs");
});

app.get("/login", (req, res) => {
    res.send("Login from express.js and nodejs");
});
