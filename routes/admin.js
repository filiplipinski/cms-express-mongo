const express = require("express");
const News = require("../models/news");
const router = express.Router();

// odpala sie na kazdy adres, niezaleznie czy get czy post itd.
// wykonuje sie przed innymi routami chyba ( bo jest napisany przed wszystkim)
// i tylko dla routow /admin/*
router.all("*", (req, res, next) => {
    if (!req.session.isAdminLogged) {
        res.redirect("login");
        return;
    }
    next();
});

router.get("/", (req, res) => {
    News.find({}, (err, data) => {
        res.render("admin/index", {
            title: "Admin",
            data,
        });
    });

});

router.get("/news/add", (req, res) => {
    res.render("admin/news-form", {
        title: "Dodaj news",
        errors: {},
        body: {}
    });
});

router.post("/news/add", (req, res) => {
    const {
        body
    } = req;

    const newsData = new News({
        title: body.title,
        description: body.description
    });
    const errors = newsData.validateSync();
    newsData.save(
        err => {
            if (err) {
                res.render("admin/news-form", {
                    title: "Dodaj news",
                    errors,
                    body
                });
                return;
            }

            res.redirect('/admin');
        }
    );
});

router.get("/news/delete/:id", (req, res) => {
    News.findByIdAndDelete(req.params.id, (err) => {
        res.redirect('/admin')
    });
});

module.exports = router;