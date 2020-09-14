const express = require('express');
const router = express.Router();

//Query Parameters
router.get('/', (req, res, next) => {
    var queryParameter = req.query;

    res.json(queryParameter);
});

module.exports = router;