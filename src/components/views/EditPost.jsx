import React, {useState,useEffect} from 'react';
import TinyMCE from '../TinyMCE.jsx';
import imageAreaLogo from '../icons/image-area.png';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost({urlApi,setIsLoggedIn}) {
	let {id} = useParams();
	const navigate = useNavigate();
	const [headLineImgPrev,setHeadLineImgPrev] = useState('');
	const [headLineImgUpload,setHeadLineImgUpload] = useState("");
	const [headLineTitle,setHeadLineTitle] = useState("");
	const [isInvalidType,setIsInvalidType] = useState(false);
	const [content,setContent] = useState(null);
	const [bodyContent,setBodyContent] = useState(null);
    useEffect(()=>{
		fetch(urlApi+`posts/${id}`).then(response => {
			if (response.status === 400) {
				navigate("/")
				return;
			}
			return response.json();
		})
		.then(response => {
			setContent(response.post);
		})
		.catch(error => console.log(error));
	},[]);
	useEffect(()=>{
		if(content){
            setHeadLineImgPrev(content.headlineImage);
            setHeadLineTitle(content.title);
			setBodyContent(content.content);
        }
	},[content]);
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
		<TinyMCE initContent={bodyContent} urlApi={urlApi} getData={getData} setIsLoggedIn={setIsLoggedIn} postId={content._id} isNewPost={true}/>
		</>
	);
}
export default EditPost;
