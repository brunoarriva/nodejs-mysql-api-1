const expect = require('expect');
const request = require('supertest');


jest.mock('../app/database/database', () => {
  return {
    query: (sql, values, callback) => {
      throw new Error('Some mocked exception!');
    },
  };
});


let app;

beforeEach(() => {
  app = require('../server');
});
afterEach(async () => {
  await app.close();
  jest.clearAllMocks();
});

describe('when testing Server Status', () => {
  it('should return server status and timestamp', (done) => {
    request(app)
        .get('/api/')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
          expect(res.body.timestamp).toBeDefined();
        })
        .end(done);
  });
  it('should return 404 to not found', (done) => {
    request(app)
        .get('/foo-bar')
        .expect(404)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
        })
        .end(done);
  });
  it('should return 500 to exceptions', (done) => {
    request(app)
        .get('/api/user/list')
        .expect(500)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });
});
