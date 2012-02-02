var win = Titanium.UI.currentWindow;

Titanium.Media.showCamera({

	success:function(event)
	{
		var image = event.media;

		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
		{			
		
		//STEP 1 DEAL WITH THE IMAGE AND SET CORRECT DIMENSIONS
		
			//In ANDROID, we can't just get the height and width from the event.media. So will put it in a tmp image view and get the dimensions from there.
			var tmp_imageView = Titanium.UI.createImageView({
				image: image
			});
			win.add(tmp_imageView);
			
			//Check dimensions before adding to imageView, we want a maximum single dimension of 800
			var image_height;
			var image_width;
			var max = 800;
			if(tmp_imageView.width>max || tmp_imageView.height>max){
				if(tmp_imageView.width>tmp_imageView.height){
					image_height = max * (tmp_imageView.height / tmp_imageView.width);
					image_width = max;
				}else{
					image_width = max * (tmp_imageView.width / tmp_imageView.height);
					image_height = max;
				}
			}else{
				image_width = tmp_imageView.width;
				image_height = tmp_imageView.height;
			}
			
			
			//We put the event.media in a new imageView with proper dimensions
			var imageView = Titanium.UI.createImageView({
				width: image_width,
				height: image_height,
				image: image
			});
			
			

		//STEP 2 GET THE LAT AND LNG


Ti.App.GeoApp = {};

Ti.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
Ti.Geolocation.purpose = "testing";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

if( Titanium.Geolocation.locationServicesEnabled === false ) {
    Ti.API.debug('Your device has GPS turned off. Please turn it on.');
}

	Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (!e.success || e.error)
		{
			alert('error ' + JSON.stringify(e.error));
			return;
		}
		
	});


	Titanium.Geolocation.addEventListener('location',function(e)
	{
		if (e.error)
		{
                // manage the error
		return;
		}

 		Titanium.App.Properties.setString("longitude", e.coords.longitude);
		Titanium.App.Properties.setString("latitude", e.coords.latitude); 

	});




















		//STEP 3 SEND THE IMAGE TO THE SERVER

			var temp_data = imageView.toImage();

			var progress = Titanium.UI.createActivityIndicator({
				location:Titanium.UI.ActivityIndicator.DIALOG,
				type:Titanium.UI.ActivityIndicator.DETERMINANT,
				message:'Uploading',
				min:0,
				max:1,
				value:0
			});

			progress.show();
					
			//We will also be communicating via http
			var xhr = Titanium.Network.createHTTPClient();

			xhr.onerror = function(e) {
			
				if (xhr.status == 200) {
					xhr.onload(e);
					return;
				} else {
					var dialog = Ti.UI.createAlertDialog({ title:'Upload Failed :-(', message:'Status code ' + this.status + '. Please try again.', buttonNames: ['OK'] });
					dialog.addEventListener('click', function() { dialog.hide(); });
					dialog.show();
				}
				progress.hide();
				
				win.close();
				
				};
			xhr.setTimeout(200000);

			xhr.onload = function(e) {
			
				try {

					var data = JSON.parse(this.responseText);
					
										
					progress.hide();
				


				} catch(E) {
					// alert(E);
				}
				xhr.abort();
			};
		
			// track the upload progress
			xhr.onsendstream = function(e) {
				progress.value = e.progress;
			};
		
			// open the client
			xhr.open('POST', 'http://mlteam.com/projects/databank/atomic-catcher.php');

			// send the data
			xhr.send({
				media: temp_data.media,
				latitude: Titanium.App.Properties.getString("latitude"),
				longitude: Titanium.App.Properties.getString("longitude"),
				action: 'upload'


			});


		}
		else{
			alert("got the wrong type back ="+event.mediaType);
		}
	},
	cancel:function(){
		win.close();
	},
	
	error:function(error){
		if (error.code == Titanium.Media.NO_CAMERA){
			alert('Please run this test on device');
		}else{
			alert("An error(" + error.code + ") has occurred.");
		}
		win.close();
	},
	saveToPhotoGallery:false,
	allowEditing:false,
	mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
});

