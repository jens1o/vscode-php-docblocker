import * as path from 'path';

declare var __coverage__:any;

var istanbul = require('istanbul'),
    remap = require('remap-istanbul/lib/remap'),
    loadCoverage = require('remap-istanbul/lib/loadCoverage'),
    writeReport = require('remap-istanbul/lib/writeReport'),
    coverageDir = path.resolve(__dirname + '/../../coverage/'),
    hook = istanbul.hook,
    collector = new istanbul.Collector(),
    instrumenter = new istanbul.Instrumenter(),
    reporter = new istanbul.Reporter(false, coverageDir);

hook.hookRequire(function(file) {
    return file.indexOf(path.resolve(__dirname + '/../..') + '/out/src') !== -1;
}, instrumenter.instrumentSync.bind(instrumenter));

export function callback(cb:() => void) {
    collector.add(__coverage__);
    reporter.addAll(['json']);

    reporter.write(collector, true, function () {
        let collect = remap(loadCoverage(coverageDir + '/coverage-final.json'));
        writeReport(collect, 'lcovonly', {}, coverageDir + '/lcov.info').then(function () {
            console.log('Coverage lcov report generated');
            writeReport(collect, 'html', {}, coverageDir + '/html').then(function () {
                console.log('Coverage html report generated');
                cb.call(this);
            });
        });
    });
}
