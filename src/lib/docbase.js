'use strict';

import request from 'superagent';
import Rx from 'rx';

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

const host = "https://api.docbase.io";

function getTeamsUrl() {
    return `${host}/teams`;
}

function getDomainUrl(domain) {
    return `$host/$domain`;
}

function getGroupUrl(domain) {
    return`${getDomainUrl(domain)}/groups`;
}

function getTagUrl(domain) {
    return `${getDomainUrl(domain)}/tags`;
}

function getPostUrl(domain) {
    return `${getDomainUrl(domain)}/posts`;
}

class Docbase {
    constructor(options) {
        let {
            token,
            ...others
        } = options;

        this.token = token;
        this.options = others;
        this.domain = '';
        this.teams = [];
        this.groups = [];
        this.tags = [];
    }

    setBaseHeaders(req) {
        return req.set('X-Api-Version', '1')
            .set('X-DocBaseToken', this.token);
    }

    fetchTeams() {
        return Rx.Observable.fromSuperagent(
            setBaseHeaders(request.get(getTeamsUrl()))
        );
    }

    fetchGroups() {

    }

    fetchTags() {

    }

    createPost(title, body, options) {

    }
}

export default Docbase;
