const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

app.get("/api/usage/get/:uid", (req, res) => {
  const uid = req.params.uid;
  fetch("https://apps.akool.com/api/tools/userApiCalls")
    .then((response) => response.json())
    .then((result) => {
      const apis = result.filter((r) => r.userId === uid);
      if (apis.length >= 1) res.json(apis[0].api);
      else res.json([]);
    })
    .catch((error) => console.log("error", error));
});

app.post("/api/usage/set", (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify(req.body),
  };
  fetch("https://apps.akool.com/api/tools/userApiCalls", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.message) {
        requestOptions.method = "POST";
        fetch("https://apps.akool.com/api/tools/userApiCalls", requestOptions)
          .then((response) => response.json())
          .then((result) => res.json({ apiUsage: result }))
          .catch((error) => console.log("error", error));
      } else res.status = 200;
    })
    .catch((error) => {
      console.log("error", error);
      res.status = 400;
    });
});

app.put("/api/usage/update", (req, res) => {
  var requestOptions = {
    method: "PUT",
    headers: req.headers,
    body: req.body,
  };

  fetch("https://apps.akool.com/api/tools/userApiCalls", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.message) res.status(404);
      else res.status = 200;
    })
    .catch((error) => {
      console.log("error", error);
      res.status = 400;
    });
});

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

const PORT = process.env.PORT || 8081
app.listen(PORT, () =>
  console.log(`Listening on Port ${PORT}`)
);
