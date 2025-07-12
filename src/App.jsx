import { useState } from 'react'

import './App.css'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './component/Login/Login'
import Admin from './component/Admin/Admin'
import Blog from './component/Blog/Blog';
import Product from './component/Product/Product';



function App() {
 

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login/>} />
    
      
      <Route path="/admin" element={<Admin/>} />
      <Route path="/" element={<Blog/>} />
      <Route path="/product" element={<Product/>} />
   
   
      
    </Routes>
  </Router>

  )
}

export default App
