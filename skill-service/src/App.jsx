import './App.css'
import { use, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppContext } from './store/app.context'
import Footer from './components/Footer/Footer'

function App() {

  const [appState, setAppState] = useState({
    user: null,
    userData: null
  });

  return (
    <BrowserRouter>
    <AppContext.Provider value={{...appState, setAppState}}>
    <>
      <h1>Skill Service</h1>
      <div>
        <p>
         This is an app for peoples skills.
        </p>
      </div>
      <Footer/>
    </>
    </AppContext.Provider>
    </BrowserRouter>
  )
}

export default App
