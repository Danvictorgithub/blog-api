import githubLogo from "./icons/GitHub-Mark.png";
function Footer() {
	return (
		<div className="footer">
			<img className="githubLogo" src={githubLogo} alt="logo"/>
			<h2>Made By: Danvictorgithub</h2>
		</div>
	);
}

export default Footer;