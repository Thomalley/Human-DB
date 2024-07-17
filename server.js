/* eslint-disable no-console */
const express = require('express');

const fs = require('fs');
const path = require('path');
const db = require('./models');

// Configure App
const pkg = require('./package.json');
const logger = require('./config/logger')(pkg.name, process.env.NODE_ENV);

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require('./routes');

app.use('/api', routes(app));

app.get('*', (req, res) => {
  if (fs.existsSync(path.join(__dirname, 'build', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'build.html'));
  }
});

app.locals.logger = logger;
app.locals.db = db;

// Database connection
const connectToDatabase = () => {
  if (db) {
    db.sequelize.authenticate()
      .then(() => {
        console.log('Database connection successful.');
      })
      .catch((err) => {
        console.log('Database connection failed. Retrying in 5s...');
        console.log(err);
        setTimeout(connectToDatabase, 5000);
      });
  }
};

connectToDatabase();

const port = process.env.API_PORT || 8080;
app.listen(port, () => {
  console.log('Server listening on port:', port);
});
