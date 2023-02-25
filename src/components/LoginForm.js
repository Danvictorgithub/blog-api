import React, {useState, useEffect} from "react";
function LoginForm() {
	let url = "http://localhost:5454/api/login";
	const [data,setData] = useState({
		username:"",
		password:""
	});
	const [token,setToken] = useState(``);
	const [isInvalidPassword,setIsInvalidPassword] = useState(false);
	useEffect(() => 
		{		
			// console.log(localStorage.getItem('token'));
			if (localStorage.getItem('token') != null) {
				setToken(localStorage.getItem('token'));
			}
			else {
				// console.log("token is not in localStorage");
			}
		}
	,[]);
	useEffect(()=>{
	},[isInvalidPassword]);
	function updateData(e) {
		const newData = {...data};
		newData[e.target.name] = e.target.value;
		setData(newData);
	}
	async function postData(e) {
		e.preventDefault();
		let statusCode;
		let formData = {'username':data['username'],'password':data['password']};
		// console.log(formData);
			fetch(url,{
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
			body: new URLSearchParams(formData)
		})
		.then(response=> {
			statusCode = response.status;
			return response.json()})
		.then(response=> {
			console.log(response);
			if (statusCode === 400) {
				setIsInvalidPassword(true);
			}
			else {
				localStorage.setItem('token',`Bearer ${response["token"]}`);
				setToken(`Bearer ${response["token"]}`);
			}
		});		
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
			{isInvalidPassword ? <p className="invalidPassword">Invalid Username or Password</p> : <p className="invalidPassword"></p>}
			
		</div>
	);
}
export default LoginForm;