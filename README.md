slack-daily-report
==================

generate daily history of target channel

```
Usage: sdr -t [token] -c [channel]

Options:

    -h, --help                              output usage information
    -V, --version                           output the version number
    -t, --token [token]                     Slack Access Token
    -c, --channel [channel id]              Slack Channel ID to retrieve data
    -f, --from [from timestamp in seconds]  Timestamp in seconds from when to get history[defaults to today]
```


## TODO

- [ ] customizable template
- [ ] fetch all messages in target period(currently only first 100 messages are obtained)
