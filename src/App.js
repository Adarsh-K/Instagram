import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Button, Input, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import ImageUpload from './ImageUpload'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch(error => alert(error.message));
    
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

    return () => unsub();
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  return (
    <div className="app">
      <Modal
        open={ open }
        onClose={ () => setOpen(false) }>
        <Box sx={style}>
          <form className="app__signup">
              <img className="app__formImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""/>
              <Input
                placeholder='username'
                type='text'
                value={ username }
                onChange={ e => setUsername(e.target.value) }>
              </Input>
              <Input
                placeholder='email'
                type='text'
                value={ email }
                onChange={ e => setEmail(e.target.value) }>
              </Input>
              <Input
                placeholder='password'
                type='password'
                value={ password }
                onChange={ e => setPassword(e.target.value) }>
              </Input>
              <Button
                onClick={ signUp }>
                Sign Up
              </Button>
          </form>
        </Box>
      </Modal>
      
      <Modal
        open={ openSignIn }
        onClose={ () => setOpenSignIn(false) }>
        <Box sx={style}>
          <form className="app__signup">
              <img className="app__formImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""/>
              <Input
                placeholder='email'
                type='text'
                value={ email }
                onChange={ e => setEmail(e.target.value) }>
              </Input>
              <Input
                placeholder='password'
                type='password'
                value={ password }
                onChange={ e => setPassword(e.target.value) }>
              </Input>
              <Button
                onClick={ signIn }>
                Log In
              </Button>
          </form>
        </Box>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="" />

        {
          user ? (
            <Button onClick={ () => auth.signOut() }>Log Out</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={ () => setOpenSignIn(true) }>Log In</Button>
              <Button onClick={ () => setOpen(true) }>Sign Up</Button>
            </div>
          )
        }
      </div>

      <div className="app__posts">
        {
          posts.map(({ id, post }) => (
            <Post key={id} postId={id} user={user} username={ post.username } caption={ post.caption } imageUrl= { post.imageUrl } />
          ))
        }
      </div>

      <div className="app__footer">
        {
          user?.displayName ? (
            <ImageUpload username={ user.displayName }/>
          ) : (
            <h3 className='app__login'>Login to upload</h3>
          )
        }
      </div>
    </div>
  );
}

export default App;
