#!/usr/bin/env node
/**
* command.js
*/
import program from 'commander';
import SlackDailyReport from '../lib/slack-daily-report';

program
    .version('1.0.0')
    .usage('test')
    .option('-t, --token [token]', 'Slack Access Token')
    .option('-c, --channel [channel id]', 'Slack Channel ID to retrieve data')
    .option('-f, --from [from timestamp in seconds]', 'Timestamp in seconds from when to get history[defaults to today]')
    .parse(process.argv);

if (!program.token && !program.channel) {
    console.error('you need to pass --token and --channel');
} else {
    let sdr = new SlackDailyReport({
        token: program.token
    });

    let fromDate = program.from || Math.floor((new Date((new Date()).toJSON().slice(0, 10))).getTime() / 1000);
    // sdr.fetchHistory(program.channel,  fromDate);
    sdr.getHistory(program.channel, fromDate);
}
