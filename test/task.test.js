const expect = require('expect');
const request = require('supertest');

const {mockedTask, mockedTasks, mockedToken} = require('./util/testUtil');

const conn = require('../app/database/database');
const kafka = require('../app/util/kafkaProducer');
const crypt = require('../app/util/cryptoUtil');

jest.mock('../app/database/database', () => {
  return {
    query: (sql, values, callback) => {
      callback(undefined, mockedTasks);
    },
  };
});

jest.mock('../app/util/kafkaProducer', () => {
  return {
    produce: (taskId, username) => {
      console.log('Kafka mock! Task [' + taskId + '] User [' + username + '].');
      return Promise.resolve();
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

describe('when calling Task API', () => {
  it('should require an authentication Token', (done) => {
    request(app)
        .get('/api/task/')
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });

  it('should not accept invalid body for Task creation', (done) => {
    request(app)
        .post('/api/task/')
        .set({'Authorization': 'Bearer ' + mockedToken('T')})
        .send({foo: 'bar'})
        .expect(422)
        .end(done);
  });

  it('should not accept invalid body for Task update', (done) => {
    request(app)
        .put('/api/task/1')
        .set({'Authorization': 'Bearer ' + mockedToken('T')})
        .send({foo: 'bar'})
        .expect(422)
        .end(done);
  });

  it('should not accept update from Managers', (done) => {
    request(app)
        .put('/api/task/1')
        .set({'Authorization': 'Bearer ' + mockedToken('M')})
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });

  it('should accept update from Technicians', (done) => {
    request(app)
        .put('/api/task/1')
        .set({'Authorization': 'Bearer ' + mockedToken('T')})
        .send(mockedTask)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
        })
        .end(done);
  });

  it('should not accept delete from Technicians', (done) => {
    request(app)
        .delete('/api/task/1')
        .set({'Authorization': 'Bearer ' + mockedToken('T')})
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });

  it('should accept delete from Managers', (done) => {
    request(app)
        .delete('/api/task/1')
        .set({'Authorization': 'Bearer ' + mockedToken('M')})
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
        })
        .end(done);
  });

  it('should not accept create from Managers', (done) => {
    request(app)
        .post('/api/task/')
        .set({'Authorization': 'Bearer ' + mockedToken('M')})
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBeFalsy();
          expect(res.body.message).toBeDefined();
        })
        .end(done);
  });

  it('should try to send create message to the Managers', (done) => {
    const mConn = jest.spyOn(conn, 'query');
    const mKafka = jest.spyOn(kafka, 'produce');
    request(app)
        .post('/api/task/')
        .set({'Authorization': 'Bearer ' + mockedToken('T')})
        .send(mockedTask)
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
          expect(res.body.message).toBeDefined();
          expect(mConn).toHaveBeenCalledTimes(1);
          expect(mKafka).toHaveBeenCalledTimes(1);
        })
        .end(done);
  });

  it('should encrypt texts when listing tasks to the Managers', (done) => {
    const mConn = jest.spyOn(conn, 'query');
    const mCrypt = jest.spyOn(crypt, 'encrypt');
    request(app)
        .get('/api/task/')
        .set({'Authorization': 'Bearer ' + mockedToken('M')})
        .send(mockedTask)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeTruthy();
          expect(res.body.message).toBeDefined();
          expect(mConn).toHaveBeenCalledTimes(1);
          expect(mCrypt).toHaveBeenCalledTimes(mockedTasks.length);
        })
        .end(done);
  });
});
