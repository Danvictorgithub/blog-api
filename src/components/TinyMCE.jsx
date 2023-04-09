import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TincyMCE({initContent}) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const content = "<p>Create your Blog post Here!</p>";
  function handleFilePicker(callback, value, meta) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        const imageData = reader.result;
        const blob = dataURItoBlob(imageData);

        // Call the callback function with the file blob and any other meta data
        callback(URL.createObjectURL(blob), { alt: file.name }, {});
      };
    };
  }
  function dataURItoBlob(dataURI) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
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
      <button onClick={log}>Log editor content</button>
    </>
  );
}