let text = '';
let isHiddenTextShown = false;
let isVideoOn = false;
let webcam = null;
let classifier = null;
let isFullScreen = false;
let adata = null;
function createReadMore(){
    const textShown = text.substring(0,500);
    document.getElementById('read-more-btn').style.display = 'block';
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
    fetchModelData(label).then(res=>{
        data = res.docs[0].data()
        const viewer  = document.getElementById('hotspot-camera-view-demo')
        viewer.style.display='block';
        viewer.src = 'https://cors-anywhere.herokuapp.com/'+data.url;
        
});
}
function getInfo(query){
    fetch("https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles="+query).then(function(resp) {
    return resp.json()
    }).then(function(data) {
        const {title,extract} = data.query.pages[Object.keys(data.query.pages)[0]]
        document.getElementById('content-heading').innerText = title;
        text = extract;
        createReadMore();
    })
}
function maxResult(err,results){
    if(err){
        console.log(err)
        return;
    }
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
    getInfo(max.label);
    
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
    const image = document.getElementById('prediction-image')
    image.src = picture;
    detectAndShow(image)
})
function removeModel(){
    const viewer = document.getElementById('hotspot-camera-view-demo')
    document.getElementById('model-name').innerText = 'Model Name';
    viewer.src = "";
    viewer.style.display = 'none';
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
}
init()
