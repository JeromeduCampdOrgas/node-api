//variables
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');

require('dotenv').config({ path: './config/.env' })
require('./config/dbConfig');

const { checkUser, requireAuth } = require('./middleware/auth.middleware');

const app = express();


const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
})
//Routes
app.use('/api/user', userRoutes);




//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})
