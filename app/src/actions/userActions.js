export const setUsersOnline = dataUsersOnline => {
  return (dispatch, getState) => {
    dispatch({ type: "SET_USERS_ONLINE", data: dataUsersOnline });
  };
};
export const getUserByID = userID => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("users")
      .doc(userID)
      .get()
      .then(result => {
        console.log("long check get_user", result.data());
        dispatch({ type: "GET_USER", data: result.data() });
      });
  };
};



export const upExpByID = (userID, expAdd,starAdd) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const docRef = firestore.collection("users").doc(userID);
    docRef.get().then(res=>{
      const exp = res.data().exp+expAdd;
      const star= res.data().star? res.data().star:0;
      docRef.update({exp,star:star+starAdd})
    })
  };
};

export const upDateWinGameByID = (userID,win)=>{
   return (dispatch,getState,{getFirebase,getFirestore})=>{
     const firestore = getFirestore();
     const docRef = firestore.collection('users').doc(userID);
     docRef.get().then(res=>{
       
       const win = res.data().win?res.data().win: 0;
       const draw = res.data().draw?res.data().draw: 0 ;
       const match = res.data().match?res.data().match:0;
        switch(win){
          case 1 :
            docRef.update({win:win+1,match:match+1})
            break
          case 0:
            docRef.update({draw:draw+1,match:match+1})
          case -1 :
            docRef.update({match:match+1})    
        }
     })
   }
}

export const getUsers = ()=>{
  return (dispatch,getState, {getFirebase,getFirestore}) =>{
    const firestore = getFirestore();
    const docRef = firestore.collection('users');
    docRef.get().then(res=>{
       const data = res.docs.map(e=>e.data()).sort((a,b)=>a.exp<b.exp);
       dispatch({type:'GET_USERS',data})
    })
  }
}
