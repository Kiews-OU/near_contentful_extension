import produce from "immer";
import { combineReducers } from "redux-immer";
import { walletReducer } from "./wallet/reducer";

export default combineReducers(produce,{
   wallet:walletReducer
})