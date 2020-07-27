const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes/metrics.route.js')(app);

const port = 3001;

app.use(cors());

// routes
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to the time Metrics application." });
});


// listen for request on port 3001
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
