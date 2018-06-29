const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

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
        response.body[0].project_id.should.equal(28);
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
})

