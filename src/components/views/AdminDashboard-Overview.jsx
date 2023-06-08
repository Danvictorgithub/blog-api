import React, {useEffect, useState} from 'react';
import uniqid from "uniqid";
import { Link } from 'react-router-dom';
function Overview ({urlApi}) {
	const [postList,setPostList] = useState([]);
	// const listPost = [{id:1,title:"meme1"},{id:2,title:"meme2"}];
	const [error,setError] = useState("");
	useEffect(()=> {
		fetch(urlApi+"posts")
			.then((response) => response.json())
			.then((response)=> {
				setPostList([...response.posts]);
			})
			.catch(()=>{
				setError("Unable to connect to server");
			})
	},[]);
	useEffect(()=> console.log(postList),[postList])
	return (
		<>
		<p>{error}</p>
		{postList.map((post)=> {
			return <div className="Post" key={ uniqid() }>
				<Link to={`/dashboard/${post._id}`}><h4>{post.title}</h4></Link>
			</div>
		})}
		</>
	)
}

export default Overview;
