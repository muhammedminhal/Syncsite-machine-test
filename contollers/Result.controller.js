
const Result = require('../models/Results.model')

exports.getResult = async (req, res) => {
    try {
        //  queries database to find a all results

        await Result.find({}, (err, data) => {
            if (!err) {
                res.status(201).json({
                    title: 'Response Successful',
                });
            }
        })
    } catch (err) {
        res.status(404)
        throw new Error(err, "Somthing went wrong")
    }
}

