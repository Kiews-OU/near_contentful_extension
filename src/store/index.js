import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import reducers from "./reducers"
import { rootSaga } from "./saga"

const saga=createSagaMiddleware()
export const store=createStore(reducers,applyMiddleware(saga))
saga.run(rootSaga)