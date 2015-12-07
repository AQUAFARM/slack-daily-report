'use strict';
import request from 'superagent';

const urlHistory = 'https://slack.com/api/channels.history';
const urlUsers = 'https://slack.com/api/users.list';

class SlackDailyReport {
    constructor(options) {
        let {
            token,
            ...others
        } = options;

        this.token = token;
        this.options = others;

        // console.log('token:', this.token);
    }

    fetchHistory(channel, from) {
        this.channel = channel;
        this.from = from;

        let that = this;

        // console.log('channel:', this.channel);
        // console.log('from:', this.from);

        request.get(urlHistory)
        .query({
            token: this.token,
            channel: this.channel,
            oldest: this.from
        }).end(function(err, res) {
            // console.log(res.body);
            console.log('<ul>');
            res.body.messages.forEach((item) => {
                let time = item.ts.split('.')[0];
                let date = new Date(+time * 1000);
                console.log('<li>');
                console.log(`<span>${item.user || item.username}</span>`);
                console.log(`<p>${that.escapeText(item.text)}</p>`);
                console.log(`<span>at ${date}</span>`);
                console.log('</li>');
            })
            console.log('</ul>');
        });
    }

    fetchUsers() {
        this.users = [];

        request.get(urlUsers)
            .query({
                token: this.token,
                presence: 0
            }).end(function(err, res) {
                // console.log(res.body);
            });
    }

    escapeText(text) {
        return text.replace(/&/g, '&amp;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, "&apos;")
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;');
    }
}

export default SlackDailyReport;
