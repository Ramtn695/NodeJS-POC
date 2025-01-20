const userDao = require("../../database/daos/userDao");
const User = require("../../database/entity/User");
const { mongoConnect } = require("../../database/mongoConnect");
const { generateHashPassword } = require("../../utils/helper/userHelper");
const { userSchema } = require("../../utils/validateUser");

async function registerUser(event, context) {
  try {
    await mongoConnect();
    let user = JSON.parse(event.body);
    const { err, data } = await userSchema.validateAsync(user);

    user = {
      ...user,
      password: await generateHashPassword(user.password),
    };

    const userData = await userDao.saveUser(user);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User Registered", userData }),
    };
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

module.exports.handler = registerUser;
