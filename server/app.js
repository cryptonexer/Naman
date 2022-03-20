const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './secure.env' });
const port = process.env.PORT;
const bodyparser = require('body-parser');






//middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
require('./db/conn');
app.use(require('./routes/party'));
app.use(require('./routes/voters'));
app.use(require('./routes/admin'));
app.use('/partysymbol', express.static('../server/Images/Party'));
app.use(express.json());





//server 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})