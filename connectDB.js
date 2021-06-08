const mongo = require("mongoose");

const connectDatabase = () => {
  try {
    mongo.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DATABASE CONNECTED");
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDatabase;
