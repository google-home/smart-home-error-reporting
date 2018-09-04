// Copyright 2019, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// The code below is not needed in standard use of the sample.
// It only should be used in order to generate the Stackdriver errors.
const functions = require('firebase-functions');
const util = require('util');

const fakeauth = functions.https.onRequest((request, response) => {
  const responseurl = util.format('%s?code=%s&state=%s',
    decodeURIComponent(request.query.redirect_uri), 'xxxxxx',
    request.query.state);
  return response.redirect(responseurl);
});

const faketoken = functions.https.onRequest((request, response) => {
  const grant_type = request.query.grant_type ?
    request.query.grant_type : request.body.grant_type;
  let obj;
  if (grant_type == 'authorization_code') {
    obj = {
      token_type: 'bearer',
      access_token: '123a',
      refresh_token: '123r',
      expires_in: 60 * 60 * 24 // 1 day
    };
  } else if (grant_type == 'refresh_token') {
    obj = {
      token_type: 'bearer',
      access_token: '123a',
      expires_in: 60 * 60 * 24 // 1 day
    }
  }
  response.status(200).json(obj);
});

// Smart home
const smarthome = functions.https.onRequest((request, response) => {
  if (request.body.inputs === undefined || request.body.inputs.length == 0) {
    console.warn('Body has no inputs');
    return;
  }
  const intent = request.body.inputs[0].intent;

  switch (intent) {
    case 'action.devices.SYNC':
      syncDevices(request, response);
      break;
    case 'action.devices.QUERY':
      queryDevices(request, response);
      break;
    case 'action.devices.EXECUTE':
      executeDevices(request, response);
      break;
    default:
      console.warn('Unknown intent', intent, 'requested');
      break;
  }
});

function syncDevices(request, response) {
  const syncLight = {
    requestId: request.body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: [{
        id: '123',
        type: 'action.devices.types.LIGHT',
        traits: [
          'action.devices.traits.OnOff'
        ],
        name: {
          defaultNames: ['My Outlet 1234'],
          name: 'Night light',
          nicknames: ['wall plug']
        },
        willReportState: false,
        deviceInfo: {
          manufacturer: 'lights-out-inc',
          model: 'hs1234',
          hwVersion: '3.2',
          swVersion: '11.4'
        }
      }]
    }
  };
  const syncLart = {
    requestId: request.body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: [{
        id: '123',
        type: 'action.devices.types.LART',
        traits: [
          'action.devices.traits.OnOff'
        ],
        name: {
          defaultNames: ['My Outlet 1234'],
          name: 'Night light',
          nicknames: ['wall plug']
        },
        willReportState: false,
        deviceInfo: {
          manufacturer: 'lights-out-inc',
          model: 'hs1234',
          hwVersion: '3.2',
          swVersion: '11.4'
        }
      }]
    }
  };
  const syncLightbulb = {
    requestId: request.body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: [{
        id: '123',
        type: 'action.devices.types.LIGHTBULB',
        traits: [
          'action.devices.traits.OnOff'
        ],
        name: {
          defaultNames: ['My Outlet 1234'],
          name: 'Night light',
          nicknames: ['wall plug']
        },
        willReportState: false,
        deviceInfo: {
          manufacturer: 'lights-out-inc',
          model: 'hs1234',
          hwVersion: '3.2',
          swVersion: '11.4'
        }
      }]
    }
  };
  const syncLightOffOn = {
    requestId: request.body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: [{
        id: '123',
        type: 'action.devices.types.LIGHT',
        traits: [
          'action.devices.traits.OffOn'
        ],
        name: {
          defaultNames: ['My Outlet 1234'],
          name: 'Night light',
          nicknames: ['wall plug']
        },
        willReportState: false,
        deviceInfo: {
          manufacturer: 'lights-out-inc',
          model: 'hs1234',
          hwVersion: '3.2',
          swVersion: '11.4'
        }
      }]
    }
  };
  const syncLightNoTraits = {
    requestId: request.body.requestId,
    payload: {
      agentUserId: '1836.15267389',
      devices: [{
        id: '123',
        type: 'action.devices.types.LIGHT',
        traits: [],
        name: {
          defaultNames: ['My Outlet 1234'],
          name: 'Night light',
          nicknames: ['wall plug']
        },
        willReportState: false,
        deviceInfo: {
          manufacturer: 'lights-out-inc',
          model: 'hs1234',
          hwVersion: '3.2',
          swVersion: '11.4'
        }
      }]
    }
  };
  response.status(200).json(syncLightNoTraits);
}

function queryDevices(request, response) {
  const queryLight = {
    requestId: request.body.requestId,
    payload: {
      devices: {
        123: {
          on: true,
          online: true
        }
      }
    }
  };
  response.status(200).json(queryLight);
}

function executeDevices(request, response) {
  const execute = {
    requestId: request.body.requestId,
    payload: {
      commands: []
    }
  };
  response.status(200).json(execute);
}

module.exports = {
  smarthome,
  fakeauth,
  faketoken
}