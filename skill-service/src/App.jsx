import './App.css'
import { use, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from './store/app.context'
import Authenticated from '../hoc/authenticated.jsx'
import HomePagePublic from './views/HomePage/HomePagePublic.jsx'
import HomePagePrivate from './views/HomePage/HomePagePrivate.jsx'
import Login from './views/Login/Login.jsx'
import Signup from './views/Signup/Signup.jsx'


function App() {

  const [appState, setAppState] = useState({
    user: null,
    userData: null
  });

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
       <Routes>
        <Route path='/' element={<HomePagePublic />} />
        <Route path='/home' element={<Authenticated><HomePagePrivate /></Authenticated>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

       </Routes>
     
      </AppContext.Provider>
    </BrowserRouter>
  )
}

export default App
