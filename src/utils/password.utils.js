import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const comparePassword = async (sentPassword, userPassword) => {
  return await bcrypt.compare(sentPassword, userPassword);
};

export { hashPassword, comparePassword };
