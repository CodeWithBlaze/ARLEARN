const firebaseConfig = {
    apiKey: "AIzaSyC1T1cc8WBitrp5Y-t2rb-7dbaMbPbh7JQ",
    authDomain: "arlearn-3f847.firebaseapp.com",
    projectId: "arlearn-3f847",
    storageBucket: "arlearn-3f847.appspot.com",
    messagingSenderId: "1090047578408",
    appId: "1:1090047578408:web:d6d0ba7649029912f8401d"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth=firebase.auth();

async function fetchModelData(prediction){
    return await db.collection('Models').where('name','==',prediction).get()
}
const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function CheckPassword(inputPassword) { 
    var passw= /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if(inputPassword.match(passw)){ 
        return true;
    }
    else{ 
        return false;
    }
}

async function signUp(){
    const email=document.getElementById('email').value;
    const password=document.getElementById("password").value;
    const age=document.getElementById('age').value;
    if(email==='' ||password==='' || age===''){
        console.log("Please enter all fields");
    }
    if(!validateEmail(email) ||!CheckPassword(password)){
        console.log("Please enter a valid Password");
    }
    else{
        auth.createUserWithEmailAndPassword(email,password)
        .then((userCredential) => {
            // console.log(userCredential.user.uid)
            db.collection("users").add({
                userID:userCredential.user.uid,
                age:age
            })
        })
        window.location = './index.html'
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage)
        });
    }
}
async function Login(){
    const email=document.getElementById('userEmail').value;
    const password=document.getElementById("userPass").value;
    if(email==='' || password===''){
        console.log("Please enter all fields");
    }
    if(!validateEmail(email) || !CheckPassword(password)){
        console.log("Please enter a valid Password");
    }
    else{
        auth.signInWithEmailAndPassword(email,password)
        .then((userCredential) => {
            var user = userCredential.user;
            window.location = './Home.html'
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode,errorMessage)
        });
    }
}
async function forgotPass(){
    const userEmail=document.getElementById("passEmail").value;
    if(userEmail===''){
        console.log("Please enter fields");
    }
    else{
        auth.sendPasswordResetEmail(userEmail)
        .then(() => {
            console.log("code is send to your email,Please check spam also")
            window.location = './index.html'
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode,errorMessage)
        });
    }
}
async function logOut(){
    auth.signOut()
    .then(function() {
       console.log("signOut");
       window.location = './index.html'
    })
    .catch(function(error) {
        console.log(error);
    });
}