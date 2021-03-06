const express = require('express');
const cors = require('cors');
const route = require('./app/route/route');

const app = express();


const port = process.env.PORT || 5000;
const appName = "My Rule-Validation API";


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use(cors());
app.use(route);

// base route

app.get('/', (req, res) => {
  console.log('My Rule-Validation API');
  res.send({
    "message": "My Rule-Validation API",
    "status": "success",
    "data": {
      "name": "Oghenekaro Uwede",
      "github": "@Okprime",
      "email": "uwedeoghenekaro@gmail.com",
      "mobile": "08138242853",
      "twitter": "@Oghenekarouwede"
    }
  });
});

app.listen(port, (res) => {
  console.log(`${appName} is listening on port ${port}`);
});
