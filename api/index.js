const express = require("express");
const app = express();
const cors = require('cors');
const webboardsRouter = require('./routes/webboards');
const userAdminRouter = require('./routes/user_admin');
const contentRouter = require('./routes/content');
const website_settingsRouter = require('./routes/website_setting');
const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comment');
const uploadRouter = require('./routes/uploads');

require('dotenv').config()

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express API 🚀");
});

app.use("/webboard", webboardsRouter);
app.use("/users", userAdminRouter);
app.use("/content", contentRouter);
app.use("/website_setting", website_settingsRouter);
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/uploads", uploadRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});