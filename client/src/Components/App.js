import React from "react";
import Navbar from "./Navbar";

const App = (props) => {
	return(
		<div>
			<Navbar />
			<div className="container mt-5">
				{ props.children }
			</div>
		</div>
	)
};

export default App;