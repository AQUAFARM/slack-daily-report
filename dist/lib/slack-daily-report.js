'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var urlHistory = 'https://slack.com/api/channels.history';
var urlUsers = 'https://slack.com/api/users.list';
var urlChannels = 'https://slack.com/api/channels.list';

_rx2.default.Observable.fromSuperagent = function (req) {
    return _rx2.default.Observable.create(function (observable) {
        req.end(function (err, res) {
            if (err) {
                observable.onError(err);
            } else {
                observable.onNext(res);
            }
            observable.onCompleted();
        });
    });
};

var SlackDailyReport = (function () {
    function SlackDailyReport(options) {
        _classCallCheck(this, SlackDailyReport);

        var token = options.token;

        var others = _objectWithoutProperties(options, ['token']);

        this.token = token;
        this.options = others;

        this.users = [];
        this.channels = [];

        // console.log('token:', this.token);
    }

    _createClass(SlackDailyReport, [{
        key: 'getHistory',
        value: function getHistory(channelName, from) {
            var that = this;
            var usersObservable = this.fetchUsers();
            var channelsObservable = this.fetchChannels();

            _rx2.default.Observable.zip(channelsObservable.flatMap(function (res) {
                return _rx2.default.Observable.from(res.body.channels);
            }).filter(function (channel) {
                return channel.name == channelName;
            }).first(), usersObservable.flatMap(function (res) {
                return _rx2.default.Observable.just(res.body.members);
            }), function (channel, members) {
                return { channelId: channel.id, members: members };
            }).flatMap(function (obj) {
                that.users = obj.members;
                return that.fetchHistory(obj.channelId, from);
            }).flatMap(function (res) {
                console.log('<table>');
                return _rx2.default.Observable.from(res.body.messages.reverse());
            }).map(function (item) {
                var time = item.ts.split('.')[0];
                var date = new Date(+time * 1000);
                var username = undefined;
                if (item.user) {
                    var user = that.users.filter(function (user) {
                        return user.id == item.user;
                    })[0];
                    if (user) {
                        username = user.name;
                    } else {
                        username = item.user;
                    }
                }
                console.log('<tr><td>');
                console.log('<p><b>' + that.escapeText(item.text) + '</b></p>');
                console.log('<p>' + (username || item.username) + ' at ' + date + '</p>');
                console.log('</td></tr>');

                return item;
            }).subscribe(function (item) {}, function (err) {
                console.log(err);
            }, function () {
                console.log('</table>');
            });
        }
    }, {
        key: 'fetchHistory',
        value: function fetchHistory(channel, from) {
            this.channel = channel;
            this.from = from;

            var that = this;

            // console.log('channel:', this.channel);
            // console.log('from:', this.from);

            return _rx2.default.Observable.fromSuperagent(_superagent2.default.get(urlHistory).query({
                token: this.token,
                channel: this.channel,
                oldest: this.from
            }));
        }
    }, {
        key: 'fetchUsers',
        value: function fetchUsers() {
            return _rx2.default.Observable.fromSuperagent(_superagent2.default.get(urlUsers).query({
                token: this.token,
                presence: 0
            }));
        }
    }, {
        key: 'fetchChannels',
        value: function fetchChannels() {
            return _rx2.default.Observable.fromSuperagent(_superagent2.default.get(urlChannels).query({
                token: this.token,
                exclude_archived: 1
            }));
        }
    }, {
        key: 'escapeText',
        value: function escapeText(text) {
            return text /*.replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, "&apos;")*/
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }]);

    return SlackDailyReport;
})();

exports.default = SlackDailyReport;