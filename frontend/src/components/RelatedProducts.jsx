import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/shopContext.jsx';


const RelatedProducts = ({category, subCategory}) => {
    const {products} = useContext(ShopContext);
    const[related, setRelated] = React.useState([]);

    React.useEffect(() => {
        if(products.length > 0){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => category === item.category );
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory );
            console.log(productsCopy.slice(0,4));
        }  
    }, [products]);

  return (
    <div>
      
    </div>
  )
}

export default RelatedProducts
