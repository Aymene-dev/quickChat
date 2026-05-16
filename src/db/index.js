import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const dbUri = process.env.DB_CONN_URI;
    await mongoose.connect(dbUri);
    console.log("db connecté");
  } catch (error) {
    console.log("erreur " + error);
  }
};
export default dbConnection;
