//hey the internet is much faster now
var UI = require('ui');
var Vector2=require('vector2');

var wind = new UI.Window({fullscreen:true});
var smile=": D";
var sad=": (";
var siz=new Vector2(36,36);
var senti=["negative","positive","positive","negative","positive","positive","positive","negative","sdf","df","sf","sf","sf","sf","sdf","Sfd","sdf"];
for (var i=0;i<4;i++){
  for (var j=0;j<4;j++){
     var index=i*4+j;
     //if (index>=senti.length()) break;
     var c=(senti[index]=="negative")?"black":"white";
     var pos=new Vector2(i*36,j*36);
     var face = new UI.Rect({
      position: pos,
      size: siz,
      backgroundColor: c
    });
    var text=new UI.Text({
      position:pos,
      size:siz,
      text:(senti[index]=="negative")?sad:smile,
      color:(c=="black")?"white":"black"
    });
    wind.add(face);
    wind.add(text);
  }
}  
var geotext=new UI.Text({
  text:"getting location data",
  size:new Vector2(144,16),
  position:new Vector2(0,144),
  color:"white"
});
wind.add(geotext);
var locationOptions={
  enableHightAccuracy:true,
  maximumAge:10000,
  timeout:10000
};
function locationSuccess(pos) {
  geotext.text('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  geotext.text('location error (' + err.code + '): ' + err.message);
}
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
wind.show();



