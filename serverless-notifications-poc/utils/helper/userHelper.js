const bcrypt = require("bcrypt");

const generateHashPassword = async (password) => {
  const SALTROUNDS = 10;
  let saltSync = await bcrypt.genSaltSync(SALTROUNDS);
  return bcrypt.hashSync(password, saltSync);
};

const comparePassword = async (hash, password) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  generateHashPassword,
  comparePassword,
};
