import { createContext, useContext, useEffect, useState } from 'react';
import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero';


const App = () => {
  const [active, setActive] = useState(true)
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    localStorage.getItem("theme") ? setActive(true) : setActive(false)
  }, [])

  const changeTheme = (data) => {
    setActive(data)
  }


  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500">
      <Header toParent={changeTheme} activeSection={activeSection} />

      <Hero onSectionChange={setActiveSection} />
      {/* <Footer /> */}
    </div>
  );
};

export default App
