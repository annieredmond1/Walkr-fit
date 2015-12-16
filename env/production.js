var port = process.env.PORT;

module.exports = {
  port: port,
  db: process.env.MONGOLAB_URI,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET
};