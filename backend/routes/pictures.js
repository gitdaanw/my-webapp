const express = require("express");
const router = express.Router();
const sequelize = require("../sequelize");
const Picture = require("../models/Picture");
const { requireLoginPage } = require("../utils/authentication");

const DEFAULT_SORT = "date-asc"; // adds a backup sort default

/*
This file handles public and for now one protected API endpoints used for interacting with pictures.
It contains the following endpoints:
- /pictures - overview of pictures using sorting, categories and pictures per page
- /pictures/categories - list the categories, used for testing
- /pictures/count - helper route to retrieve the picture count
- /pictures/:id - allows looking for a picture using the id by doing pictures/5
- /pictures/:id - delete route, to delete pictures // TODO move to /logged_in_user
*/

// GET route to get pictures with default sorting, category selection and pictures per page
router.get("/", async (req, res) => {
    try {
        const category = req.query.category;
        const sort = req.query.sort || DEFAULT_SORT;
        const page = parseInt(req.query.page) || 1;
        let perPage = req.query.perPage === "all" ? null : parseInt(req.query.perPage) || 8;
    
        // WHERE clause to allow for filtering
        const where = {};
        if (category && category !== "all") {
            where.category_nl = sequelize.where(
              sequelize.fn("LOWER", sequelize.col("category_nl")),
              category.toLowerCase()
            );
          }
    
        // determine sorting (e.g., date-asc or title-desc)
        const [attribute, order] = sort.split("-");
        const orderClause = [[attribute || "date", order?.toUpperCase() || "ASC"]];
    
        // pagination setup
        const limit = perPage || undefined;
        const offset = perPage ? (page - 1) * perPage : undefined;
    
        // fetch from db with filters, sorting, and pagination
        const { rows: pictures, count: total } = await Picture.findAndCountAll({
          where,
          order: orderClause,
          limit,
          offset
        });
    
        res.json({
          totalPages: perPage ? Math.ceil(total / perPage) : 1,
          currentPage: page,
          pictures
        });
      } catch (error) {
        console.error("Error processing /pictures request:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });    

// GET route to get all categories in the collection
router.get("/categories", async (req, res) => {
    try {
      const pictures = await Picture.findAll({ attributes: ["category_nl"] });
      const categories = [...new Set(pictures.map(p => p.category_nl))].sort();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// GET route to get a count for the number of pictures in the collection
router.get("/count", async (req, res) => {
    try {
      const category = req.query.category;
      const where = {};
  
      if (category && category !== "all") {
        where.category_nl = sequelize.where(
          sequelize.fn("LOWER", sequelize.col("category_nl")), // col represents a column in the database, needed for queries like this
          category.toLowerCase()
        );
      }
  
      const total = await Picture.count({ where });
      res.json({ total });
    } catch (error) {
      console.error("Error in /pictures/count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// GET route for single picture using ID
router.get("/:id", async (req, res) => {
    try {
      const picture = await Picture.findByPk(req.params.id);
  
      if (!picture) {
        return res.status(404).json({ message: "Picture not found" });
      }
  
      res.json(picture);
    } catch (error) {
      console.error("Error fetching picture by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// DELETE route for deletion of a single picture, requires login before use
// TODO need to move this route to /logged_in_user and update so it checks user role
router.delete("/:id", requireLoginPage, async (req, res) => {
    try {
      const picture = await Picture.findByPk(req.params.id);
  
      if (!picture) {
        return res.status(404).json({ message: "Picture not found" });
      }
  
      await picture.destroy();
      res.status(200).json({ message: `Picture with ID ${req.params.id} deleted.` });
    } catch (error) {
      console.error("Error deleting picture:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;