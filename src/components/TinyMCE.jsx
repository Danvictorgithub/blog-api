import React, { useRef,useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from "react-router-dom";
import uniqid from "uniqid";
// import { redirect } from "react-router-dom";

export default function TinyMCE({initContent, urlApi,getData,setIsLoggedIn}) {
  const [message,setMessage] = useState("")
  const [errors,setErrors] = useState([]);

  const navigate = useNavigate();
  const editorRef = useRef(null);
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };
  const content = "<p>Create your Blog post Here!</p>";
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('img', file);
    const response = await fetch(urlApi+'posts/imageHandler',{
      method:'POST',
      body:formData
    });
    const data = await response.json();
    return data;
  }
  function handleFilePicker(callback, value, meta) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        // const imageData = reader.result;
        const response = await uploadImage(file);
        callback(response.img);
      }
    };
  }
  function getAllInput() {
    const data = getData();
    data["content"] = editorRef.current.getContent();
    return data;
  }
  async function postBlog() {
    const data = getAllInput();
    const formData = new FormData();
    const headers = new Headers({
      'Authorization': `${localStorage.getItem("token")}`,
    });
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    try {
    const response = await fetch(urlApi+'posts/add',{
      method:'POST',
      headers,
      body:formData
    })
    if (response.status === 401) {
      setIsLoggedIn(false);
      navigate("./");
      const responseObj = await response.json();
      return responseObj;
    }
    if (response.status === 400) {
      const responseObj = await response.json();
      console.log(responseObj);
      setMessage(responseObj.message);
      if (responseObj.errors !== undefined) {
        setErrors(responseObj.errors)
      }
      else {setErrors([])}
      return responseObj;
    }
    if (response.status === 200) {
      navigate("/");
      const responseObj = await response.json();
      return responseObj;
    }
    const responseObj = await response.json();
    return responseObj;
    } catch {
      setErrors([{msg:"Couldn't Connect to Server"}]);
    }
  }
  return (
    <>
      <Editor
        apiKey='7hxu0lcdg2vy8mrpu83h4e7s8vtyonpuoms3m62xomrzpybo'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue= {typeof initContent != "undefined" ? initContent: content}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount','image'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          //image plugin setup
          image_list: [
            { title: 'My image 1', value: 'https://www.example.com/my1.gif' },
            { title: 'My image 2', value: 'http://www.moxiecode.com/my2.gif' }
          ],
          a11y_advanced_options: true,
          file_picker_callback: handleFilePicker,
        }}
      />
      <button id="postSubmit" onClick={postBlog}>Submit Blog</button>
      <p>{message}</p>
      <ul className="errorList">
        {errors.map((error) => {
        return (
          <li key={uniqid()}>{error.msg}</li>
          )
       })}
      </ul>

    </>
  );
}
