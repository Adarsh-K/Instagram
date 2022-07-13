import React, { useEffect, useState } from 'react'
import './Post.css'
import { Avatar } from '@mui/material'
import { db } from './firebase';
import firebase from 'firebase'

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  }

  useEffect(() => {
    let unsub;
    if (postId) {
      unsub = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map(doc => doc.data()));
        });
    }

    return () => {
      unsub();
    }
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar"
          alt="Username"
          src="static/images/avatar/1.jpg"
        />
        <h3>{ username }</h3>
      </div>
      <img className="post__image"
        src={ imageUrl } alt="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
      <h4 className="post__text"><strong> { username }</strong> { caption }</h4>
      <div className="post__comments">
        {
          comments.map(comment => (
            <p>
              <strong>{ comment.username }</strong> { comment.text }
            </p>
          ))
        }
      </div>
      {
        user && (
        <form className='post__form'>
          <input
            className='post__input'
            type='text'
            placeholder='Add a comment'
            value={ comment }
            onChange={ e => setComment(e.target.value) } />
          <button
            className='post__button'
            type='submit'
            disabled={ !comment }
            onClick={ postComment }>
            Add
          </button>
        </form>
        )
      }
    </div>
  )
}

export default Post