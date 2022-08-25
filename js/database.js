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

async function fetchModelData(prediction){
    return await db.collection('Models').where('name','==',prediction).get()
}
async function signIn(){
    // console.log("dsad")
    const email=document.getElementById('email').value;
    const password=document.getElementById("password").value;
    const age=document.getElementById('age').value;
    console.log(email,age,password)
}