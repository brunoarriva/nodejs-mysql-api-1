const expect = require('expect');
const request = require('supertest');

const {mockedUser, mockedAuth} = require('./util/testUtil');

const conn = require('../app/database/database');
jest.mock('../app/database/database', () => {
  return {
    query: (sql, values, callback) => {
      callback(undefined, [mockedUser]);
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

describe('when calling User API', () => {
  it('should not accept invalid body for authentication', (done) => {
    request(app)
        .post('/api/user/auth')
        .send({foo: 'bar'})
        .expect(422)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });

  it('should generate new Token when authenticated', (done) => {
    const mConn = jest.spyOn(conn, 'query');
    request(app)
        .post('/api/user/auth')
        .send(mockedAuth)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
          expect(res.body.data.token).toBeDefined();
          expect(mConn).toHaveBeenCalledTimes(1);
        })
        .end(done);
  });
});
