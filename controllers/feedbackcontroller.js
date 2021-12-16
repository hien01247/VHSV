var csdl = require('../models/feedbackModel');

module.exports.select= async function (maloaihoa)
{
	var fblist = await csdl.select({});

	var kq="";
	for(i=0;i<fblist.length;i++)
	{
        kq=kq+"<div class='col-md-12 col-sm-12 col-xs-12'>"
            +"<div class='single-blog'>"
            +    "<div class='blog-content'>"
            +        "<div class='blog-meta'>"
            +            "<span class='admin-type'>"
            +                "<i class='fa fa-user'></i>"
            +                    fblist[i].username
            +            "</span>"
            +            "<span class='date-type'>"
            +                "<i class='fa fa-calendar'></i>"
            +                    fblist[i].date
            +            "</span>"
            +        "</div>"
            +        "<p>"+fblist[i].fback+"</p>"
            +    "</div>"
            +    "</div>"
            +"</div>"
	}
	return kq;
}


module.exports.insert = async function (newfb)
{
	created= await csdl.insert(newfb);
	return created;
}