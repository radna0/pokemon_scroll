import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import Pokemon from '../../Components/Pokemon/Pokemon'
import { typeColors } from '../../Resources/colors'

function PokemonScoll() {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
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

  const newdata = (data, species) => {
    return {
      id: data.id,
      name: data.name[0].toUpperCase() + data.name.slice(1),
      image: data.sprites.front_default,
      types: data.types,
      species: species,
      weight: data.weight,
      height: data.height,
      display:
        data.sprites.versions['generation-v']['black-white']['animated'][
          'front_default'
        ] || data.sprites.front_default,
      abilities: data.abilities,
    }
  }
  function setupPokemonAbout(species) {
    for (let flavor of species.flavor_text_entries) {
      if (flavor.language.name === 'en') {
        return dressUpPayloadValue(flavor.flavor_text)
      }
    }
  }
  function dressUpPayloadValue(string) {
    let splitStr = string
      .toLowerCase()
      .replace(/[\n\f]/g, ' ')
      .split(' ')
    splitStr[0] = splitStr[0][0].toUpperCase() + splitStr[0].slice(1)
    return splitStr.join(' ')
  }

  const fetchApi = async () => {
    const data = await fetch(`${process.env.REACT_APP_POKEMONS_API}?&limit=898`)
    const json = await data.json()
    json?.results.forEach(async (pokemon) => {
      const pokemonData = await fetch(
        `${process.env.REACT_APP_POKEMONS_API}/${pokemon.name}`
      )
      const pokemonJson = await pokemonData.json()
      const speciesData = await fetch(
        `${process.env.REACT_APP_POKEMONS_SPECIES_API}/${pokemonJson.id}`
      )
      const speciesJson = await speciesData.json()
      const species = setupPokemonAbout(speciesJson)

      const poke = newdata(pokemonJson, species)
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
      hiddenRef.current.offsetTop - 200
    ) {
      handleClick(totalPokemon / productPer + 1)
    }
  }

  const handleBlock = (item) => {
    console.log(item)
    setBlock({ ...item })
  }

  const getImageSize = (e) => {
    e.target.height *= 3
  }
  const animatePokemon = (e) => {
    e.target.className = 'slide-in'
  }

  return (
    <React.Fragment>
      {!loading && (
        <div className="homepage">
          <div id="search-bar">
            <input
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your Pokemon"
            />
            <div id="start-search-button" className="center">
              <i className="fas fa-search" />
            </div>
          </div>
          <div className="collection_container">
            {!search
              ? product
                  .sort((a, b) => {
                    return a.id - b.id
                  })
                  .slice(0, totalPokemon)
                  .map((item) => {
                    return (
                      <Pokemon
                        key={`${item.id}-pokemon-${item.name}`}
                        item={item}
                        product={product}
                        totalPokemon={totalPokemon}
                        hiddenRef={hiddenRef}
                        handleBlock={handleBlock}
                      />
                    )
                  })
              : product.map(
                  (item) =>
                    item.name.toLowerCase().includes(search) && (
                      <Pokemon
                        key={`${item.id}-pokemon-${item.name}`}
                        item={item}
                        product={product}
                        totalPokemon={totalPokemon}
                        hiddenRef={hiddenRef}
                        handleBlock={handleBlock}
                      />
                    )
                )}
          </div>
        </div>
      )}
      <div id="loading-div" className={!loading ? 'hideLoading' : ''}>
        <img className="loading-ball" alt="" />
      </div>
      {block && (
        <div className="pokemon-stand-alone" onClick={() => setBlock(null)}>
          <div
            className="pokemon-stand-alone-content container column center"
            onClick={(e) => e.stopPropagation()}
            onLoad={(e) => animatePokemon(e)}
          >
            <img
              id="current-pokemon-image"
              src={block.display}
              alt=""
              onLoad={(e) => getImageSize(e)}
            />
            <div id="current-pokemon-info">
              <h1>{block.name}</h1>
              <div className="row center ">
                {block.types.map((type) => {
                  const exactType = type.type.name

                  return (
                    <div
                      key={block.name + exactType + 'display'}
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
              <h4>Pokedex Entry</h4>
              <span id="current-pokemon-description">{block.species}</span>
              <div className="row center">
                <div className="width-100 column center margin-5">
                  <h4>Height</h4>
                  <div
                    id="current-pokemon-height"
                    className="pokemon-info-variable-container"
                  >
                    {block.height / 10}m
                  </div>
                </div>
                <div className="width-100 column center margin-5">
                  <h4>Weight</h4>
                  <div
                    id="current-pokemon-weight"
                    className="pokemon-info-variable-container"
                  >
                    {block.weight / 10}kg
                  </div>
                </div>
              </div>
              <h4>Abilities</h4>
              <div className="row center">
                {block.abilities.map((ability) => {
                  const name = ability.ability.name
                  const splitName = name.split('-')
                  console.log(splitName)
                  const newName = splitName
                    .map((word) => word[0].toUpperCase() + word.slice(1))
                    .join(' ')
                  return (
                    <div
                      key={block.name + name}
                      className="pokemon-info-variable-container"
                    >
                      {newName}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default PokemonScoll
