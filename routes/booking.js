const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");

// Show booking form
router.get("/listings/:id/book", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/book", { listing });
    } catch (e) {
        console.error(e);
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
});

// Handle booking submission
router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const { startDate, endDate, totalPrice} = req.body;
        console.log("Booking data:", {startDate, endDate});
        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            startDate,
            endDate,
            totalPrice,
        });

        await booking.save();
        req.flash("success", "Booking confirmed!");
        return res.redirect(`/listings/${listing._id}`);
    } catch (e) {
        console.error("Booking error:", e);
        req.flash("error", "Failed to book. Please try again.");
        return res.redirect("/listings");
    }
});

module.exports = router;