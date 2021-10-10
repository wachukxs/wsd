const app = require('./web/app'); // Express

const port = process.env.PORT || 8088;
app.listen(port);
console.log('Server started at http://localhost:' + port);