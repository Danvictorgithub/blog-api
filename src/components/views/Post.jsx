import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
export default function Post({urlApi}) {
	let {id} = useParams();
	const [content,setContent] = useState(null);
	const navigate = useNavigate();
	useEffect(()=>{
		const response = fetch(urlApi+`posts/${id}`).then(response => {
			if (response.status == 400) {
				navigate("/")
				return;
			}
			return response.json();
		}).then(response => setContent(response.post));
	},[]);
	useEffect(()=> console.log(content),[content])
	//todo
		// identify if id exist in the database
		// format content
	return (
		<div className="blogPost">
			{(content === null) ?
			"Loading Content":
			<>
				<h2>Blog ID: {content._id}</h2>
				<h1>{content.title}</h1>
				<h2>{content.author.username}</h2>
				<img src={content.headlineImage}></img>
				<div className="content" dangerouslySetInnerHTML={{ __html: content.content }}></div>
			</>
			}
		</div>
	)
}
