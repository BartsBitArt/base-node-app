const mongoose = require("mongoose");
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_HOST,
    REDIS_PORT,
    SESSION_SECRET,
} = require("./config/config");

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/test?authSource=admin`;
const connectWithRetry = () => {
    mongoose
        .connect(mongoUrl)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
            console.log(
                "MongoDB connection unsuccessful, retry after 5 seconds. ",
                err
            );
            setTimeout(connectWithRetry, 5000);
        });
};
connectWithRetry();

const express = require("express");
const app = express();
const port = process.env.PORT;

const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
redisClient.connect().catch(console.error);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUnitialized: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const postRouter = require("./routes/postRoutes");
app.use("/api/v1/posts", postRouter);

const userRouter = require("./routes/userRoutes");
app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log("Listening on port " + port));
