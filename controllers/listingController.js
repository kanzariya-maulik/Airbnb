const listing = require("../models/listings");

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
    let url = req.file.path;
    let filename = req.file.filename;
    let {title,description,image,price,location,country}=req.body;
    let newListing = new listing({title:title,description,image,price,location,country});
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    const result =await newListing.save();
    req.flash("success","New Listing created Succesfully!");
    res.redirect("/listing");
}