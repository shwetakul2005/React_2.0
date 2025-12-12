import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gallery from './Component'
import { MyImage } from './Component'
import { Profile } from './Component'

export default function App() {
  return (
    <>
      <MyImage />
      <Profile />
      <Gallery />
    </>
  );
};

// export default App
