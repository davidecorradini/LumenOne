console.log("pages/user/statistics/domains.js loaded"); // To confirm that the page has been loaded correctly
const express = require("express");
const db = require("../../../db.js");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { isAuthenticated } = require("../../../middleware/auth.js");

// Route for the user's website list
router.get("/web/statistics/list", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const statisticsFile = path.join(
    __dirname,
    "../../../../storage/statistics.json"
  );

  db.all(
    "SELECT name, port, disk_limit, uuid FROM websites WHERE user_id = ?",
    [userId],
    (err, websites) => {
      if (err) {
        console.error("Error retrieving websites:", err.message);
        return res.status(500).send("Internal server error");
      }

      db.get("SELECT rank FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
          console.error("Error retrieving rank: " + err.message);
          return res.status(500).send("Internal server error");
        }

        res.render("web/statistics/domains.ejs", {
          user: req.session.user,
          websites,
          rank: row ? row.rank : null,
        });
      });
    }
  );
});

module.exports = router;
