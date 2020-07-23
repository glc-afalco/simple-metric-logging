module.exports = (app) => {
    // CORS
    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    let MetricsModule = require('../modules/metrics.modules')
    let metricsModule = new MetricsModule()

    app.post('/metrics/:key', (req, res) => {
        res.send(metricsModule.addMetric(req, res))
    });

    app.get('/metrics/:key/sum', (req, res) => {
        res.send(metricsModule.sumMetric(req, res))
    });

}
