
import express from 'express'

import history from 'connect-history-api-fallback'
const app = express();
const port = process.env.PORT || 5000;

app.use(history())
// Serve all the files in '/dist' directory
app.use(express.static('dist'));


app.listen(port, function () {
    console.log('Listening on port ' + port)
});