const User = require("../entity/User");

const saveUser = async (user) => {
  try {
    const userData = await User.create(user);
    return { msg: "User Saved Successfully", userData };
  } catch (error) {
    throw new Error(err);
  }
};

const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(Error);
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(Error);
  }
};

const userDao = { saveUser, getUser, getUserByEmail };

module.exports = userDao;
