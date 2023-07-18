const mongoose = require("mongoose")

const username = process.env.MONGODB_UN;
const clusterUrl = "cluster0.fyizezj.mongodb.net";
const dbName = "personApp";
const password = process.env.MONGODB_PW;

const uri = `mongodb+srv://${username}:${password}` +
  `@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

console.log("Connecting to MongoDB");
mongoose
  .connect(uri)
  .then(result => console.log("Connected to MongoDB"))
  .catch(error => console.log("Error connecting to MongoDB"));

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  }
);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);
