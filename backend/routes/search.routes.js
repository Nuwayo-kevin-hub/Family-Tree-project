const express = require("express");
const router = express.Router();

const searchController = require("../controllers/search.controller");
const authMiddleware = require("../middlewares/auth.middleware");


// search members
router.get("/", searchController.searchFamily);

router.get(
    "/matches/:requestId",
    searchController.getMatches
);

router.get(
"/request/:requestId",
authMiddleware,
searchController.getRequestDetails
);

router.put(
    "/approve/:id",
    authMiddleware,
    searchController.approveRequest
);


router.get(
"/my-requests",
authMiddleware,
searchController.getMyRequests
);

// create lost family request
router.post("/request", searchController.createRequest);


// get all requests
router.get("/requests", searchController.getRequests);


// approve request
router.put("/request/:id/approve", searchController.approveRequest);


// reject request
router.put(
    "/reject/:id",
    authMiddleware,
    searchController.rejectRequest
);




module.exports = router;