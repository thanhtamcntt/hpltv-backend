const express = require('express');
const app = express();
require('dotenv').config();
const configDb = require('./configs/configdb.js');
const cors = require('cors');

const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false,limit: '50mb' }));

const Router = require('./routes/index');
const { errorHandler } = require('./helpers/errorHandler');

configDb();

app.use('/', Router);

app.use(errorHandler);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
