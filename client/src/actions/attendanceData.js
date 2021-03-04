const axios = require('axios');

async function attendance() {


    let res = await axios.get("http://localhost:1337/database/attendance");

    let data = res.data;
    console.log(data);
}

attendance();