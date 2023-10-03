const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB;
const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    if (connection) {
      console.log("Connected Succefully");
    }
  }
  catch (error) {
    console.log("connection failed", error)
  }
}
module.exports = { initializeDatabase };