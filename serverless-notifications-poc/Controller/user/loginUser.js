const userDao = require("../../database/daos/userDao");
const User = require("../../database/entity/User");
const { mongoConnect } = require("../../database/mongoConnect");
const { comparePassword } = require("../../utils/helper/userHelper");
const { loginSchema } = require("../../utils/validateUser");
const jwt = require("jsonwebtoken");

async function loginUser(event, context) {
  try {
    await mongoConnect();
    const user = JSON.parse(event.body);
    const { err, data } = await loginSchema.validateAsync(user);

    const userData = await userDao.getUserByEmail(user.email);

    if (!userData) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid User" }),
      };
    } else {
      const isValidLogin = await comparePassword(
        userData.password,
        user.password
      );
      if (isValidLogin) {
        let data = {
          time: Date(),
          email: userData.email,
          name: userData.name,
          id: userData._id,
        };
        return {
          statusCode: 200,
          body: JSON.stringify({
            access_token: jwt.sign(data, process.env.SECRET_KEY, {
              expiresIn: "1h",
            }),
          }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid User or Password" }),
        };
      }
    }
  } catch (error) {
    if ("details" in error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          msg: "Validation Error",
          err: error.details[0].message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          msg: "Some error occured",
          err: error,
        }),
      };
    }
  }
}

module.exports.handler = loginUser;
