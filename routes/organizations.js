'use strict';

const _       = require('lodash');
const db      = require('../db.js');
const express = require('express');
const router  = express.Router();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next){
    db('auth.organizations')
        .select()
        .where(req.query || {})
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.post('/', function(req, res, next){
    db('auth.organizations')
        .insert(req.body)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.get('/:organization_id', function(req, res, next){
    db('auth.organizations')
        .first()
        .where(req.params)
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete('/:organization_id', function(req, res, next){
    db('auth.organizations')
        .del()
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.patch('/:organization_id', function(req, res, next){
    db('auth.organizations')
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
router.get('/:organization_id/assignments', function(req, res, next){
    db('auth.assignments')
        .select()
        .where(req.params)
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.post('/:organization_id/assignments', function(req, res, next){
    db('auth.assignments')
        .insert(req.body)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.delete('/:organization_id/assignments/:assign_id', function(req, res, next){
    db('auth.assignments')
        .del()
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
router.patch('/:organization_id/assignments/:assign_id', function(req, res, next){
    db('auth.assignments')
        .update(req.body, { patch: true })
        .where(req.params)
        .returning('*')
        .then ( out => res.status(200).jsonp(out) )
        .catch( err => res.status(404).jsonp(err) );
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

module.exports = router;
