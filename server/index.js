const app = require("./app");
const port = process.env.PORT || 1337;

app.listen(port, () => { console.log(`listening on http://localhost:${ port }`) })