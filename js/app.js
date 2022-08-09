const text = 'is an Islamic ivory-white marble mausoleum on the right bank of the river Yamuna  in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan (r. 1628\u20131658) to house the tomb of his favourite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.\nConstruction of the mausoleum was essentially completed in 1643, but work continued on other phases of the project for another 10 years. The Taj Mahal complex is believed to have been completed in its entirety in 1653 at a cost estimated at the time to be around 32 million, which in 2020 would be approximately 70 billion (about US $1 billion). The construction project employed some 20,000 artisans under the guidance of a board of architects led by the court architect to the emperor, Ustad Ahmad Lahauri. Various types of symbolism have been employed in the Taj to reflect natural beauty and divinity.\nThe Taj Mahal was designated as a UNESCO World Heritage Site in 1983 for being \"the jewel of Muslim art in India and one of the universally admired masterpieces of the world s heritage. It is regarded by many as the best example of Mughal architecture and a symbol of India s rich history.';

let isHiddenTextShown = false;
let isVideoOn = false;
let webcam = null;
let classifier = null;
let isStreetView=false;
let isFullScreen = false;

function createReadMore(){
    const textShown = text.substring(0,500);
    document.getElementById('introduction').innerText = textShown;
}
function initDectectionModel(){
    //initialising the image classification classifier
    classifier =  ml5.imageClassifier('../model/model.json',()=>{
      console.log("model loaded")
    });
}
function requestModel(label){
    document.getElementById('model-name').innerText = label;
    const frame = document.getElementById('model-frame')
    frame.style.display='block';
    frame.src = `http://localhost:3000/test?name=${label}`;
    
}
function maxResult(err,results){
    // finding the best classification confidence along with its label
    let max = {label:results[0].label,confidence:results[0].confidence}
    for(let i in results){
        let score = results[i].confidence;
        if(score > max.confidence)
            max = {
                label:results[i].label,
                confidence:results[i].confidence
            }
    }
    document.getElementById('loader').style.display = "none";
    requestModel(max.label);
    
}
function detectAndShow(image){
    classifier.classify(image,maxResult);
}
function showHiddenText(){
    const readMore = document.getElementById('read-more-btn')
    if(!isHiddenTextShown){
        const textHidden = text.substring(500,text.length);
        document.getElementById('introduction').innerText += textHidden;
        readMore.innerText = 'Show Less';
        isHiddenTextShown = true;
    }
    else{
        createReadMore();
        readMore.innerText = 'Read More';
        isHiddenTextShown = false;
    }
}
function showStreetView(){
    const streetView=document.getElementById("street-view");
    const readMore = document.getElementById('read-more-btn');
    const modelText=document.getElementById('introduction');
    if(!isStreetView){
        streetView.style.display="inline";
        readMore.style.display="none";
        modelText.style.display="none";
        isStreetView=true;
    }
    else{
        streetView.style.display="none";
        readMore.style.display="inline";
        modelText.style.display="inline";
        isStreetView=false;
    }
}
function startWebcam(){
    // starting webcam
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    webcam = new Webcam(webcamElement, 'environment', canvasElement);
    webcam.start()
}
function startStopCamera(){
    const webcamBtn = document.querySelector('.webcam-btn')
    const webcamIcon = document.getElementById('webcam-icon');
    if(!isVideoOn){
        startWebcam();
        webcamIcon.className = 'fa-solid fa-video fa-xl';
        webcamBtn.setAttribute('style','background-color:var(--button-color);')
    }
    else{
        webcam.stop();
        webcamIcon.className = 'fa-solid fa-video-slash fa-xl';
        webcamBtn.setAttribute('style','background-color:var(--webcam-off-color);')
    }
    isVideoOn = !isVideoOn;
}
document.querySelector('.photo-btn').addEventListener('click',()=>{
    // taking a internal screenshot from the webcam for image classification
    removeModel();
    document.getElementById('loader').style.display = "block";
    let picture  = webcam.snap();
    const image = document.createElement('img')
    image.src = picture;
    detectAndShow(image)
})
function removeModel(){
    const frame = document.getElementById('model-frame')
    frame.style.display = "none";
    frame.src = "";
}
function updateElementsForFullScreen(){
    const webcam = document.getElementById('webcam')
    const model = document.getElementById('overlay-model');
    webcam.style.width = '100%';
    webcam.style.height = '100%';
    webcam.style.marginTop = '0px';
    model.style.width = '100%';
    model.style.height = '100%';
    model.style.marginTop = '0px';
}
function updateElementForExitFullScreen(){
    const webcam = document.getElementById('webcam')
    const model = document.getElementById('overlay-model');
    webcam.style.width = '640px';
    webcam.style.height = '480px';
    webcam.style.marginTop = '15px';
    model.style.width = '640px';
    model.style.height = '480px';
    model.style.marginTop = '15px';
}
function showFullScreen(){
    const container = document.getElementById('webcam-and-model-container');
    if(container.requestFullscreen)
        container.requestFullscreen();
    container.addEventListener('fullscreenchange',()=>{
        if(document.fullscreenElement)
            updateElementsForFullScreen();    
        else
            updateElementForExitFullScreen();
        
    })

}
function showPreview(event){
    if(event.target.files.length > 0){
      const src = URL.createObjectURL(event.target.files[0]);
      const img = document.createElement('img')
      img.src = src;
      detectAndShow(img)
    }
}
function uploadImage(){
    document.getElementById('imageUpload').click();
}
function getSearchResult(){
    removeModel()
    let query = document.getElementById('search-bar').value;
    let words = query.split(' ');
    for(let i in words){
        words[i] = (words[i][0]).toUpperCase() + words[i].slice(1); 
    }
    query = words.join(' ')
    console.log(query);
    requestModel(query)
}
function init(){
    initDectectionModel();
    createReadMore();
    
}
init()
