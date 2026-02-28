import React, {useState} from 'react';
import {API_URL} from '../../data/apiPath';

// ✅ Added loginSuccessHandler prop
const Login = ({showWelcomeHandler, loginSuccessHandler}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const loginHandler = async (e)=>{
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/vendor/login`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })

            const data = await response.json();

            if(response.ok){

                alert("Login successfull");

                localStorage.setItem('loginToken', data.token)

                const vendorId = data.vendorId
                console.log("checking for vendorId", vendorId)

                // ✅ Fetch vendor details BEFORE calling loginSuccessHandler
                const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`)
                const vendorData = await vendorResponse.json();

                if(vendorResponse.ok){

                   const vendorFirmId = vendorData.vendorFirmId;
                   const vendorFirmName = vendorData.vendor.firm?.[0]?.firmName;

                   console.log("checking for firmId",vendorFirmId);

                   if(vendorFirmId){
                      localStorage.setItem('firmId', vendorFirmId)
                   }

                   if(vendorFirmName){
                      localStorage.setItem('firmName', vendorFirmName )
                   }
                }

                // ✅ NOW call success handlers (after firm check)
                loginSuccessHandler();
                showWelcomeHandler();

                setEmail("")
                setPassword("")
            }

        } catch (error) {
            console.error(error)
        }
    }

  return (
   <div className="loginSection">
        <form className='authForm' onSubmit={loginHandler} >
            <h3>Vendor Login</h3>

            <label>Email</label> 
            <input 
              type="email"
              name='email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Enter your email' 
            />

            <br />

            <label>Password</label>
            <input 
              type="password"
              name='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder='Enter your password' 
            />

            <br />

            <div className="btnSubmit">
                <button type='submit'>Submit</button>
            </div>
        </form>
   </div>
  )
}

export default Login