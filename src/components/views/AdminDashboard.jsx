import React from 'react'
import {Link, Outlet} from 'react-router-dom';


function AdminDashboard({/*token,*/urlApi/*,verifyUserToken,setIsLoggedIn*/}) {
	return (
		<div className="AdminDashboard container wrapper">
			<div className="adminNav">
				<Link to="overview">Overview</Link>
				<Link to="createPost">Create Post</Link>
			</div>
			<div className="adminContent">
				<Outlet urlApi={urlApi}/>
			</div>
		</div>
	)
}
export default AdminDashboard;
