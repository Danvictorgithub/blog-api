import React, {useState} from 'react';
import TinyMCE from '../TinyMCE.jsx';
import imageAreaLogo from '../icons/image-area.png';
function CreatePost({urlApi,setIsLoggedIn}) {
	const [headLineImgPrev,setHeadLineImgPrev] = useState('https://firebasestorage.googleapis.com/v0/b/leeman-s-tech-blog.appspot.com/o/BlogProject%2Fimages%2Fdefault.jpg?alt=media&token=b5a6eda8-d471-4bdd-86f6-9545104a0488');
	const [headLineImgUpload,setHeadLineImgUpload] = useState("");
	const [headLineTitle,setHeadLineTitle] = useState("");
	const [isInvalidType,setIsInvalidType] = useState(false);
	function setHeadLine(e) {
		const file = e.target.files[0];
		if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/gif') {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
			setHeadLineImgPrev(reader.result);
			setHeadLineImgUpload(file);
			}
		} else {
			setIsInvalidType(true);
		}
	}
	function updateHeadLineTitle(e) {
		setHeadLineTitle(e.target.value);
	}
	function getData() {
		//author -> through JWT
		//title
		//headlineimg
		//content-wysiwyg
		const data = {
			title:headLineTitle,
			headlineImage:headLineImgUpload,
		};
		return data;
	}
	return (
		<>
		<h1>Create Post</h1>
		<h2 style={{textAlign:"center"}}>Upload Blog Headline Image</h2>
		<label htmlFor="headLineUpload">
			<input id="headLineUpload" type="file" onChange={setHeadLine} accept="image/png, image/jpg, image/gif, image/jpeg" ></input>
			<span id="uploadHeadLineImage" >
				Upload Image
				<img src={imageAreaLogo} alt="imageAreaLogo"></img>
			</span>
		</label>
		{isInvalidType ? <p style={{color:"red"}}>Invalid File Extension</p>: <></>}
		<textarea id="headLineTitle" type="text" value={headLineTitle} onChange={updateHeadLineTitle} placeholder="Enter Blog Title" minLength="8" maxLength="32"></textarea>
		<img className="imgPreview" src={headLineImgPrev} alt="Headline Preview" ></img>
		<TinyMCE urlApi={urlApi} getData={getData} setIsLoggedIn={setIsLoggedIn}/>
		</>
	);
}
export default CreatePost;