'use strict';

var express = require('express');
var request = require('supertest');
var test    = require('tape');

var minifyHTML = require('../minifier.js');
var expectedHTML = '<!DOCTYPE html><html><head class=head><meta charset=UTF-8><title>Express minify HTML handlebars example</title></head><body id=body>Hello world</body><script type=text/javascript>function reallyNiceFunction(){return"Hello!"}</script></html>';

var exhbs = require('express-handlebars');
var hbs  = exhbs.create({
    defaultLayout: 'test',
    layoutsDir:    __dirname
});

var app = express();

app.engine('handlebars', hbs.engine);

app.set('views', __dirname);

app.use(minifyHTML({
    override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

app.get('/test', function (req, res, next) {
    res.render('test', { hello : 'world' });
});

test('Should minify EJS templates', function (t) {
    app.set('view engine', 'ejs');

    request(app)
        .get('/test')
        .expect(200)
        .end(function (err, res) {
            t.equal(res.text, expectedHTML);
            t.end();
        });
});

test('Should minify Jade templates', function (t) {
    app.set('view engine', 'jade');

    request(app)
        .get('/test')
        .expect(200)
        .end(function (err, res) {
            t.equal(res.text, expectedHTML);
            t.end();
        });
});

test('Should minify Handlebars templates', function (t) {
    app.set('view engine', 'handlebars');

    request(app)
        .get('/test')
        .expect(200)
        .end(function (err, res) {
            t.equal(res.text, expectedHTML);
            t.end();
        });
});

