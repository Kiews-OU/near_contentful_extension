let walletState = {
  walletID: "",
  walletSum: "",
  sum: "",
  rid: "",
  transaction:[],
  price:""
};
export const walletReducer = (state = walletState, option) => {
  switch (option.type) {
    case "setdata":
      state.walletID = option.id
      state.walletSum = option.available
      return state
    case "enterval":
      state[option.key] = option.data
      return state
      case "transaction":
        state.transaction.push(option.data)
        return state
      case "isError":
        state.TrError=option.error
        return state
        case "getPrice":
          state.price=option.payload
          return state
    default:
      return state;
  }
};

