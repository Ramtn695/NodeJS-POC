const userDao = require("../../database/daos/userDao");
const User = require("../../database/entity/User");
const { mongoConnect } = require("../../database/mongoConnect");
const userSchema = require("../../utils/validateUser");

async function getUser(event, context) {
  try {
    await mongoConnect();
    const { id } = event.pathParameters;
    const userData = await userDao.getUser(id);

    return {
      statusCode: 200,
      body: JSON.stringify({userData,event,context}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Some error occured",
        err: error,
      }),
    };
  }
}

module.exports.handler = getUser;
