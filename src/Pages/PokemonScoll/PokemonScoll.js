import React, { useState,useEffect, useRef  } from 'react'
import "./style.css"




    function PokemonScoll() {

    const [current, setCurrent] =useState(1)
    const [product, setProduct] = useState([])
    const [productPer] = useState(30)
    const [offset,setOffSet] = useState((current-1) * productPer)
    const [totalPokemon, setTotalPokemon] = useState(offset + productPer)
    






    useEffect(()=>{
        setCurrent(1)
        setTotalPokemon(offset + productPer)
    },[])

    const newdata =(data)=>{
        return{
         "id":data.id,
          "name":data.name,
          "image":data.sprites.front_default
        }
    }

    const fetchApi= async(offset, productPer)=>{
      
        const data = await fetch(`${process.env.REACT_APP_POKEMONS_API}?offset=${offset}&limit=${productPer}`)
        const json = await data.json()
        json?.results.forEach(async(pokemon) => {
            const data = await fetch(`${process.env.REACT_APP_POKEMONS_API}/${pokemon.name}`)
            const json = await data.json()
            const poke = newdata(json)
            setProduct((p) =>[...p,poke])
            
            
        })
    }

    

    useEffect(()=>{
         
      fetchApi(offset, productPer )



    },[current, totalPokemon])


    product.sort((a, b)=>{return a.id-b.id});

    
     const handleClick = (id) => {

        
       setTotalPokemon(((id-1) * productPer) + productPer)
       setOffSet((id-1) * productPer)
       setCurrent(Number(id));
    };
    

    const hiddenRef = useRef();
    
    useEffect(() => {
        
        window.addEventListener('scroll', scrollHandler);
     
    }, [window.scrollY]);
    
    const scrollHandler = () => {
      
        if(window.pageYOffset + window.innerHeight >= (hiddenRef.current.offsetTop + 300 )){
          handleClick((totalPokemon / productPer) + 1)
        }
        
    }
  

  

    
   
    
    return (
      <>
        <div className="collection_title">
          <h1>Pokemon</h1>
        </div>
        <div 
        className="collection_container"
        
        >
        
        {product.map((item) =>{

            return(
                <div 
                key={`${item.id}_pokemon_scroll`} 
                className="pokemon-list-container"
                ref={item === product[totalPokemon - 1]? hiddenRef : null}
                >
                  <img src={item.image} />
                  <h2 >{item.id}.{item.name}</h2>
                </div>
            )
        })}
        </div>

        
        
    </>




    )
    }

    export default PokemonScoll