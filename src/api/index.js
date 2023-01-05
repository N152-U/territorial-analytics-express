const express = require('express');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const celebrate = require('celebrate');
const { logDate, errorHandler } = require('../middleware/index.js');

const app = express();
const PORT = process.env.APP_PORT || 4000;
app.use(morgan('dev'));
app.use(cors());
app.use(logDate);
app.use(express.json({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../public/index.html`));
});

app.get('/public/tmp/*', (req, res) => {
  const fname=path.join(`${__dirname}/..${req.originalUrl}`);
  res.status(200).sendFile(fname, err => {
    if (err) {
        console.log(err);
        res.status(500).send('Recurso no encontrado');
    }
   fs.unlink(fname, (err) => {
       // log any error
       if (err) {
           console.log(err);
       }
    });
  });
});


app.get('/public/*', (req, res) => {
  console.log("req.originalUrl",req.originalUrl)
  res.sendFile(path.join(`${__dirname}/../${req.originalUrl}`));
});
app.get('/public/doc/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../..${req.originalUrl}`));
});
app.get('/public/css/*', (req, res) => {
  /* console.log("originalurl",req.originalUrl) */
  res.sendFile(path.join(`${__dirname}/../${req.originalUrl}`));
});
console.log(`Consulta API en: http://127.0.0.1:${PORT}/${process.env.APP_NAME}/api/v${process.env.APP_VERSION}`)
app.use(`/${process.env.APP_NAME}/api/v${process.env.APP_VERSION}`, require('../routers/index.js'));

app.use(celebrate.errors());
app.use(errorHandler);

app.set('etag', false)

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

module.exports = {
  app,
  PORT,
};
