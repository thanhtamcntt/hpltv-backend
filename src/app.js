const express = require('express');
const app = express();
require('dotenv').config();
const configDb = require('./configs/configdb.js');
const cors = require('cors');

const port = process.env.PORT || 4000;
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

const Router = require('./routes/index');
const { errorHandler } = require('./helpers/errorHandler');

configDb();

app.use(cors());

app.use('/', Router);

app.use(errorHandler);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
