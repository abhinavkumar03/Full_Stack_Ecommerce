import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  // Frontend React code
  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data));

    const token = localStorage.getItem("auth-token");
    
    if (token) {
      fetch(`${backend_url}/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((resp) => resp.json())
        .then((data) => { 
          setCartItems(data);
          localStorage.setItem("local-cart", JSON.stringify(data));
        })
        .catch(error => {
          console.error("Error fetching cart:", error);
          const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");
          setCartItems(localCart);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("local-cart") || "[]");
      setCartItems(localCart);
    }
  }, []);


  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalAmount += cartItems[item] * itemInfo.new_price;
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        try {
          let itemInfo = products.find((product) => product.id === Number(item));
          totalItem += itemInfo ? cartItems[item] : 0 ;
        } catch (error) {}
      }
    }
    return totalItem;
  };

  const addToCart = (itemId) => {

    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Please Login");
      window.location.href = '/login';
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    
    fetch(`${backend_url}/addtocart`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'auth-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "itemId": itemId }),
    })
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId }),
      })
    }
  };

  const contextValue = { products, getTotalCartItems, cartItems, addToCart, removeFromCart, getTotalCartAmount };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
