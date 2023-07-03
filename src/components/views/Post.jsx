import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
export default function Post({urlApi}) {
	let {id} = useParams();
	const [content,setContent] = useState(null);
	const navigate = useNavigate();
	useEffect(()=>{
		fetch(urlApi+`posts/${id}`).then(response => {
			if (response.status === 400) {
				navigate("/")
				return;
			}
			return response.json();
		}).then(response => setContent(response.post));
	},[]);
	// useEffect(()=> console.log(content),[content])
	function deletePost() {
		fetch(urlApi+`posts/${id}`,{
            method: "DELETE"
        }).then(response => {
            if (response.status === 400) {
                navigate("/")
                return;
            }
            return response.json();
        }).then(response => {
            navigate("/")
        });
	};
	return (
		<div className="blogPost">
			{(content === null) ?
			"Loading Content":
			<>
				<h2>Blog ID: {content._id}</h2>
				<h1>{content.title}</h1>
				<h2>{content.author.username}</h2>
				<img src={content.headlineImage} alt="Blog Hero"></img>
				<div className="content" dangerouslySetInnerHTML={{ __html: content.content }}></div>
				<Link to={`edit`}><button type="button" className="btn">Edit</button></Link>
				<button onClick={deletePost} className="btn">Delete</button>
			</>
			}
		</div>
	)
}
