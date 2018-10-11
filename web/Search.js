const aggs = {
  styles: {
    terms: { field: "style.keyword" }
  },
  genres: {
    terms: { field: "genre.keyword" }
  },
  dates: {
     "stats" : { "field" : "year.as_int" } 
  }
  
};

var populate = function(body) {
  var query = {
    query: {
      bool: {
        must: [],
        should: [
          { match: { searchable: body.term } },
          { match: { year: {query: body.term} } }
         
        ],
        filter: [],
        must_not: []
      }
    }
  };

  return query;
};

var search = function(body) {
  return new Promise((resolve, reject) => {
    var elasticsearch = require("elasticsearch");
    var client = new elasticsearch.Client({
      host: "localhost:9200"
    });
    var query = populate(body);
    if (body.term == "") {
      query = {
        query: {
          bool: {
            must: [],
            should: [{ match_all: {} }],
            filter: [],
            must_not: []
          }
        }
      };
    }
    query.aggs = aggs; 
    if (body.style) {
      query.query.bool.must.push({match: {style: body.style}});
    }
    if (body.genre) {
      query.query.bool.must.push({match: {genre: body.genre}});
    }
    if (body.dates) {
      query.query.bool.must.push({ range: { "year.as_date": {gte: body.dates.min, lte: body.dates.max,"format": "yyyy||yyyy"} } });
    }
    //query.query.bool.filter.push({"exists" : { "field" : "curr_image" }})
    console.log(JSON.stringify(query));
    client
      .search({
        index: "music",
        type: "doc",
        body: query
      })
      .then(function(res, err) {
        resolve(res);
      });
  });
};
module.exports = search;
