const mongoose = require("mongoose"); // initializing mongoose
const mongoURi = "mongodb://localhost:27017/iNoteBook"; //mongodb uri

const connectToMongo = () => {
  mongoose
    .connect(mongoURi)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(" MongoDB connection error:", err));
};

module.exports = connectToMongo;
