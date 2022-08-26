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
const auth=firebase.auth();
let questionArray=[];
let userAge=1;
let i=0;
async function fetchModel(){
    var url=window.location.href;
    var monumentName=url?url.split('?'):window.location.search.slice(1);
    const newMonumentName=monumentName[1].replace("%20"," ");
    const updatedName=newMonumentName.replace("%27","");
    let words = updatedName.split(' ');
    for(let i in words){
        words[i] = (words[i][0]).toUpperCase() + words[i].slice(1); 
    }
    query = words.join(' ')
    db.collection('Models').where('name','==',query).get()
    .then(res=>res.forEach(r=>
        document.getElementById('hotspot-camera-view-demo').src=r.data().url
    ))  
}
function checkForNextQuestion(){
    i++;
    if(i!=questionArray.length){
        const elementTag = document.querySelector(".head");
        const listElementone=document.getElementById('option1');
        const listElementTwo=document.getElementById('option2');
        const listElementThree=document.getElementById('option3');
        const listElementFour=document.getElementById('option4');
        elementTag.innerHTML=questionArray[i].question;
        listElementone.innerHTML=questionArray[i].option[0];
        listElementTwo.innerHTML=questionArray[i].option[1];
        listElementThree.innerHTML=questionArray[i].option[2];
        listElementFour.innerHTML=questionArray[i].option[3];
    }
}
function checkAnswer(value,actualAnswer,id){
    document.querySelectorAll('.innerclass1').forEach(ele=>{
        ele.style.backgroundColor = "rgb(188, 243, 162)"
        ele.style.color = "black";
    })
    if(value === actualAnswer){
        const answer = document.getElementById(id)
        answer.style.backgroundColor = "green";
        answer.style.color = "white";
        document.getElementById('correctAnswerContainer').style.display = "flex";
        checkForNextQuestion();
    }
    else{
        const wrongAnswer = document.getElementById(id)
        wrongAnswer.style.backgroundColor = "red";
        wrongAnswer.style.color = "white";
    }
} 
async function loggedInUserAge(){
    var url=window.location.href;
    var monumentName=url?url.split('?'):window.location.search.slice(1);
    const newMonumentName=monumentName[1].replace("%20"," ");
    const updatedName=newMonumentName.replace("%27","");
    auth.onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          db.collection("users").doc(uid).get()
          .then((doc) => {
            if (doc.exists) {
                userAge=doc.data().age;
                db.collection("questions").where("monument","==",updatedName).where("age","==",userAge).get()
                .then((doc)=>{
                    doc.forEach(userQuestions => {
                        questionArray.push({question:userQuestions.data().question,option:userQuestions.data().options})
                    });
                    const elementTag = document.querySelector(".head");
                    const listElementone=document.getElementById('option1');
                    const listElementTwo=document.getElementById('option2');
                    const listElementThree=document.getElementById('option3');
                    const listElementFour=document.getElementById('option4');
                    elementTag.innerHTML=questionArray[0].question;
                    listElementone.innerHTML=questionArray[0].option[0];
                    listElementTwo.innerHTML=questionArray[0].option[1];
                    listElementThree.innerHTML=questionArray[0].option[2];
                    listElementFour.innerHTML=questionArray[0].option[3];
                })
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
        }
      });
}
loggedInUserAge();
fetchModel();