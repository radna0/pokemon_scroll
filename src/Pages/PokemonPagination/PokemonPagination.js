import React, { useState,useEffect } from 'react'
import "./style.css"




    function PokemonPagination() {

    const [current, setCurrent] =useState(1)
    const [count, setCount] = useState(1)
    const [product, setProduct] = useState([])
    const [productPer, setProductPer] = useState(5)
    const [offset,setOffSet] = useState((current-1) * productPer)
    const showPages = 5






    useEffect(()=>{
        setCurrent(1)
    },[])

    const newdata =(data)=>{
        return{
         "id":data.id,
          "name":data.name,
          "image":data.sprites.front_default
        }
    }

    const fetchApi= async(offset, productPer,callback)=>{
      try{

      
        const data = await fetch(`${process.env.REACT_APP_POKEMONS_API}?offset=${offset}&limit=${productPer}`)
        const json = await data.json()
        callback(Math.ceil(json.count / productPer))
        json?.results.forEach(async(pokemon) => {
            const data = await fetch(`${process.env.REACT_APP_POKEMONS_API}/${pokemon.name}`)
            const json = await data.json()
            const poke = newdata(json)
            setProduct((p) =>[...p,poke])
            
        })
        }catch(error){
          alert(error)
        }
    }

    

    useEffect(()=>{
         
      fetchApi(offset, productPer , setCount)


    },[current, productPer])



    product.sort((a, b)=>{return a.id-b.id});


    const HandleChangePageSize = (event) => {
        setProduct([])
        setProductPer(event.target.value)


        var next = (Math.floor(offset / event.target.value) +1)

        setCurrent(next)
        setOffSet((next-1) * event.target.value)

    }

    var preventDefault = e => e.preventDefault();

     const handleClick = (id) => {

        setProduct([])

        setCurrent(Number(id));
        setOffSet((id-1) * productPer)
    };
    


    var diff = Math.floor(showPages / 2),
      start = Math.max(current - diff, 1),
      end = Math.min(start + showPages, count+1)

    if (count >= showPages && end >= count) {
      start = count - showPages;
    }



     var buttons = [],
      btnEvent,
      isCurrent;

    for (var i = start; i < end; i++) {
      isCurrent = current === i;
      // If the button is for the current page then disable the event.
      if (isCurrent) {
        btnEvent = preventDefault;
      } else {
        btnEvent = handleClick.bind(this, i);
      }
      buttons.push(
        <li key={i} className={`${isCurrent ? 'active' : null} list_showPages_links`}>
          <button  onClick={btnEvent} >
              {i}
          </button>
        </li>,
      );
    }



    var firstHandler = preventDefault;
    var prevHandler = preventDefault;
    var isNotFirst = current > 1;
    if (isNotFirst) {
        
      firstHandler = handleClick.bind(this,1);
      prevHandler = handleClick.bind(this, current-1);
    }

    // Next and Last button handlers and class.
    var nextHandler = preventDefault;
    var lastHandler = preventDefault;
    var isNotLast = current < count ;
    if (isNotLast) {
      nextHandler = handleClick.bind(this, current+1);
      lastHandler = handleClick.bind(this, count);
    }




    buttons = [
      <li key="first" className={`${!isNotFirst ? 'disabled' : null} list_showPages_links`}>
        <button
          onClick={firstHandler}
        >
          <span className="fa fa-angle-double-left" aria-hidden="true" />
        </button>
      </li>,
      <li key="prev" className={`${!isNotFirst ? 'disabled' : null} list_showPages_links`}>
        <button
          onClick={prevHandler}
        >
          <span className="fa fa-angle-left" aria-hidden="true" />
        </button>
      </li>,
    ].concat(buttons);

    buttons = buttons.concat([
      <li key="next" className={`${!isNotLast ? 'disabled' : null} list_showPages_links`}>
        <button
          onClick={nextHandler}
        >
          <span className="fa fa-angle-right" aria-hidden="true" />
        </button>
      </li>,
      <li key="last" className={`${!isNotLast ? 'disabled' : null} list_showPages_links`}>
        <button
          onClick={lastHandler}
        >
          <span className="fa fa-angle-double-right" aria-hidden="true" />
        </button>
      </li>,
     ]);

    
   
    
    return (
        <>
        <div className="collection_title">
          <h1>Pokemon</h1>
        </div>
        <div className="collection_container">
        
        {product.map((item) =>{

            return(
                <div key={item.id} className="pokemon-list-container">
                  <img src={item.image} />
                  <h2 >{item.id}.{item.name}</h2>
                </div>
            )
        })}
        </div>

        
        
        <div className="list_setPages_container">
        <label>Page Size:</label>
        <select className="list_pagesSize" onChange={HandleChangePageSize}>
          <option  value="5">5</option>
          <option  value="10">10</option>
          <option  value="20">20</option>
        </select>

          <ul className="list_showPages">
          {buttons}
          </ul>
          </div>
          </>




    )
    }

    export default PokemonPagination