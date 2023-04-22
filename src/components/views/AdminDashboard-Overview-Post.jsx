import React from "react";
import {Link} from "react-router-dom";

export default function PostLink({title,id}) {
	return (
		<div className="Post">
			<Link to={`/dashboard/${id}`}><h4>{title}</h4></Link>
		</div>
	)
}