const connectDb = require('./configs/configdb');
const fs = require('fs');
const path = require('path');
const Series = require('./models/series');
const Movies = require('./models/movies');
const Category = require('./models/category');

const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

connectDb();

const series = JSON.parse(
  fs.readFileSync(path.join(__dirname, './assets/series.json')),
);

const category = JSON.parse(
  fs.readFileSync(path.join(__dirname, './assets/category.json')),
);

const movies = JSON.parse(
  fs.readFileSync(path.join(__dirname, './assets/movies.json')),
);

const ImportData = async () => {
  try {
    await Series.create(series);
    await Movies.create(movies);
  } catch (error) {
    console.log(error);
  }
};

const Import = async () => {
  try {
    await Category.create(category);
  } catch (error) {
    console.log(error);
  }
};

const DeleteData = async () => {
  try {
    await Series.deleteMany();
    await Movies.deleteMany();
    await Category.deleteMany();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  Import();
  console.log('Data imported');
}
if (process.argv[2] === '-d') {
  DeleteData();
  console.log('Data deleted');
}
