const express = require("express");
const app = express();

app.use(express.json());

app.use("/ai", require("./routes/ai"));
app.use("/orders", require("./routes/orders"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
