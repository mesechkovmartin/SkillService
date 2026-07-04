import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Authenticated from '../hoc/authenticated.jsx'
import HomePagePublic from './views/HomePage/HomePagePublic.jsx'
import HomePagePrivate from './views/HomePage/HomePagePrivate.jsx'
import Login from './views/Login/Login.jsx'
import Signup from './views/Signup/Signup.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import MyServices from './views/MyServices/MyServices.jsx'
import PostDetails from './views/PostDetails/PostDetails.jsx'
import Profile from './views/Profile/Profile.jsx'
import Messages from './views/Messages/Messages.jsx'

function App() {

  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<HomePagePublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Authenticated><HomePagePrivate /></Authenticated>} />
        <Route path="/my-services" element={<Authenticated><MyServices /></Authenticated>} />
        <Route path="/posts/:id" element ={<Authenticated><PostDetails /></Authenticated>} />
        <Route path="/profile" element={<Authenticated><Profile /></Authenticated>} />
        <Route path="/messages" element={<Authenticated><Messages /></Authenticated>} />
       </Routes>
    </BrowserRouter> 
  )
}

export default App
