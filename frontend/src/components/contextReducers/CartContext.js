import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialValue = ()=> {
    const localCartData = localStorage.getItem('cart')
    if(localCartData === null || localCartData === []) {
        return []
    } else {
        return JSON.parse(localCartData);
    }
}

const reducer = (state, action)=> {
    switch(action.type) {
        case "ADD":
            return [...state, {id: action.id, name: action.name,
                price: action.price, qty: action.qty, size: action.size}]
        case "REMOVE":
            let newArr = [...state]
            newArr.splice(action.index, 1)
            return newArr;
        case "UPDATE":
            let arr = [...state]
            arr.find((food, index)=> {
                if (food.id === action.id && food.size === action.size) {
                    arr[index] = {...food, qty: parseInt(action.qty) + parseInt(food.qty), price: parseInt(action.price)+parseInt(food.price)}
                    return arr;
                }
            })
            return arr
        case "DROP":
            let emptyArr = []
            return emptyArr;
        default:
            console.log("Error in Reducer");
    }
};

export const CartProvider = ({children})=> {

    const [state, dispatch] = useReducer(reducer, initialValue());
    
    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
};

export const useCart = ()=> useContext(CartStateContext);
export const useDispatchCart = ()=> useContext(CartDispatchContext);