import React, { useState } from "react"
import Image from "./image/img_1.png"


function Auth () {
   let [authMode, setAuthMode] = useState("signin")
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');


    const handleLogin = async (event) => {
        event.preventDefault();
        // Call API endpoint to authenticate user
        fetch('http://192.168.1.106:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Authentication failed');
            })
            .then((data) => {
                // Save auth token to local storage or cookies
                localStorage.setItem('authToken', data.token);
                console.log("test")
                // Redirect user to homepage or home page
                window.location.href = '/homepage';
            })
            .catch((error) => {
                console.log(error);
            });
    };
       const handleSubmit = event => {
           event.preventDefault();
           var data = {
               'email': email,
               'password': password,
           }


           fetch('http://192.168.1.106:3001/register', {
               method: 'POST',
               headers: {
                   Accept: 'application/form-data',
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
           })
               .then(res => res.json())
               .then(
                   (result) => {
                       alert(result['message'])
                       if (result['status'] === 'ok') {
                           window.location.href = '/';
                       }
                   }
               )
           console.log(data)
       }


   const changeAuthMode = () => {
       setAuthMode(authMode === "signin" ? "signup" : "signin")
   }


   if (authMode === "signin") {
       return (
           <div className="Auth-form-container">
               <form className="Auth-form" onSubmit={handleLogin}>
                   <div className="Auth-form-content">
                       <div className="flex items-center space-y-2 pb-4 flex-col">
                           <img src={Image} className="w-20" alt="Loan Calculator"/>
                               <h3 className="text-base  md:text-lg tracking-wider font-medium text-blue-400 uppercase">Loan Calculator
                           </h3>


                       </div>
                       <div className="text-center">
                           Not registered yet?{" "}
                           <span className="link-primary" onClick={changeAuthMode}>
               Sign Up
             </span>
                       </div>
                       <div className="form-group mt-3">
                           <label>Email</label>
                           <input
                               type="text"
                               className="form-control mt-1"
                               placeholder="Enter username"
                               id={email}
                               value={email}
                               required
                               onChange={(e) => setEmail(e.target.value)}
                           />
                       </div>
                       <div className="form-group mt-3">
                           <label>Password</label>
                           <input
                               type="number"
                               className="form-control mt-1"
                               placeholder="Enter password"
                               id={'password'}
                               value={password}
                               required
                               onChange={(e) => setPassword(e.target.value)}
                           />
                       </div>
                       <div className="d-grid gap-2 mt-3">
                           <button type="submit" className="btn btn-primary">
                               Submit
                           </button>
                       </div>
                       <p className="text-center mt-2">
                           Forgot <a href="#">password?</a>
                       </p>
                   </div>
               </form>
           </div>
       )
   }


   return (
       <div className="Auth-form-container">
           <form className="Auth-form" onSubmit={handleSubmit}>
               <div className="Auth-form-content">
                   <h3 className="Auth-form-title">Sign In</h3>
                   <div className="text-center">
                       Already registered?{" "}
                       <span className="link-primary" onClick={changeAuthMode}>
             Sign In
           </span>
                   </div>
                   <div className="form-group mt-3">
                       <label>Email:</label>
                       <input
                           type="text"
                           className="form-control mt-1"
                           placeholder="e.g Janedoe@gmail.com"
                           id={'email'}
                           value={email}
                           required
                           onChange={(e) => setEmail(e.target.value)}
                       />
                   </div>
                   <div className="form-group mt-3">
                       <label>Password:</label>
                       <input
                           type="number"
                           className="form-control mt-1"
                           placeholder="Enter Password"
                           id="password"
                           value={password}
                           required
                           onChange={(e) => setPassword(e.target.value)}
                       />
                   </div>
                   <div className="d-grid gap-2 mt-3">
                       <button type="submit" className="btn btn-primary">
                           Submit
                       </button>
                   </div>
                   <p className="text-center mt-2">
                       Forgot <a href="#">password?</a>
                   </p>
               </div>
           </form>
       </div>
   )
}
export default Auth