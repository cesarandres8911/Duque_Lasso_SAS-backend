"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const app = (0, _express.default)();
app.set("port", 5000);
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
app.get("/", (req, res) => {
  res.send("Hello World from node.js server");
});
app.get("/login", (req, res) => {
  res.send("Login from express.js and nodejs.. my first api");
});
