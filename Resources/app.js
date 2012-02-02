// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


// create base UI tab and root window
var win1 = Titanium.UI.createWindow({  
    title:'Survey Tools',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({
    title:'Survey Tools',
    window:win1
});

var b1 = Titanium.UI.createButton({
	title:'Snap something unique'
});

win1.add(b1);



// add tabs
tabGroup.addTab(tab1);  
  


// open tab group
tabGroup.open();



// event listeners
b1.addEventListener('click', function() {

	var send_photo_win = Titanium.UI.createWindow({
		url:'camera.js',
		title:"Camera"
	});

	Titanium.UI.currentTab.open(send_photo_win);

});