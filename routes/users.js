'use strict';

const _       = require('lodash');
const db      = require('../db.js');
const express = require('express');
const router  = express.Router();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next){
    db('auth.users')
        .select()
        .where(req.query || {})
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.post('/', function(req, res, next){
    db('auth.users')
        .insert(req.body)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get('/:user_id', function(req, res, next){
    db('auth.users')
        .first()
        .where(req.params)
        .then ( user => {
            db('auth.endpoints')
                .select()
                .where(req.params)
                .then ( endpoints => {
                    user.endpoints = endpoints;
                    res.status(200).jsonp(user)
                })
        })
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete('/:user_id', function(req, res, next){
    db('auth.users')
        .del()
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.patch('/:user_id', function(req, res, next){
    db('auth.users')
        .update(req.body, { patch: true })
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.post('/:user_id/endpoints', function(req, res, next){
    db('auth.endpoints')
        .insert(req.body)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete('/:user_id/endpoints/:endpoint_id', function(req, res, next){
    db('auth.endpoints')
        .del()
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});
module.exports = router;
