import React, {useEffect, useState} from 'react';
import PostLink from "./AdminDashboard-Overview-Post";
function Overview ({urlApi}) {
	const [postList,setPostList] = useState([]);
	// const listPost = [{id:1,title:"meme1"},{id:2,title:"meme2"}];
	const [error,setError] = useState("");
	useEffect(()=> {
		fetch(urlApi+"posts")
			.then((response) => response.json())
			.then((response)=> {
				// console.log(response.posts);
				setPostList([...response.posts]);
				console.log("postList",postList);
			})
			.catch(()=>{
				setError("Unable to connect to server");
			})
	},[]);
	return (
		<>
		<p>{error}</p>
		{postList.map((post)=> {
			return <PostLink title={post.title} id={post._id}></PostLink>
		})}	
		</>
	)
}

export default Overview;