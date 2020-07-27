const fs = require('fs')

var metricsModule = function () {

    this.addMetric = (req, res) => {
        let isModelExistent = _checkModelExist(req.params.key + '.json')
        if (isModelExistent) {
            _validateModel(req)
        } else {
            _createModel(req.body.value).then((model) => {
                _writeModel(model, req.params.key + '.json')
            })
        }
        res.status(200).send({});
    }

    this.sumMetric = (req, res) => {
        let isModelExistent = _checkModelExist(req.params.key + '.json')
        if (isModelExistent) {
            let modelToSum = JSON.parse(fs.readFileSync(req.params.key + '.json'))
            let incomingTimestamp = new Date(Date.now())
            let currentTimestamp = new Date(modelToSum.index["0_timestamp"])
            let incomingHour = Math.floor(incomingTimestamp / (1000 * 60 * 60))
            let currentHour = Math.floor(currentTimestamp / (1000 * 60 * 60))
            let hourDiff = parseInt(incomingHour - currentHour)
            let value = 0
            if (hourDiff <= 1) {
                value = _sumModel(modelToSum)
            }
            res.status(200).send({ value })
        } else {
            res.status(200).send({ "value": 0 })
        }
    }

    const _checkModelExist = (path) => {
        if (fs.existsSync(path)) {
            return true
        }
        else {
            return false
        }
    }

    const _sumModel = (model) => {
        let incomingTimestamp = new Date(Date.now())
        let currentTimestamp = new Date(model.index["0_timestamp"])
        let incomingHour = Math.floor(incomingTimestamp / (1000 * 60 * 60))
        let currentHour = Math.floor(currentTimestamp / (1000 * 60 * 60))
        let hourDiff = parseInt(incomingHour - currentHour)
        if (hourDiff <= 1) {
            let value = 0
            for (let i in model.data["0"]) {
                value = value + model.data["0"][i]
            }
            return value
        } else {
            return 0
        }
    }

    const _validateModel = (req) => {
        _readModel(req.params.key + '.json').then((model) => {
            let incomingTimestamp = new Date(Date.now())
            let currentTimestamp = new Date(model.index["0_timestamp"])
            let incomingHour = Math.floor(incomingTimestamp / (1000 * 60 * 60))
            let currentHour = Math.floor(currentTimestamp / (1000 * 60 * 60))
            let incomingMinute = new Date(1000 * Math.round(incomingTimestamp / 1000)).getMinutes()
            let hourDiff = incomingHour - currentHour
            if (incomingHour !== currentHour && hourDiff > 1) {
                _deleteModel(req.params.key + '.json').then(() => {
                    _createModel(req.body.value).then((model) => { _writeModel(model, req.params.key) })
                })
            } else if (incomingHour !== currentHour && hourDiff <= 1) {
                let temp = model.data["0"]
                _createModel(req.body.value).then((newModel) => {
                    newModel.data["-1"] = temp
                    _deleteModel(req.params.key + '.json').then(() => {
                        _writeModel(newModel, req.params.key + '.json')
                    })
                })
            } else {
                model.data["0"][incomingMinute] = model.data["0"][incomingMinute] + req.body.value
                _deleteModel(req.params.key + '.json').then(() => {
                    _writeModel(model, req.params.key + '.json')
                })
            }
        })
    }

    const _createModel = (value) => {
        return new Promise((resolve, reject) => {
            let current = {}
            let last = {}
            for (i = 0; i < 60; i++) {
                current[i] = 0
                last[i] = 0
            }
            let currentTimestamp = new Date(Date.now())
            let date = currentTimestamp.toISOString()
            let hour = currentTimestamp.getHours()
            let minute = new Date(1000 * Math.round(currentTimestamp / 1000)).getMinutes()
            let index = {
                "0": date.substr(0, 10) + '-' + hour,
                ["0_timestamp"]: currentTimestamp,
                "-1": date.substr(0, 10) + '-' + (hour - 1),
            }
            let json = {
                data: {
                    "0": current,
                    "-1": last
                },
                index
            }
            json.data["0"][minute] = value
            if (json) {
                resolve(json)
            } else {
                reject('model was not created')
            }
        })
    }

    const _writeModel = (model, path) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(model), (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    const _readModel = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) reject(err)
                else resolve(JSON.parse(data))
            });
        })
    }

    const _deleteModel = (path) => {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }

}

module.exports = metricsModule
