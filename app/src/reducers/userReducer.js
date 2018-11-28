import io from "socket.io-client";
const initState = {
  user: {},
  socket: {},
  users: [],
  currentUser: {},
  usersOnline:[],
  auth:true
};
const socket = io("http://localhost:5000");




window.socket = socket;

const userReducer = (state = initState, action) => {
  switch (action.type) {

    case "LOGOUT_USER_SUCCESS":
      socket.emit("logout-user", { socketid: socket.id });
      return {...state,currentUser:{},auth:false};

    case "GET_CURRENT_USER_SUCCESS":
      let object1 = { socket, ...action.data };
  
      if(action.data){
  
        object1.socket.emit("login-user", {
          socketid: object1.socket.id,
          ...action.data
        });
        return {...state,currentUser:object1,auth:true}
      }else{
        return {...state,currentUser:{},auth:false}
      }
    case "GET_USER":
       return {...state,user:action.data}

    case "SET_USERS_ONLINE":

       return {...state,usersOnline:action.data}
     
    case "GET_USERS":
       return {...state, users:action.data}
    default:
      return state;
  }
}
export default userReducer
