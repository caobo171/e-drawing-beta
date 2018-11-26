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



export const upExpByID = (userID, expAdd) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const docRef = firestore.collection("users").doc(userID);
    docRef.get().then(res=>{
      const exp = res.data().exp+expAdd;
      docRef.update({exp})
    })
  };
};

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
