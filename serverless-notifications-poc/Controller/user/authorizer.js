const userDao = require("../../database/daos/userDao");
const User = require("../../database/entity/User");
const { mongoConnect } = require("../../database/mongoConnect");
const { generateAPIPolicy } = require("../../utils/helper/generateAPIPolicy");
const { comparePassword } = require("../../utils/helper/userHelper");
const { loginSchema } = require("../../utils/validateUser");
const jwt = require("jsonwebtoken");

async function authorizer(event, context) {
  try {
    const claims = jwt.verify(
      event.headers["Authorization"].split(" ")[1],
      process.env.SECRET_KEY
    );
    const policy = generateAPIPolicy("user");
    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports.handler = authorizer;
