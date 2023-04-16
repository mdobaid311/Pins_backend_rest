const express = require("express");
const generateImages = require("../controllers/dallE");
const router = express.Router();

router.get("/generate/:queryString", generateImages);

module.exports = router;
