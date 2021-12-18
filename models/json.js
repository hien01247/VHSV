var mongoose = require('mongoose');
var db = require('../database');


var s2 = new mongoose.Schema({
    coordinates: [[Number]]
});

var json = mongoose.model('bacThang', s2);

module.exports.select = async function(query){
    var jsonq = await json.find(query)
    console.log(jsonq)
    return jsonq;
}