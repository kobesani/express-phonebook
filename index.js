const cors = require("cors");
const express = require("express");
const fs = require("fs");
const morgan = require('morgan');
const Person = require("./models/person.js");

let rawData = fs.readFileSync("./db.json");
let persons = JSON.parse(rawData).persons;

persons.forEach((element) => console.log(element));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    console.log(error);
    response.setHeader(
      "X-Status-Message",
      `400 - bad request, please make sure the id is formatted properly`
    );
    return (
      response
        .status(400)
        .send({error: `malformatted id = ${request.params.id}`})
    );
  } else if (error.name === "ValidationError") {
    response.setHeader(
      "X-Status-Message",
      `400 - bad request, please make sure the data is formatted properly`
    );
    return (response.status(400).json({error: error.message}))
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

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

app.get("/api/persons/:id", (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(
      matchingPerson => {
        if (!matchingPerson) {
          response.setHeader(
            "X-Status-Message",
            `Person with id = ${request.params.id} not found`
          );
          return (response.status(404).end());
        }
        console.log(matchingPerson);
        return (response.json(matchingPerson));
      }
    )
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(
      deletedPerson => {
        if (!deletedPerson) {
          response.setHeader(
            "X-Status-Message",
            `Person with id = ${request.params.id} not found.`
          );
          return (response.status(404).end());
        }
        return (response.status(204).json(deletedPerson));
      }
    )
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params.id,
    {name: request.body.name, number: request.body.number},
    {new: true, runValidators: true, context: "query"}
  )
    .then(
      updatedPerson => {
        if (!updatedPerson) {
          response.setHeader(
            "X-Status-Message",
            `Person with id = ${request.params.id} not found.`
          );
          return (response.status(404).end());  
        }
        response.json(updatedPerson);
      }
    )
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

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

        new Person({name: body.name, number: body.number})
          .save()
          .then(savedPerson => response.json(savedPerson))
          .catch(error => next(error));
      }
    )
    .catch(
      error => response.status(400).json(
        {error: `Error retrieving person: ${error}`}
      )
    );
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
