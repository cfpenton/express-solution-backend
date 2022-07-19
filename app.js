const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

//Server configuration
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());

//Routes
app.use(require('./routes/performance'));

//Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});