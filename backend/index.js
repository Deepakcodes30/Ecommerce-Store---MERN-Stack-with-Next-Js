import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

dotenv.config({
  path: "./.env",
});

/*
This code is just for development to check the port
Vercel is serverless so it doesnt listen all the time app.listen should not be used
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at Port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo db connection failed !!!", error);
  }); */

await connectDB();

app.get("/", (_, res) => {
  res.send("Backend running");
});
