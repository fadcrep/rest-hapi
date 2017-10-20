'use strict';

const Boom = require('boom');
const _ = require('lodash');
const config = require('../config');

const internals = {};

/**
 * Policy to log create actions.
 * @param model
 * @param Log
 * @returns {logCreateForModel}
 */
internals.logCreate = function(mongoose, model, Log) {

  const logCreateForModel = function logCreateForModel(request, reply, next) {
    try {
      Log = Log.bind("logCreate");
      const AuditLog = mongoose.model('auditLog');

      let userId = _.get(request.auth.credentials, config.userIdKey);
      let documents = request.response.source;
      if (_.isArray(documents)) {
        documents = documents.map(function (doc) {
          return doc._id
        })
      }
      else {
        documents = [documents._id]
      }

      return AuditLog.create({
        method: "POST",
        action: "Create",
        endpoint: request.path,
        user: userId || null,
        collectionName: model.collectionName,
        documents: documents,
        payload: request.payload,
        params: request.params,
        result: request.response.source
      })
          .then(function (result) {
            next(null, true);
          })
          .catch(function (err) {
            Log.error('ERROR:', err);
            next(null, true);
          })
    }
    catch (err) {
      Log.error("ERROR:", err);
      return next(null, true);
    }

  };

  logCreateForModel.applyPoint = 'onPostHandler';
  return logCreateForModel;
};
internals.logCreate.applyPoint = 'onPostHandler';


/**
 * Policy to log update actions.
 * @param model
 * @param Log
 * @returns {logUpdateForModel}
 */
internals.logUpdate = function(mongoose, model, Log) {

  const logUpdateForModel = function logUpdateForModel(request, reply, next) {
    try {
      Log = Log.bind("logUpdate");
      const AuditLog = mongoose.model('auditLog');

      let userId = _.get(request.auth.credentials, config.userIdKey);
      let documents = [request.params._id];

      return AuditLog.create({
        method: "PUT",
        action: "Update",
        endpoint: request.path,
        user: userId || null,
        collectionName: model.collectionName,
        documents: documents,
        payload: request.payload,
        params: request.params,
        result: request.response.source
      })
          .then(function (result) {
            next(null, true);
          })
          .catch(function (err) {
            Log.error('ERROR:', err);
            next(null, true);
          })
    }
    catch (err) {
      Log.error("ERROR:", err);
      return next(null, true);
    }

  };

  logUpdateForModel.applyPoint = 'onPostHandler';
  return logUpdateForModel;
};
internals.logUpdate.applyPoint = 'onPostHandler';

module.exports = {
  logUpdate : internals.logUpdate
};

/**
 * Policy to log delete actions.
 * @param model
 * @param Log
 * @returns {logDeleteForModel}
 */
internals.logDelete = function(mongoose, model, Log) {

  const logDeleteForModel = function logDeleteForModel(request, reply, next) {
    try {
      Log = Log.bind("logDelete");
      const AuditLog = mongoose.model('auditLog');

      let userId = _.get(request.auth.credentials, config.userIdKey);
      let documents = request.params._id || request.payload;
      if (_.isArray(documents) && documents[0]._id) {
        documents = documents.map(function (doc) {
          return doc._id
        })
      }
      else {
        documents = [documents]
      }

      return AuditLog.create({
        method: "DELETE",
        action: "Delete",
        endpoint: request.path,
        user: userId || null,
        collectionName: model.collectionName,
        documents: documents,
        payload: request.payload,
        params: request.params,
        result: request.response.source
      })
          .then(function (result) {
            next(null, true);
          })
          .catch(function (err) {
            Log.error('ERROR:', err);
            next(null, true);
          })
    }
    catch (err) {
      Log.error("ERROR:", err);
      return next(null, true);
    }

  };

  logDeleteForModel.applyPoint = 'onPostHandler';
  return logDeleteForModel;
};
internals.logDelete.applyPoint = 'onPostHandler';

module.exports = {
  logDelete : internals.logDelete
};

/**
 * Policy to log add actions.
 * @param model
 * @param Log
 * @returns {logAddForModel}
 */
internals.logAdd = function(mongoose, model, Log) {

  const logAddForModel = function logAddForModel(request, reply, next) {
    try {
      Log = Log.bind("logAdd");
      const AuditLog = mongoose.model('auditLog');

      let userId = _.get(request.auth.credentials, config.userIdKey);
      let documents = [request.params.ownerId];
      let method = 'POST';

      if (request.method === 'put') {
        method = 'PUT';
      }

      return AuditLog.create({
        method: method,
        action: "Add",
        endpoint: request.path,
        user: userId || null,
        collectionName: model.collectionName,
        documents: documents,
        payload: request.payload,
        params: request.params,
        result: request.response.source
      })
          .then(function (result) {
            next(null, true);
          })
          .catch(function (err) {
            Log.error('ERROR:', err);
            next(null, true);
          })
    }
    catch (err) {
      Log.error("ERROR:", err);
      return next(null, true);
    }

  };

  logAddForModel.applyPoint = 'onPostHandler';
  return logAddForModel;
};
internals.logAdd.applyPoint = 'onPostHandler';

/**
 * Policy to log remove actions.
 * @param model
 * @param Log
 * @returns {logRemoveForModel}
 */
internals.logRemove = function(mongoose, model, Log) {

  const logRemoveForModel = function logRemoveForModel(request, reply, next) {
    try {
      Log = Log.bind("logRemove");
      const AuditLog = mongoose.model('auditLog');

      let userId = _.get(request.auth.credentials, config.userIdKey);
      let documents = [request.params.ownerId];

      return AuditLog.create({
        method: 'DELETE',
        action: "Remove",
        endpoint: request.path,
        user: userId || null,
        collectionName: model.collectionName,
        documents: documents,
        payload: request.payload,
        params: request.params,
        result: request.response.source
      })
          .then(function (result) {
            next(null, true);
          })
          .catch(function (err) {
            Log.error('ERROR:', err);
            next(null, true);
          })
    }
    catch (err) {
      Log.error("ERROR:", err);
      return next(null, true);
    }

  };

  logRemoveForModel.applyPoint = 'onPostHandler';
  return logRemoveForModel;
};
internals.logRemove.applyPoint = 'onPostHandler';


module.exports = {
  logCreate : internals.logCreate,
  logUpdate : internals.logUpdate,
  logDelete : internals.logDelete,
  logAdd : internals.logAdd,
  logRemove : internals.logRemove
};

