const app = require('./app');
const port = 4000;

const http = require('http').Server(app);

http.listen(port, () => {
  console.log(`listening on port ${port}...`);
});