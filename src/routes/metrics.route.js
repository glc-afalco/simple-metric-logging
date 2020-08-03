module.exports = (app) => {
    // CORS
    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    let MetricsModule = require('../modules/metrics.module')
    let metricsModule = new MetricsModule()

    app.post('/metrics/:key', (req, res) => {
        let key = req.params.key
        let value = req.body.value
        res.status(200).send({ status: metricsModule.addMetric(key, value) })
    });

    app.get('/metrics/:key/sum', (req, res) => {
        let key = req.params.key
        res.status(200).send({ value: metricsModule.sumMetric(key) });
    });

}
