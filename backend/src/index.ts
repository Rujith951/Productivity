import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import { json } from "drizzle-orm/gel-core";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware); // auth obj will attached to the req
app.use(express.json()); // parses json request bodies
app.use(express.urlencoded({ extended: true })); // parses from data (like HTML forms).

app.get("/", (req, res) => {
	res.json({ success: true });
});

app.listen(ENV.PORT, () => console.log(`server is up on ${ENV.PORT} port`));
