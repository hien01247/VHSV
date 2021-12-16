const mongoose = require('mongoose');
var db = require('../database');

var userShema = new mongoose.Schema({
  username: String,
  date: String,
  fback: String,
});

const feedback = mongoose.model('feedbacks', userShema);

module.exports.select = async function (query = {}) {
  var fbData = await feedback.find(query);
  return fbData;
};

module.exports.selectOne = async function (query) {
  var fbData = await feedback.findOne(query);
  return fbData;
};

module.exports.insert = async function (newfb){
    const us = new feedback({
        username:newfb.username,
        date:newfb.date,
        fback:newfb.fback
    });
    var fbData = await us.save();
    return fbData;
}