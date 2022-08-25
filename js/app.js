let text = '';
let isHiddenTextShown = false;
let isVideoOn = false;
let webcam = null;
let classifier = null;
let isFullScreen = false;
let images = [];
function createReadMore(){
    const textShown = text.substring(0,500);
    document.getElementById('read-more-btn').style.display = 'block';
    document.getElementById('introduction').innerText = textShown;
}
function initDectectionModel(){
    //initialising the image classification classifier
    classifier =  ml5.imageClassifier('./js/model.json',()=>{
        console.log("model loaded")
    });
}
function requestModel(label){
    document.getElementById('model-name').innerText = label;
    fetchModelData(label).then(res=>{
        data = res.docs[0].data()
        const viewer  = document.getElementById('hotspot-camera-view-demo')
        viewer.style.display='block';
        viewer.src = data.url;
        images = data.images
        const streetView=document.getElementById("street-view");
        streetView.src = data.streetView
        document.getElementById('ar-button').addEventListener('click',(event)=>{
            console.log(event.url)
        })
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
        document.querySelector('.text-info-controller').style.display = "flex";
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
function detectAndShow(){
    const image = document.getElementById('prediction-image')
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
    const images_container = document.getElementById('model-images-container')
    streetView.style.display="inline";
    images_container.style.display = "none";
    readMore.style.display="none";
    modelText.style.display="none";
    
}
function showImages(){
    const streetView=document.getElementById("street-view");
    const readMore = document.getElementById('read-more-btn');
    const modelText=document.getElementById('introduction');
    streetView.style.display="none";
    readMore.style.display="none";
    modelText.style.display="none";
}
function showInformation(){
    const streetView=document.getElementById("street-view");
    const readMore = document.getElementById('read-more-btn');
    const modelText=document.getElementById('introduction');
    const images_container = document.getElementById('model-images-container')
    streetView.style.display="none";
    readMore.style.display="inline";
    modelText.style.display="block";
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
    const captureBtn = document.getElementById('capture-photo')
    if(!isVideoOn){
        startWebcam();
        captureBtn.style.display='flex';
        webcamIcon.className = 'fa-solid fa-video fa-xl';
        webcamBtn.setAttribute('style','background-color:var(--button-color);')
    }
    else{
        captureBtn.style.display = 'none';
        webcam.stop();
        webcamIcon.className = 'fa-solid fa-video-slash fa-xl';
        webcamBtn.setAttribute('style','background-color:var(--webcam-off-color);')
    }
    isVideoOn = !isVideoOn;
}
document.getElementById('capture-photo').addEventListener('click',()=>{
    // taking a internal screenshot from the webcam for image classification
    removeModel();
    document.getElementById('loader').style.display = "block";
    let picture  = webcam.snap();
    const image = document.getElementById('prediction-image')
    image.src = picture;
    image.onload = detectAndShow()
})
function removeModel(){
    const viewer = document.getElementById('hotspot-camera-view-demo')
    document.getElementById('model-name').innerText = 'Model Name';
    removeAnnotations();
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
    const computerScreenWidth = 640;
    const computerScreenHeight = 480;
    const mobileScreenWidth = 392;
    const mobileScreenHeight = 478;
    webcam.style.marginTop = '15px';
    model.style.marginTop = '15px';
    if(screen.width < 400 ){
        webcam.style.width = mobileScreenWidth+'px';
        webcam.style.height = mobileScreenHeight+'px';
        model.style.width = mobileScreenWidth+'px';
        model.style.height = mobileScreenHeight+'px';
    }
    else{
        webcam.style.width = computerScreenWidth+'px';
        webcam.style.height = computerScreenHeight+'px';
        model.style.width = computerScreenWidth+'px';
        model.style.height = computerScreenHeight+'px';
    }
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
      removeModel()
      const src = URL.createObjectURL(event.target.files[0]);
      const img = document.getElementById('prediction-image')
      img.src = src;
      img.onload = detectAndShow()
    }
}
function uploadImage(){
    document.getElementById('imageUpload').click();
}
document.getElementById('read-more-btn').addEventListener('change',()=>{
    const ReadMoreButton = document.getElementById('read-more-btn')
    if(text.length < 500)
        ReadMoreButton.style.display = 'none';
    else
        ReadMoreButton.style.display = 'block';
})
function getSearchResult(){
    removeModel()
    let query = document.getElementById('search-bar').value;
    let words = query.split(' ');
    for(let i in words){
        words[i] = (words[i][0]).toUpperCase() + words[i].slice(1); 
    }
    query = words.join(' ')
    requestModel(query)
}
function goAr(){
    const modelViewerSource = document.getElementById('hotspot-camera-view-demo').src;
    window.location.href = window.location.href + `/js/tem.html?file=${modelViewerSource}`
}
const swiper = new Swiper('.swiper', {
    direction: 'vertical',
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
function showHelp(){
    document.getElementById('help').style.display = "flex";
}

function init(){
    initDectectionModel();
    document.getElementById('carousel-close').addEventListener('click',()=>{
        document.getElementById('help').style.display = "none";
    })
    document.getElementById('hotspot-camera-view-demo').addEventListener('click',event=>{
        console.log(event)
    })
}
init()
