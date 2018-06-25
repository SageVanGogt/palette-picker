const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/', (request, response) => {
  return response.status(200).json('Your database');
});

app.get('/api/v1/projects/', (request, response) => {
  return database('projects').select()
  .then(projects => {
    return response.status(200).json(projects);
  })
});

app.get('/api/v1/palettes/', (request, response) => {
  return database('palettes').select()
  .then(palettes => {
    return response.status(200).json(palettes);
  })
});

app.post('/api/v1/projects/', (request, response) => {
  return database('projects').insert(request.body)
  .then(project => {
    return response.status(200).json({ project })
  });
});

app.post('/api/v1/palettes/', (request, response) => {
  return database('palettes').insert(request.body)
  .then(palette => {
    return response.status(200).json({ palette })
  });
});

app.listen(3000, () => {
  console.log('Express intro running on localhost: 3000');
});