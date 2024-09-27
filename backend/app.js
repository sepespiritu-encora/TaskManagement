// app.js
const express = require('express');
const cors = require('cors');
require('./db');
const userRouter = require('./routers/routes');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});