import React from 'react'
import {Link, Outlet} from 'react-router-dom';


function AdminDashboard({/*token,*/urlApi/*,verifyUserToken,setIsLoggedIn*/}) {
// 	useEffect(() => 
  //   {  
  //     console.log("this is called");
  //     if (localStorage.getItem('token') != null) {
  //       token.current = localStorage.getItem('token');
  //       verifyUserToken(token.current);
  //     }
  //     else {
  //     }
  //   }
  // ,[]);
	
	return (
		<div className="AdminDashboard container wrapper">
			<div className="adminNav">
				<Link to="overview">Overview</Link>
				<Link to="createPost">Create Post</Link>
				<Link to="updatePost">Update Post</Link>
				<Link to="deletePost">Delete Post</Link>
			</div>
			<div className="adminContent">
				<Outlet urlApi={urlApi}/>
			</div>
		</div>
	)
}
export default AdminDashboard;