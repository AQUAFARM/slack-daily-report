'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var urlHistory = 'https://slack.com/api/channels.history';
var urlUsers = 'https://slack.com/api/users.list';

var SlackDailyReport = (function () {
    function SlackDailyReport(options) {
        _classCallCheck(this, SlackDailyReport);

        var token = options.token;

        var others = _objectWithoutProperties(options, ['token']);

        this.token = token;
        this.options = others;

        // console.log('token:', this.token);
    }

    _createClass(SlackDailyReport, [{
        key: 'fetchHistory',
        value: function fetchHistory(channel, from) {
            this.channel = channel;
            this.from = from;

            var that = this;

            // console.log('channel:', this.channel);
            // console.log('from:', this.from);

            _superagent2.default.get(urlHistory).query({
                token: this.token,
                channel: this.channel,
                oldest: this.from
            }).end(function (err, res) {
                // console.log(res.body);
                console.log('<table>');
                res.body.messages.reverse().forEach(function (item) {
                    var time = item.ts.split('.')[0];
                    var date = new Date(+time * 1000);
                    console.log('<tr><td>');
                    console.log('<p><b>' + that.escapeText(item.text) + '</b></p>');
                    console.log('<p>' + (item.user || item.username));
                    console.log('at ' + date + '</p>');
                    console.log('</td></tr>');
                });
                console.log('</table>');
            });
        }
    }, {
        key: 'fetchUsers',
        value: function fetchUsers() {
            this.users = [];

            _superagent2.default.get(urlUsers).query({
                token: this.token,
                presence: 0
            }).end(function (err, res) {
                // console.log(res.body);
            });
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