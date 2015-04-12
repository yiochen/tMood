//hey the internet is much faster now
var UI = require('ui');
var Vector2=require('vector2');
var ajax=require('ajax');
var Vibe=require('ui/vibe');

var locationOptions={
  enableHightAccuracy:true,
  maximumAge:10000,
  timeout:10000
};
var splash=new UI.Card({
  title:"PebbleTweet",
  subtitle:"Loading.."
});
splash.show();

//make request about the geolocation
function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  splash.title('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  //geotext.text('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  var URL="https://api.foursquare.com/v2/venues/search?client_id=R355ECNPS1QUQFJIE3NFTF10DTOFPHZTZOXKTCW3PWZ5UD3A &client_secret=4K0IGHZ4MQ55YME315CW2S3VN5WWQMVLNEYK1K1NJKW3R0PS&v=20130815&limit=10&ll="+pos.coords.latitude + ',' + pos.coords.longitude;
  ajax(
    {
      url:URL
    },
    function(data){
      //sucess
      var places=[];
      var res=JSON.parse(data).response;
      console.log("the first palace is "+res.venues[0].name);
      console.log("length is "+res.venues.length);
      for (var i=0;i<res.venues.length;i++){
        console.log("place is "+res.venues[i].name); 
        places[places.length]=res.venues[i].name;
        
      }
      getSentimentData(places);
     // geotext.text(places[0]);
    },
    function(error){
      //failure
      console.log("error getting places");
      //geotext.text('error getting location');
    }
  );
}

function locationError(err) {
  //geotext.text('location error (' + err.code + '): ' + err.message);
}
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);




function sent2emo(sentiment){
  if (sentiment=="negative") return(" : (");
  if (sentiment=="neutral") return(" : |");
  if (sentiment=="positive") return(" : D");
  return " = D";
}
function sent2color(sentiment){
  if (sentiment=="negative") return("black");
  if (sentiment=="neutral") return("white");
  if (sentiment=="positive") return("white");
  return "white";
}

function getSentimentData(places){
  ajax(
  {
    url:'http://chetannaik.pythonanywhere.com/query/sdfsdf',//supposed to use the places as argument.
    type:'json'
  },
  function(data){
    console.log('successfully fetched tweets');
    var wind = new UI.Window({fullscreen:true});
    var siz=new Vector2(36,36);
    var senti=JSON.parse(data).response;
    for (var i=0;i<4;i++){
      for (var j=0;j<4;j++){
        var index=i*4+j;
         if (index>=senti.length) break;
         var c=sent2color(senti[index].sentiment);
         var pos=new Vector2(i*36,j*36);
         var face = new UI.Rect({
            position: pos,
            size: siz,
            backgroundColor: c
          });
        var text=new UI.Text({
          position:pos,
          size:siz,
          text:sent2emo(senti[index].sentiment),
          color:(c=="black")?"white":"black",
          borderColor:"black"
        });
        wind.add(face);
        wind.add(text);
      }
  }  
  var selector=0;
  var selectorBox=new UI.Rect({
    position:new Vector2(0,0),
    size:new Vector2(36,36),
    borderColor:"white",
    backgroundColor:"clear"
  });
  
  wind.on('click','down',function(){
  //move down
    var pos=selectorBox.position();
    pos.y+=36;
    if (pos.y>=144){
      pos.y=0;
      pos.x+=36;
      if (pos.x>=144) {
        pos.x=0;
      }
    }
  
    selectorBox.animate('position',pos,400);
    selector=(pos.x*4+pos.y)/36;

  });
    
  wind.on('click','up',function(){
    var pos=selectorBox.position();
    pos.y-=36;
    if (pos.y<0){
      pos.y=108;
      pos.x-=36;
      if (pos.x<0) {
        pos.x=108;
      }
    }
  
    var temp=(pos.y*4+pos.x)/36;
    if (senti.length>temp){
      selectorBox.animate('position',pos,400);
      selector=temp;
    }
  });
    
  wind.on('click','select',startPreview);
    
  wind.add(selectorBox);
  wind.show();
  splash.hide();
  /*var geotext=new UI.Text({
    text:"getting location data..",
    size:new Vector2(144,16),
    position:new Vector2(0,144),
    color:"white"
  });
  wind.add(geotext);*/
  function startRandomPreview(){
      console.log('Show randam tweet preview');
      Vibe.vibrate('short');
      //send back rand
      var rand=Math.floor(Math.random()*senti.length);
      var preview=new UI.Card({
        title:"Tweet Preview",
        subtitle:sent2emo(senti[rand].sentiment),
        body:senti[rand].tweet,
        scrollable:true
      });
      preview.show();
      preview.on('accelTap',function(){
        Vibe.vibrate('short');
        var rand=Math.floor(Math.random()*senti.length);
        //send back rand
        preview.subtitle(sent2emo(senti[rand].sentiment));
        preview.body(senti[rand].tweet);
      });
  }
  function startPreview(){
      if (selector>=senti.length) return;
      console.log('Show randam tweet preview');
      Vibe.vibrate('short');
      //send back rand
      var preview=new UI.Card({
        title:"Tweet Preview",
        subtitle:sent2emo(senti[selector].sentiment),
        body:senti[selector].tweet,
        scrollable:true
      });
      preview.show();
      preview.on('accelTap',function(){
        Vibe.vibrate('short');
        var rand=Math.floor(Math.random()*senti.length);
        //send back rand
        preview.subtitle(sent2emo(senti[rand].sentiment));
        preview.body(senti[rand].tweet);
      });
      
  }
  wind.on('accelTap',startRandomPreview);

  },//end of main success function 
  function(error){
    console.log('Failed fetching tweets');
  }
);

}





