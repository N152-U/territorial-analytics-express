require('dotenv').config();

const { app, PORT } = require('./api/index.js');


app.listen(PORT, () => {
  console.log(`Server initialized on PORT: ${PORT}`);
});
