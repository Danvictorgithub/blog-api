import React from "react";
import {useParams} from "react-router-dom";
export default function Post() {
	let {id} = useParams();
	//todo
		// identify if id exist in the database
		// format content
	return (
		<div>
			<h1>{id}</h1>
		</div>
	)
}