import React from 'react'
import {Link, Outlet} from 'react-router-dom';


function AdminDashboard() {

	return (
		<div className="AdminDashboard container wrapper">
			<div className="adminNav">
				<Link to="overview">Overview</Link>
				<Link to="createPost">Create Post</Link>
				<Link to="updatePost">Update Post</Link>
				<Link to="deletePost">Delete Post</Link>
			</div>
			<div className="adminContent">
				<Outlet />
			</div>
		</div>
	)
}
export default AdminDashboard;