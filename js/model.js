function addAnnotation(annotations){
    let annotationString = "";
    for(let i = 0;i<annotations.length;i++){
        const annotation = annotations[i];
        annotationString +=
        `<button
        onclick="showInfo('${annotation.dataset.dataInfo}')" 
        class="Hotspot" 
        slot="hotspot-${i+1}" 
        data-position="${annotation.dataset.position}" 
        data-normal="${annotation.dataset.normal}"
        data-orbit="${annotation.dataset.dataOrbit}"
        data-target="${annotation.dataset.dataTarget}"
        data-visibility-attribute="visible">
        <div class="HotspotAnnotation">${annotation.label}</div>
        </button>
        `
    }

    return annotationString
}
function removeAnnotations(){
    document.querySelectorAll('.Hotspot').forEach(item=>item.remove())
}
function addHotspotListener(){
    const modelViewer1 = document.querySelector("#hotspot-camera-view-demo");
    const annotationClicked = (annotation) => {
    let dataset = annotation.dataset;
    modelViewer1.cameraTarget = dataset.target;
    modelViewer1.cameraOrbit = dataset.orbit;
    modelViewer1.fieldOfView = '45deg';
    }

    modelViewer1.querySelectorAll('button').forEach((hotspot) => {
    hotspot.addEventListener('click', () => annotationClicked(hotspot));
    });
}
function showInfo(info){
    const container = document.getElementById('info-box')
    const infoBox = document.getElementById('info-para')
    infoBox.innerText = info;
    container.style.display='block';
}
function hideInfoBox(){
    document.getElementById('info-box').style.display = "none";
}
function addProgressListener(){
    document.getElementById('hotspot-camera-view-demo').addEventListener('progress',(event)=>{
        const progress = document.getElementById('progress')
        const progress_percent = parseInt(event.detail.totalProgress * 100);
        progress.innerText =  progress_percent+"%";
        progress.style.width = progress_percent+"%";
    })
    document.getElementById('hotspot-camera-view-demo').addEventListener('load',()=>{
        document.getElementById('progress-bar-container').style.display = "none";
        const annotationString = addAnnotation(data.annotation)
        document.getElementById('hotspot-camera-view-demo').innerHTML += annotationString
        addHotspotListener()
    })
}
function toggleBackground(){
    let viewer = document.getElementById('hotspot-camera-view-demo')
    const background  = viewer.style.backgroundColor;
    if(background === 'transparent' || background === '')
        viewer.style.backgroundColor = 'white';                    
    else
        viewer.style.backgroundColor = 'transparent';
}

addProgressListener()

