
const expect = require('chai').expect;
const sinon = require('sinon');


let MetricsModule = require('../../../src/modules/metrics.module')
let metricsModule = new MetricsModule()

describe('Metrics Module', () => {
    let clock

    beforeEach(() => {
        clock = sinon.useFakeTimers()
    });

    afterEach(() => {
        clock.restore()
    })

    describe('Key add metrics', () => {
        it('should add metrics for key', () => {
            let key = "foo"
            let value = 10
            metricsModule.addMetric(key, value)
        })
    })


    describe('Key sum fetching', () => {
        it('should return the sum of all values added in previous hour', () => {
            expect(metricsModule.sumMetric("foo")).to.be.equal(10)
        })
    })
})
