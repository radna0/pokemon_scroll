import React from 'react'

function Pokemon({ item, product, totalPokemon, hiddenRef, handleBlock }) {
  return (
    <div className="pokemon-list-box">
      <div
        className="pokemon-list-container"
        ref={item === product[totalPokemon - 1] ? hiddenRef : null}
        onClick={() => handleBlock(item)}
      >
        <img alt="pokemon" src={item.image} />
        <h1>
          {item.id}.{item.name[0].toUpperCase() + item.name.slice(1)}
        </h1>
      </div>
    </div>
  )
}

export default Pokemon
