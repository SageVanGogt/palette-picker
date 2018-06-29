const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//if there is no specified environment, use port 3000
app.set('port', process.env.PORT || 3000);

//use define accepted methods
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//allows the app to parse and consume json
app.use(bodyParser.json());
//directs our page to static html and js files in the public folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//gets all projects from the projects database
app.get('/api/v1/projects', (request, response) => {
  //selecting project db
  return database('projects').select()
  .then(projects => {
    //returing project db in json format with ok status
    return response.status(200).json(projects);
  })
});

//gets all palettes from the palettes database
app.get('/api/v1/palettes', (request, response) => {
  //selecting project db
  return database('palettes').select()
  .then(palettes => {
    //returing palettes in json format with ok status
    return response.status(200).json(palettes);
  })
});

//knex method for posting a new project at endpoint
app.post('/api/v1/projects', (request, response) => {
  //returing an error if the request body does not have name info
  if(!request.body.name) {
    //assigning status of 404 because thats proper for user errors
    return response.status(404).json({
      error: 'No project name has been provided'
    });
  } else {
    //inserting the request body into the project db, and returing the id that is assigned
    return database('projects').insert(request.body, 'id')
    .then(projectId => {
      //returing the project id and a success status in json format
      return response.status(201).json({ 
        id: projectId[0],
        status: 'success' 
      })
    });
  }
});

app.post('/api/v1/palettes', (request, response) => {
  let result = ['name', 'project_id', 'color1', 'color2', 'color3', 'color4', 'color5']
    .every(prop => request.body.hasOwnProperty(prop));
  if( result ) {
    return database('palettes').insert(request.body, '*')
    .then(palette => {
      return response.status(201).json({ 
          id: palette[0].id,
          color1: palette[0].color1, 
          color2: palette[0].color2,
          color3: palette[0].color3,
          color4: palette[0].color4,
          color5: palette[0].color5,
          status: 'success' 
      })
    });  
  } else {
    return response.status(404).json({
      error: 'An incomplete palette has been submitted'
    });
  }
});

//method for delete at a dynamic endpoint based on a request param id
app.delete('/api/v1/palettes/:id', (request, response) => {
  //the id itself that comes from request params, this will reference a palette id
  const paletteId = request.params.id;
  //finding exact palette in the palettes DB based on the id provided
  return database('palettes')
    .where({
      id: paletteId
    })
    //deleting method
    .del()
    .then((() => {
      //returning only a successful status code
      return response.status(202).json({
        status: 'success'
      })
    }))
})

//listening for a port
app.listen(app.get('port'), () => {
  console.log('Express intro running on localhost: 3000');
});

module.exports = app;