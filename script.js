
var qrcode = null;


function generateQRCode() {
    
    
        var textToEncode = document.getElementById('text').value;
        if(qrcode===null) {
            qrcode = new QRCode(document.getElementById("qrcode"), {
                text: textToEncode,
                width: 128,
                height: 128
            });
        }
        else{
            alert("QR code is already generated")
        }
       
    
   
}


const video = document.getElementById('video');

// Load face-api.js models




async function startCamera() {
    const name = document.getElementById('name').value;
    if (name == '') {
       alert('Please enter your name before starting the camera.');
        return;
    }
    try {
            
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.style.display = 'block';

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          ]).then(startVideo);
          
          video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video);
            document.body.append(canvas);
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
      
            setInterval(async () => {
              const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
              const resizedDetections = faceapi.resizeResults(detections, displaySize);
              canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }, 100);
          });

        video.addEventListener('click', () => {
            stopCamera(stream);
            const rating = generateRandomRating();
            showRatingPopup(name, rating);
        });
    } catch (error) {
       console.error('Error accessing camera:', error);
    }
}

function stopCamera(stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    document.getElementById('video').style.display = 'none';
}


function showRatingPopup(name, rating) {
    alert(`${name}, your rating: ${rating}`);
}
function generateRandomRating() {
    return Math.floor(Math.random() * 5) + 1;
}

async function openPopup() {
   document.getElementById('popup').style.display = 'block';
}
    
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}