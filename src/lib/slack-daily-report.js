'use strict';
import request from 'superagent';
import Rx from 'rx';

const urlHistory = 'https://slack.com/api/channels.history';
const urlUsers = 'https://slack.com/api/users.list';
const urlChannels = 'https://slack.com/api/channels.list';

Rx.Observable.fromSuperagent = req => {
    return Rx.Observable.create(observable => {
        req.end((err, res) => {
            if (err) {
                observable.onError(err);
            } else {
                observable.onNext(res);
            }
            observable.onCompleted();
        });
    });
}

class SlackDailyReport {
    constructor(options) {
        let {
            token,
            ...others
        } = options;

        this.token = token;
        this.options = others;

        this.users = [];
        this.channels = [];

        // console.log('token:', this.token);
    }

    getHistory(channelName, from) {
        let that = this;
        let usersObservable = this.fetchUsers();
        let channelsObservable = this.fetchChannels();

        Rx.Observable.zip(
            channelsObservable
                .flatMap(res => Rx.Observable.from(res.body.channels))
                .filter(channel => channel.name == channelName)
                .first(),
            usersObservable
                .flatMap(res => Rx.Observable.just(res.body.members)),
            (channel, members) => {
                return {channelId: channel.id, members: members};
            })
            .flatMap((obj) => {
                that.users = obj.members;
                return that.fetchHistory(obj.channelId, from);
            })
            .flatMap(res => {
                console.log('<table>');
                return Rx.Observable.from(res.body.messages.reverse());
            })
            .map(item => {
                let time = item.ts.split('.')[0];
                let date = new Date(+time * 1000);
                let username;
                if (item.user) {
                    let user = that.users.filter(user => user.id == item.user)[0];
                    if (user) {
                        username = user.name;
                    } else {
                        username = item.user;
                    }
                }
                console.log('<tr><td>');
                console.log(`<p><b>${that.escapeText(item.text)}</b></p>`);
                console.log(`<p>${username || item.username} at ${date}</p>`);
                console.log('</td></tr>');

                return item;
            })
            .subscribe(
                (item) => {},
                (err) => {
                    console.log(err);
                },
                () => {
                    console.log('</table>');
                }
            )
    }

    fetchHistory(channel, from) {
        this.channel = channel;
        this.from = from;

        let that = this;

        // console.log('channel:', this.channel);
        // console.log('from:', this.from);

        return Rx.Observable.fromSuperagent(
            request.get(urlHistory)
                .query({
                    token: this.token,
                    channel: this.channel,
                    oldest: this.from
                }));
    }

    fetchUsers() {
        return Rx.Observable.fromSuperagent(
            request.get(urlUsers)
                .query({
                    token: this.token,
                    presence: 0
                }));
    }

    fetchChannels() {
        return Rx.Observable.fromSuperagent(
            request.get(urlChannels)
                .query({
                    token: this.token,
                    exclude_archived: 1
                }));
    }

    escapeText(text) {
        return text/*.replace(/&/g, '&amp;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, "&apos;")*/
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;');
    }
}

export default SlackDailyReport;
