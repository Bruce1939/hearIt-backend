const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { PORT } = require('./Constants/index');
const connectDB = require('./config/connectDB');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

connectDB();

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

app.use('/auth', authRoutes);
