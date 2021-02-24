import axios from "axios";


export const clockIn = (data) => {
	return async () => {
		try {
			const res = await axios.post("http://localhost:1337/database/clockIn", data);

		} catch (error) {

		}
	};
}