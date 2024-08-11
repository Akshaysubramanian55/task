import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useParams, } from 'react-router-dom';
import Signin from './Components/Signin/Signin';
import Signup from './Components/Signup/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
function App() {

  return (
    <>
       <Router>
        <div>
          <Routes>
            <Route path='/' exact element={<Signin />} />
            <Route path='/signup' exact element={<Signup />} />.
            <Route path='/Dashboard' exact element={<Dashboard/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
