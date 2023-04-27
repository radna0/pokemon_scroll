import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import Pokemon from '../../Components/Pokemon/Pokemon'

function PokemonScoll() {
  const [loading, setLoading] = useState(false)
  const [block, setBlock] = useState(null)
  const [current, setCurrent] = useState(1)
  const [product, setProduct] = useState([])
  const [productPer] = useState(25)
  const [offset, setOffSet] = useState((current - 1) * productPer)
  const [totalPokemon, setTotalPokemon] = useState(offset + productPer)

  useEffect(() => {
    setCurrent(1)
    setTotalPokemon(offset + productPer)
  }, [])

  const newdata = (data) => {
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      display:
        data.sprites.versions['generation-v']['black-white']['animated'][
          'front_default'
        ] || data.sprites.front_default,
    }
  }

  const fetchApi = async () => {
    const data = await fetch(
      `${process.env.REACT_APP_POKEMONS_API}?&limit=1000`
    )
    const json = await data.json()
    json?.results.forEach(async (pokemon) => {
      const data = await fetch(
        `${process.env.REACT_APP_POKEMONS_API}/${pokemon.name}`
      )
      const json = await data.json()
      const poke = newdata(json)

      setProduct((p) => [...p, poke])
    })
  }

  useEffect(() => {
    async function loadAsync() {
      setLoading(true)
      await fetchApi()
      setLoading(false)
    }
    loadAsync()
  }, [])

  const handleClick = (id) => {
    setTotalPokemon((id - 1) * productPer + productPer)
    setOffSet((id - 1) * productPer)
    setCurrent(Number(id))
  }

  const hiddenRef = useRef()

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)
  }, [window.scrollY])

  const scrollHandler = () => {
    if (
      window.pageYOffset + window.innerHeight >=
      hiddenRef.current.offsetTop - 300
    ) {
      handleClick(totalPokemon / productPer + 1)
    }
  }

  const handleBlock = (item) => {
    setBlock({ ...item })
  }
  console.log(totalPokemon)

  return (
    <React.Fragment>
      {!loading && (
        <div>
          <div className="collection_title">
            <h1>Pokemon</h1>
          </div>
          <div className="collection_container">
            {product
              .sort((a, b) => {
                return a.id - b.id
              })
              .slice(0, totalPokemon)
              .map((item, index) => {
                return (
                  <Pokemon
                    key={`${item.id}_pokemon_scroll`}
                    item={item}
                    product={product}
                    totalPokemon={totalPokemon}
                    hiddenRef={hiddenRef}
                    handleBlock={handleBlock}
                  />
                )
              })}
          </div>
        </div>
      )}
      <div id="loading-div" className={!loading && 'hideLoading'}>
        <img className="loading-ball" alt="" />
      </div>
      {block && (
        <div className="pokemon-stand-alone" onClick={() => setBlock(null)}>
          <div
            className="pokemon-stand-alone-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={block.display} alt="" />
            <h1>{block.name}</h1>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default PokemonScoll
