// import axios from "axios";


// export const attendance = (data) => {
// 	return async () => {
// 		try {
// 			const res = await axios.get("http://localhost:1337/database/getEmployees");
// 			console.log(res);	
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// }

const axios = require('axios');

async function attendance() {


    let res = await axios.get("http://localhost:1337/database/attendance");

    let data = res.data;
    console.log(data);
}

attendance();