var csdl = require('../models/json');
var GeoJSON = require('geojson');

module.exports.select= async function (maloaihoa)
{
	var json = await csdl.select({});
    const res=GeoJSON.parse(json,{'Polygon': 'polygon'});
    console.log(res);
    return res;
}
