var port = 1337;


module.exports = {
  port: port,
  db: 'mongodb://localhost/walkr-fit',
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  FACEBOOK_SECRET_TEST: process.env.FACEBOOK_SECRET_TEST
};