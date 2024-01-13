/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const { faker } = require("@faker-js/faker");

const users = [];

const userLength = 100;

for (let i = 0; i < userLength; i += 1) {
  const randomDate = faker.date
    .past()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  users.push({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    naissance: randomDate,
    civility: faker.number.binary({ min: 0, max: 1 }),
    password: faker.internet.password(),
    isAdmin: 0,
    avatar: faker.image.avatarGitHub(),
  });
}

module.exports = users;