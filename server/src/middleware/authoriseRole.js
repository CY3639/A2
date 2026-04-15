const authoriseRole = (pharmacistOnly) => (req, res, next) => {
    if (pharmacistOnly && !req.user.isPharmacist) {
        return res.statu(403).json({ error: "Not authorised. It can only be accessed by a Pharmacist" });
    }
    next();
};

module.exports = authoriseRole;