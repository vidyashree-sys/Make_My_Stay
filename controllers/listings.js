const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
 };

 module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews",
      populate:{
        path: "author"
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error", "listing you requested is does not exist!");
      res.redirect("/listings");
     
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
  };
module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.files && req.files.length > 0) {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newListing.images = imgs; // ✅ Set array of image objects
  }

  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // Handle multiple images: create resized versions
  let resizedImages = [];
  if (listing.images && listing.images.length > 0) {
    resizedImages = listing.images.map(img => ({
      resizedUrl: img.url.replace("/upload", "/upload/w_250"),
      filename: img.filename
    }));
  }

  res.render("listings/edit.ejs", { listing, resizedImages });
};


     module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    listing.images.push(...imgs); // Add new images to existing array
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};


        module.exports.destroyListing = async(req, res) =>{
            let { id } = req.params;
          let deletedlisting= await Listing.findByIdAndDelete(id);
          console.log(deletedlisting);
          req.flash("success", "Listing Deleted!")
          res.redirect("/listings");
           };