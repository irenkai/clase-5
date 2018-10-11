var elasticsearch = require("elasticsearch");
var fs = require("fs");
var client = new elasticsearch.Client({
  host: "http://54.202.131.206:9200"
});
var music = require("./data.json");
//console.log(music)
var doIndex = function(music,n){
  //console.log(music[n])
    client
    .index({
      index: "music",
      type: "doc",
      id: n,
      body: music[n]
    })
    .then(function(err, res) {
      console.log(err, res);
      doIndex(music, (n+1))
    }).catch(function(err,res){
        console.log(err, res)
        doIndex(music, (n+1))
    })
    
}

doIndex(music,100);   