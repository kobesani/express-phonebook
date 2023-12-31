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
      minLength: 9,
      required: true,
      validate: [
        {
          validator: (number) => {
            return (number.split("-").length === 2);
          },
          message: "Invalid number - needs two parts separated by '-'"
        },
        {
          validator: (number) => {
            const firstPart = number.split("-")[0];
            return (2 <= firstPart.length && firstPart.length <=3);
          },
          message: "Invalid number - first part needs to have 2-3 digits"
        },
        {
          validator: (number) => {
            return (/^\d{2,3}-\d+$/.test(number));
          },
          message: "Invalid number - parts can only contain numbers"
        }
      ]
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
