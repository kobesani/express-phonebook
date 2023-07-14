const express = require("express");
const fs = require("fs");
const morgan = require('morgan');

let rawData = fs.readFileSync("./db.json");
let persons = JSON.parse(rawData).persons;

persons.forEach((element) => console.log(element));

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage =
        `A person (entry) with the id = ${id} was not found in the database`;
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxValue = 1e10;
  const maxTries = 10;
  let tryCounter = 0;

  while (true) {
    console.log(tryCounter);
    if (tryCounter === maxTries) {
      console.log(
        "Max tries to generate new id reached, exiting with max value"
      );
      return (
        persons.length > 0 ?
          Math.max(...persons.map((n) => n.id)) + 1 :
          0
      );
    }
    const candidateId = Math.floor(Math.random() * maxValue);
    if (persons.filter((person) => person.id === candidateId).length === 0) {
      return (candidateId);
    }
    tryCounter++;
  }
};

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

  if (persons.filter((person) => person.name === body.name).length > 0) {
    return (
      response
        .status(400)
        .json(
          {
            error: "The provided name already exists in the database."
          }
        )
    );
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = [...persons, person];
  console.log(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
