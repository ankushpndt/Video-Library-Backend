const mongoose = require("mongoose");

const initializeDbConnection = async () => {
  const mySecret = process.env['URL']
  try {
    await mongoose.connect(mySecret, {

      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("successfully connected");
  } catch (error) {
    console.error(
      "mongoose connection failed, kindly check connectivity",
      error
    );
  }
};

module.exports = initializeDbConnection;
