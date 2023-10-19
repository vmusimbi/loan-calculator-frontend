import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Auth from "./components/Auth"
import HomePage from "./components/homepage"


function App(){
 return(
   <BrowserRouter>
   <Routes>
     <Route path="/"element={<Auth/>}/>
     <Route path="/homepage"element={<HomePage/>}/>
   </Routes>
   </BrowserRouter>
 )
}


export default App