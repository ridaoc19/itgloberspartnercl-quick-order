import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'
import { useCssHandles } from 'vtex.css-handles'

import './styles.css'

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (evt:any) => {
    setInputText(evt.target.value)
    console.log("Input changed", inputText);
  }

  const CSS_HANDLES = [
    "quickOrder__container",
    "quickOrder__title",
    "quickOrder__form",
    "quickOrder__label",
    "quickOrder__input",
    "quickOrder__submit"

  ]
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    console.log("El resultado de mi producto es", product, search);
    if(product) {
      let skuId = parseInt(inputText)
      console.log("Mis datos necesarios", skuId, product)
      addToCart ({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
      .then(() => {
        window.location.href = "/checkout"
      })
    }
  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }

  const searchProduct = (evt:any) => {
    evt.preventDefault();
    if(!inputText) {
      alert("Ingresar un producto")
    } else {
      console.log("Al final estamos buscando", inputText);
      setSearch(inputText)
      addProductToCart()
    }
  }

  return <div className={handles["quickOrder__container"]}>
    <h2 className={handles["quickOrder__title"]}>Compra rápida</h2>
    <form className={handles["quickOrder__form"]} onSubmit={searchProduct}>
      <div>
        <label className={handles["quickOrder__label"]} htmlFor="sku">Ingresa el número de SKU</label>
        <input className={handles["quickOrder__input"]} id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input className={handles["quickOrder__submit"]} type="submit" value="AÑADIR AL CARRITO" />
    </form>
  </div>
}
export default QuickOrder
