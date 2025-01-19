const listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListing = await listing.find({});
    res.render("listings/index.ejs",{listing:allListing});
}

module.exports.renderNewListingForm = (req,res)=>{
    res.render("listings/newListing.ejs");
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let result = await listing.findByIdAndUpdate(id,{...req.body});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    result.image={url,filename};
    await result.save();
    }
    req.flash("success","Listing Updated Succesfully!");
    res.redirect(`/listing/${id}`);
}

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id) .populate({
        path: "reviews",
        populate: { path: "author" }
    })
    .populate("owner");
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }    
    res.render("listings/listing.ejs",{list:listingData});
}


module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listingData =await listing.findById(id);
    if (!listingData) {
        req.flash("error", "Listing not Exist!");
        return res.redirect("/listing");
    }       
    res.render("listings/Edit.ejs",{list:listingData});
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedData= await listing.findByIdAndDelete(id);
    console.log(deletedData);
    req.flash("success","Listing Deleted Succesfully!");
    res.redirect("/listing");
}

module.exports.addListing = async (req,res,next)=>{
    try{
        let cord = await geocodingClient
    .forwardGeocode({
        query: req.body.location +","+ req.body.country,
        limit: 1
      })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    let {title,description,image,price,location,country,category}=req.body;
    let newListing = new listing({title:title,description,image,price,location,country,category});
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    newListing.geometry = cord.body.features[0].geometry;
    const result =await newListing.save();
    req.flash("success","New Listing created Succesfully!");
    res.redirect("/listing");
    }
    catch(e){
        req.flash("error","cannot find location on map. Please recheck your location");
        return res.redirect("/listing/new");
    }
}
