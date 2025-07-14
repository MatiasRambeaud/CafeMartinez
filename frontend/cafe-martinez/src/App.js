import React, { useEffect, useState } from "react";

const App = () => {

  const [product,setProduct] = useState([]);

  const getProduct = () => {
    fetch("/api/products")
    .then(res => res.json())
    .then(json => setProduct(json))
  }
  
  useEffect(()=>{
    getProduct()
  },[]);
console.log(product)
  return(
    <div>
      {product.map((data)=>{
        return(
          <>
            <h1>{data.title}</h1>
          </>
        )
      })}
    </div>
  )
}

export default App;