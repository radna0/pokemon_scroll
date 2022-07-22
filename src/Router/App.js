import React from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import {  PokemonPagination , PokemonScoll } from "../Pages/index"
import Nav  from "../Components/Common/Nav"

function App() {
  return (
    <>
    <Nav />

      <Routes>
        <Route path="/pokemon_pagination" element={<PokemonPagination />} />
        <Route path="/pokemon_scroll" element={<PokemonScoll />} />
      </Routes>

    </>
  )
}

export default App
