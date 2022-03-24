const {faker} = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/jwt');

const fakePass = faker.internet.password();

const mockedAuth = {
  username: faker.internet.userName(),
  password: fakePass,
};

const mockedUser = {
  username: faker.internet.userName(),
  password: bcrypt.hashSync(fakePass, 10),
  active: 1,
  type: 'M',
};

const mockedTask = {description: faker.lorem.sentence()};

const mockedTasks = [
  {
    id: faker.datatype.number(),
    description: faker.lorem.sentence(),
    creation: faker.datatype.datetime(),
    lastUpdate: faker.datatype.datetime(),
    username: faker.internet.userName(),
  },
  {
    id: faker.datatype.number(),
    description: faker.lorem.sentence(),
    creation: faker.datatype.datetime(),
    lastUpdate: faker.datatype.datetime(),
    username: faker.internet.userName(),
  },
  {
    id: faker.datatype.number(),
    description: faker.lorem.sentence(),
    creation: faker.datatype.datetime(),
    lastUpdate: faker.datatype.datetime(),
    username: faker.internet.userName(),
  },
];

const mockedToken = (userType) => {
  return jwt.sign(
      {
        userId: faker.datatype.number(),
        username: faker.internet.userName(),
        role: userType,
      },
      config.secret,
      {expiresIn: config.tokenLife},
  );
};

module.exports = {mockedUser, mockedAuth, mockedTask, mockedTasks, mockedToken};
