const environment = process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);


describe('CLIENT routes', () => {
  it('should receive a response of a html when we hit the root endpoint', done => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
    .get('/vegan')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    })
  })
})

describe('API routes', () => {

  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return an array of projects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array')
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('project 1');
        done();
      })
    })
  })

  describe('GET /api/v1/palettes', () => {
    it('should return an array of palettes', done => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array')
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('dope palette');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal("rgb(131, 100, 138)");
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal("rgb(17, 224, 242)");
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal("rgb(148, 223, 140)");
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal("rgb(42, 86, 135)");
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal("rgb(35, 65, 187)");
        done();
      })
    })
  })

  describe('POST /api/v1/projects', () => {
    it('should create a new project', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'project 2'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
        response.body.should.have.property('status');
        response.body.status.should.equal('success');
        done();
      })
    })

    it('should not create a record if the post body is missing info', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.body.error.should.equal('No project name has been provided');
        done();
      })
    })
  })

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'neato palette', 
        project_id: 1, 
        color1: "rgb(131, 100, 138)", 
        color2: "rgb(17, 224, 242)", 
        color3: "rgb(148, 223, 140)", 
        color4: "rgb(42, 86, 135)", 
        color5: "rgb(35, 65, 187)"
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        response.body.should.have.property('status');
        response.body.status.should.equal('success');
        done();
      })
    })

    it('should not create a record if the post body is missing info', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'dangles4dirt',
        project_id: 4
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.body.error.should.equal('An incomplete palette has been submitted');
        done();
      })
    })
  })
})

