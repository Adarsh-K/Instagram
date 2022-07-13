import { Button } from '@mui/material'
import React, { useState } from 'react'
import { db, storage } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on("state_changed",
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log(progress);
      setProgress(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage.ref("images").child(image.name).getDownloadURL().then(url => {
        db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          imageUrl: url,
          username: username,
        })

        setProgress(0);
        setImage(null);
        setCaption('');
      });

    })
  }

  return (
    <div className='imageupload'>
      <div className="imageupload__items">
        <progress className='imageupload__progress' value={ progress } max="100" />
        <input
          type="text"
          placeholder='Enter a caption'
          value={ caption }
          onChange={ event => setCaption(event.target.value) }
          />
        <input type="file" onChange={ handleChange } />
        <Button onClick={ handleUpload }>
          Upload
        </Button>
      </div>
    </div>
  )
}

export default ImageUpload