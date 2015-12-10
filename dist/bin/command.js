#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _slackDailyReport = require('../lib/slack-daily-report');

var _slackDailyReport2 = _interopRequireDefault(_slackDailyReport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* command.js
*/

_commander2.default.version('1.0.2').usage('-t [token] -c [channel]').option('-t, --token [token]', 'Slack Access Token').option('-c, --channel [channel id]', 'Slack Channel ID to retrieve data').option('-f, --from [from timestamp in seconds]', 'Timestamp in seconds from when to get history[defaults to today]').parse(process.argv);

if (!_commander2.default.token && !_commander2.default.channel) {
    console.error('you need to pass --token and --channel');
} else {
    var sdr = new _slackDailyReport2.default({
        token: _commander2.default.token
    });

    var fromDate = _commander2.default.from || Math.floor(new Date(new Date().toJSON().slice(0, 10)).getTime() / 1000);
    // sdr.fetchHistory(program.channel,  fromDate);
    sdr.getHistory(_commander2.default.channel, fromDate);
}