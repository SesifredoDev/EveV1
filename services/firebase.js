const { initializeApp, applicationDefault } = require('firebase/compat/app');
const firebase = require('firebase/app')
const {query, where} = require('firebase/compat/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} = require("firebase/auth");


const firebaseConfig = {
    apiKey: "AIzaSyCT6Ns-YHgLauw0dQT5ev7h4U41e8w96KA",
    authDomain: "evestorage-e8c17.firebaseapp.com",
    databaseURL: "https://evestorage-e8c17-default-rtdb.firebaseio.com",
    projectId: "evestorage-e8c17",
    storageBucket: "evestorage-e8c17.appspot.com",
    messagingSenderId: "369569831013",
    appId: "1:369569831013:web:cf5ca9aa3c8c5c51f7ce8c",
    measurementId: "G-6BK2D7H24H"
  };
  const app = initializeApp(firebaseConfig);
  const db = app.firestore();
  const auth = getAuth();
  const usersRef = db.collection("users/");
  const userData = null;

  // get user data
  getData =  async (user) => {
    const  query = (await usersRef.doc(user.uid).get()).data()
    return query
  }

  
  //signUp
  fbSignUp = (email, password, name) =>{
    
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    usersRef.doc(user.uid).set ({
      id: user.uid,
      name: name,
      email: email,
    })     
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage)
    // ..
  });
  }
  
  fbLogIn = async (email, password)=>{
    return(
      await signInWithEmailAndPassword (auth, email, password)
  .then( async (userCredential) => {
    user = userCredential.user;
    return user
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    return(errorCode + errorMessage)
  }));
  
  }