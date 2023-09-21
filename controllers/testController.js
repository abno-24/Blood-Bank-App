const testController = (req, res) => {
    res.status(200).send({
        message: 'Route running',
        success: true,
    })
}

module.exports = { testController };