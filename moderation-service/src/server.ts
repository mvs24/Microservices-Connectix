import app from "./app";

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Moderation Service is running on port ${PORT}`)
);
