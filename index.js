const cors = require("cors");
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const morgan = require('morgan');
const Person = require("./models/person.js");

let rawData = fs.readFileSync("./db.json");
let persons = JSON.parse(rawData).persons;

persons.forEach((element) => console.log(element));

const app = express();

app.use(express.static("build"))
app.use(cors());

// json parsing middleware for request/response json bodies
app.use(express.json());

// configure morgan logging to log request body as well
// use tiny config string with the added token below
morgan.token(
  'req-body',
  (request, response) =>
    JSON.stringify(request.body)
);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello, Phonebook!</h1>");
});

app.get("/info", (request, response) => {
  const currentTimestamp = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>` +
      `<p>${currentTimestamp}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(notes => {
    response.json(notes);
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person
    .findById(request.params.id)
    .then(
      matchingPerson => {
        console.log(matchingPerson);
        response.json(
          {
            id: matchingPerson._id,
            name: matchingPerson.name,
            number: matchingPerson.number
          }
        );
      }
    )
    .catch(
      error => {
        response
          .setHeader(
            "X-Status-Message",
            `Person with id = ${request.params.id} not found`
          );
        response.status(404).end();
      }
    );
});

app.delete("/api/persons/:id", (request, response) => {
  // Person.findByIdAndDelete(request.params.id)
  //   .then((deletedDocument) => {
  //     if (deletedDocument) {

  //     }
  //   })
  //   .catch();
  const id = Number(request.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!(body.name && body.number)) {
    return (
      response
        .status(400)
        .json(
          {
            error: "Both name and number must be provided."
          }
        )
    );
  }

  Person
    .findOne({name: body.name})
    .then(
      foundPerson => {
        console.log(foundPerson);
        if (foundPerson) {
          return (
            response.status(400).json({
              error: "The provided name already exists in the database."
            })
          );
        }

        const personToAdd = new Person({
          name: body.name, number: body.number
        });
        personToAdd.save().then(savedPerson => response.json(savedPerson));
      }
    )
    .catch(
      error => response.status(400).json(
        {error: `Error retrieving person: ${error}`}
      )
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
