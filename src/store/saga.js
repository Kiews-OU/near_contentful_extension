import { put, takeEvery } from "redux-saga/effects";

function* SendNear(result){
   let {data}=result
   console.log(data);
   let error=""
   let success=""
   if(data.sum=="" || data.rid ==""){
      error="Fill the fields"
   }
   else{
      success="Complete Successfuly"
   }
}

export function* rootSaga(){
    yield takeEvery ("send",SendNear)
}