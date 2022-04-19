import { applyMiddleware, createStore } from "redux"
import reducers from "./reducers"
import createSagaMiddleware from "redux-saga"
import { rootSaga } from "./saga"

const saga=createSagaMiddleware()
export const store=createStore(reducers,applyMiddleware(saga))
saga.run(rootSaga)