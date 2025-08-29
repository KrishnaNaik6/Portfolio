import { createContext, useContext, useEffect, useState } from 'react';
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero';


const App = () => {
  const [active, setActive] = useState(true)

  useEffect(()=>{
    localStorage.getItem("theme") ? setActive(true) : setActive(false)

  }, [])
  
  const changeTheme = (data) => {
    setActive(data)
  }

  return (
      <div className="main">
        <Header toParent={changeTheme} />

        <div className='cond_re'>
          <Hero />
        </div>
        {/* <Footer /> */}
      </div>
  );
};

export default App
