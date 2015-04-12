//hey the internet is much faster now
var UI = require('ui');
var Vector2=require('vector2');
var ajax=require('ajax');

var wind = new UI.Window({fullscreen:true});

var siz=new Vector2(36,36);
var senti=["negative","neutral","positive","negative","positive","positive","positive","negative","sdf","df","sf","sf","sf","sf","sdf","Sfd","sdf"];
function sent2emo(sentiment){
  if (sentiment=="negative") return(" : (");
  if (sentiment=="neutral") return(" : |");
  if (sentiment=="positive") return(" :D");
  return " = D";
}
function sent2color(sentiment){
  if (sentiment=="negative") return("black");
  if (sentiment=="neutral") return("white");
  if (sentiment=="positive") return("white");
  return "white";
}
for (var i=0;i<4;i++){
  for (var j=0;j<4;j++){
     var index=i*4+j;
     if (index>=senti.length) break;
     var c=sent2color(senti[index]);
     var pos=new Vector2(i*36,j*36);
     var face = new UI.Rect({
      position: pos,
      size: siz,
      backgroundColor: c
    });
    var text=new UI.Text({
      position:pos,
      size:siz,
      text:sent2emo(senti[index]),
      color:(c=="black")?"white":"black"
    });
    wind.add(face);
    wind.add(text);
  }
}  
var geotext=new UI.Text({
  text:"getting location data..",
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
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  geotext.text('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  var URL="https://api.foursquare.com/v2/venues/search?client_id=R355ECNPS1QUQFJIE3NFTF10DTOFPHZTZOXKTCW3PWZ5UD3A &client_secret=4K0IGHZ4MQ55YME315CW2S3VN5WWQMVLNEYK1K1NJKW3R0PS&v=20130815&limit=10&ll="+pos.coords.latitude + ',' + pos.coords.longitude;
  ajax(
    {
      url:URL
    },
    function(data){
      //sucess
      var places=[];
      var res=JSON.parse(data).response;
      console.log("the fisst palace is "+res.venues[0].name);
      console.log("length is "+res.venues.length);
      for (var i=0;i<res.venues.length;i++){
        console.log("place is "+res.venues[i].name); 
        places[places.length]=res.venues[i].name;
        
      }
      geotext.text(places[0]);
      console.log(JSON.parse(data));
      console.log(JSON.parse(data).meta);
      console.log(JSON.parse(data).response);
      console.log(JSON.parse(data).response.venues[0].name);
    },
    function(error){
      //failure
      console.log("error getting places");
      geotext.text('error getting location');
    }
  );
}

function locationError(err) {
  geotext.text('location error (' + err.code + '): ' + err.message);
}
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

wind.show();
//to use the accelerometer, change it to wind.on('accelTap', function())
wind.on('accelTap',function(){
      console.log('Show randam tweet preview');
      var rand=Math.floor(Math.random()*senti.length);
      //send back rand
      var preview=new UI.Card({
        title:"Tweet Preview",
        subtitle:sent2emo(senti[rand]),
        body:"This is a tweet"+rand,
        scrollable:true
      });
      preview.show();
      preview.on('accelTap',function(){
      var rand=Math.floor(Math.random()*senti.length);
      //send back rand
     preview.subtitle(sent2emo(senti[rand]));
        preview.body("This is a tweet"+rand);
      });
      
});

