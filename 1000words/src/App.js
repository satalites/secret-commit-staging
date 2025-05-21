import React, { useState, useRef, useEffect  } from 'react';
import './App.css';
import { Auth } from './components/Auth'
import { signOut } from 'firebase/auth'
import Cookies from 'universal-cookie'
import { auth } from "./firebase-config"

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  if(!isAuth){
    return (
      <div>
        <Auth setIsAuth={setIsAuth}/>
      </div>
      );
  }

  return (
    <div>
      <h1>beginning project</h1>
    </div>
  );
}

export default App;