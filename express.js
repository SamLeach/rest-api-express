var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

var db = mongoskin.db(process.env.OPENSHIFT_MONGODB_DB_URL + 'camejo', {safe:true})

app.param('collectionName', function(req, res, next, collectionName){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.send('please select a collection, e.g., /collections/messages')
})

app.get('/collections/:collectionName', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  req.collection.find({} ,{}).sort({equipo:1}).toArray(function(e, results){
    if (e) return next(e)
    res.jsonp(results)
  })
})

app.post('/collections/:collectionName/:equipo/:puntos', function(req, res, next) {
  req.collection.insert({ equipo: req.params.equipo, puntos: req.params.puntos }, {}, function(e, results){
    console.log('POSTed ' + 'Equipo: ' + req.params.equipo + ' Puntos: ' + req.params.puntos);
    console.log('POSTed Body' + 'Equipo: ' + req.body.equipo + ' Puntos: ' + req.body.puntos);
    if (e) return next(e)
    res.jsonp(results)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.jsonp(result)
  })
})

app.put('/collections/:collectionName/:id/:puntos', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  req.collection.updateById(req.params.id, {$set:{ puntos: req.params.puntos } }, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.jsonp((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:collectionName/:id', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.jsonp((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:collectionName', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  req.collection.drop(function(e, result){
    if (e) return next(e)
    res.jsonp((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', 'camejo' , 'http://camejo-samleach.rhcloud.com/collections/football/');
})
