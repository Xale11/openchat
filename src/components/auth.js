import React, { useState } from 'react'
import "./auth.css"
import {FcGoogle} from "react-icons/fc"
import img from "./img/authImage.png"
import {collection} from "firebase/firestore"
import { db, auth, GoogleAuth } from '../config/firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {

    const [signUp, setSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const GoogleSignup = async () => {
        try{
            await signInWithPopup(auth, GoogleAuth)
            navigate("/messenger")
        } catch (err){
            console.error(err)
        }
    }

    const signupUser = async () => {
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            navigate("/messenger")
        } catch (err){
            console.error(err)
        }
    }

    const loginUser = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/messenger")
        } catch (err){
            console.error(err)
        }
    }
   

  return (
    <div className='auth'>
        <div className="title">Openchat</div>
        <div className="login">
            {signUp && <div className='loginBtn' onClick={() => setSignUp(false)}>Already have an account</div>}
            {!signUp && <div className="loginInputs">
                <h1 className="loginTitle">Log in</h1>
                <label >Email</label>
                <input type="email" placeholder='Enter email...' onChange={(e) => setEmail(e.target.value)}/>
                <label >Password</label>
                <input type="password" placeholder='Enter password...' onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={loginUser}>Log in</button>
            </div>}
            <div className="or"></div>
            {signUp && <div className="signupInputs">
                <h1 className="loginTitle">Sign Up</h1>
                <label >Email</label>
                <input type="email" placeholder='Enter email...' onChange={(e) => setEmail(e.target.value)}/>
                <label >Password</label>
                <input type="password" placeholder='Enter password...' onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={signupUser}>Sign up</button>
                
            </div>}
            {!signUp && <h1 className='signup' onClick={() => setSignUp(true)}>Sign Up Now!</h1>}
            <div className="or"></div>
            <div className="googleLogin">
                <div onClick={GoogleSignup}>Continue with <FcGoogle/></div>
            </div>
        </div>
        <div className="authImage">
            <img src={img} alt="" />
        </div>
    </div>
  )
}

export default AuthPage