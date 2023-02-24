import React, {useState} from "react";
function LoginForm() {
	let url = "http://localhost:5454/api/login";
	const [data,setData] = useState({
		username:"",
		password:""
	});
	function updateData(e) {
		const newData = {...data};
		newData[e.target.name] = e.target.value;
		setData(newData);
	}

	async function postData(e) {
		e.preventDefault();
		let token;
		let formData = {'username':data['username'],'password':data['password']};
		// console.log(formData);
		fetch(url,{
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
			body: new URLSearchParams(formData)
		}).then(response=> response.json()).then(response=> {console.log(response);token = response});
	}
	return (
		<div className="loginForm container">
			<img className="icon" src="favicon.png" alt="icon"/>
			<h2>Sign in</h2>
			<form>
				<label htmlFor="username">
					<input onChange={updateData} type="text" id="username" name="username" placeholder="username"></input>
				</label>
				<label htmlFor="password">
					<input onChange={updateData} type="password" id="password" name="password"></input>
				</label>
				<button onClick={postData} type="submit">Sign in</button>
			</form>
		</div>
	);
}
export default LoginForm;