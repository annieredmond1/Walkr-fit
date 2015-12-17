var port = 1337;


module.exports = {
  port: port,
  db: 'mongodb://localhost/walkr-fit',
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
};