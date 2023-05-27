let express = require('express');
let cookieParser = require('cookie-parser');
let dbConnect = require('./database/dbConnect');
let {PORT} = require('./config/config');
let router = require('./routes/routes')
let errorHandler = require('./middlewares/errorHandler');

let app = express();

app.use(express.json());
app.use(cookieParser());

dbConnect();



app.use(router);

app.use(errorHandler);

app.listen(PORT, console.log(`Backend is connected at PORT: ${PORT}`))