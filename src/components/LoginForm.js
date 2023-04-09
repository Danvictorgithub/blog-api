import React, {useState, useEffect} from "react";
function LoginForm({token,urlApi,verifyUserToken}) {
	// login-form initialization
	const [data,setData] = useState({
		username:"",
		password:""
	});
	// Error indicators
	const [isInvalidPassword,setIsInvalidPassword] = useState(false);
	const [isNetworkError,setIsNetworkError] = useState(false);

	// useEffect(()=>{
	// },[isInvalidPassword]);

	// Collects login form-input
	function updateData(e) {
		const newData = {...data};
		newData[e.target.name] = e.target.value;
		setData(newData);
	}
	// saves login form-input -> form-data urlencoded to authentication API
	async function postData(e) {
		e.preventDefault();
		let statusCode;
		let formData = {'username':data['username'],'password':data['password']};
		// console.log(urlApi);
			fetch(urlApi+"login",{
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
			body: new URLSearchParams(formData)
		})
		.then(response=> {
			statusCode = response.status;
			return response.json()})
		.then(response=> {
			// console.log(response);
			// Catch Invalid password
			if (statusCode === 400) {
				setIsInvalidPassword(true);
			}
			else {
				// saves JWT token to LocalStorage
				localStorage.setItem('token',`Bearer ${response["token"]}`);
				setIsInvalidPassword(false);
				Promise.all([
					token.current = `Bearer ${response["token"]}`,
					verifyUserToken(token.current)
				]);
			}
		})
		.catch(() => {
			setIsNetworkError(true);
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
			{isInvalidPassword ? <p className="formError">Invalid Username or Password</p> : <p className="formError"></p>}
			{isNetworkError ? <p className="formError">Couldn't get request from server</p>:<p className="formError"></p>}
			
		</div>
	);
}
export default LoginForm;