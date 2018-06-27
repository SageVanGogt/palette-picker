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
  if(!request.body.name) {
    return response.status(404).json({
      error: 'No project name has been provided'
    });
  } else {
    return database('projects').insert(request.body, 'id')
    .then(projectId => {
      return response.status(201).json({ 
        id: projectId[0],
        status: 'success' 
      })
    });
  }
});

app.post('/api/v1/palettes/', (request, response) => {
  const { color1, color2, color3, color4, color5, name } = request.body;

  if( color1, color2, color3, color4, color5, name ) {
    return database('palettes').insert(request.body, 'id')
    .then(paletteId => {
      return response.status(201).json({ 
          id: paletteId,
          status: 'success' 
      })
    });  
  } else {
    return response.statusMessage(404).json({
      error: 'An incomplete palette has been submitted'
    });
  }
});

app.delete('/api/v1/projects/:id', (request, response) => {
  const projectId = request.params.id;

  return database('projects')
    .where({
      id: projectId
    })
    .del()
    .then((() => {
      return response.status(202).json({
        status: 'success'
      })
    }))
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const paletteId = request.params.id;

  return database('palettes')
    .where({
      id: paletteId
    })
    .del()
    .then((() => {
      return response.status(202).json({
        status: 'success'
      })
    }))
})

app.listen(3000, () => {
  console.log('Express intro running on localhost: 3000');
});