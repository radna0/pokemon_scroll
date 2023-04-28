import React from 'react'
import { typeColors } from '../../Resources/colors'
function Pokemon({ item, product, totalPokemon, hiddenRef, handleBlock }) {
  return (
    <div className="pokemon-list-box">
      <div
        className="pokemon-list-container"
        ref={item === product[totalPokemon - 1] ? hiddenRef : null}
        onClick={() => handleBlock(item)}
      >
        <img className="search-pokemon-image" alt="pokemon" src={item.image} />
        <h1>
          {item.id}.{item.name}
        </h1>
        <div className="row">
          {item.types.map((type) => {
            const exactType = type.type.name

            return (
              <div
                key={item.name + exactType}
                style={{
                  backgroundColor: typeColors[exactType],
                }}
                className="type-container"
              >
                {exactType}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pokemon
