// Grab elements, create settings, etc.
var video = document.getElementById('video');

var snapButton = document.getElementById('snap');
snapButton.addEventListener('click', snap);

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	// Not adding `{ audio: true }` since we only want video now
	navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
		//video.src = window.URL.createObjectURL(stream);
		video.srcObject = stream;
		video.play();
	});
}

function snap() {	
	var canvas = document.getElementById('canvas');
	var video = document.getElementById('video');
	var context = canvas.getContext('2d');
	
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	
	context.drawImage(video, 0, 0, canvas.width, canvas.height);
	
	canvas.toBlob(function(blob) {
	  // blob ready, download it
	  let link = document.createElement('a');
	  url = URL.createObjectURL(blob);

	  // delete the internal blob reference, to let the browser clear memory from it
	  URL.revokeObjectURL(url);
	  
	  url = url.replace('blob:' + window.location.href, '');
	  let data = new FormData();
	  data.append('image', blob, url);
	  
	  // Send image to server
	  $.ajax({  
		type: 'POST',  
		url: '/get_analysis',  
		data: data,  
		contentType: false,
		processData: false,  
		success: function (out) {  
			alert(out);  
		}, 
		error: function () {
			alert('Error while uploading image..');
		}
	});
	  alert('Hello');
	  alert(data);
	}, 'image/png');
}