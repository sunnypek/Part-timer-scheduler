import axios from "axios";


export const clockIn = (data) => {
	return async () => {
		try {
			const res = await axios.post("http://localhost:1337/database/clockIn", data);
			console.log(res);	
		} catch (error) {
			console.log(error);
		}
	};
}

export const clockOut = (data)=> {
	return async () => {
		try {
			const res = await axios.post("http://localhost:1337/database/clockOut", data);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	}
}