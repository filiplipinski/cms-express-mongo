const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');

router.get('/', (req, res) => {
    const showQuiz = !req.session.isUserVoted;


    Quiz.find({}, (err, data) => {
        let sum = 0;
        data.forEach(item => sum += item.vote);
        res.render('quiz', {
            title: 'Quiz',
            data,
            showQuiz,
            sum
        });
    })
});

router.post('/', (req, res) => {
    const {
        body
    } = req;

    Quiz.findOne({
        _id: body.quizId
    }, (err, data) => {
        data.vote += 1;
        req.session.isUserVoted = true;
        data.save(() => res.redirect('/quiz'));
    })
});

module.exports = router;