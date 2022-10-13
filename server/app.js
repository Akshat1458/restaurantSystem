import express from "express";
import User from "./routers/user.js";
export const app = express();
 

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use("/api/v1",User);

app.get("/", (req, res) => {
    res.send("Server is working");
});


