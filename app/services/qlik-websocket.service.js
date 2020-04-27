define('QlikWebSocketService', function () {
// fresca?
    QlikWebSocketService.$inject = ['$q', '$rootScope'];
    function QlikWebSocketService($q, $rootScope) {
        var Service = this;
        var ofb = false;
        // We return this object to anything injecting our service
        // var Service = {};
        // Keep all pending requests here until they get responses
        var callbacks = {};
        // Create a unique callback ID to map requests to responses
        var currentCallbackId = 0;
        // Qlik requires a random unique string per socket connection, use the app id

        // Create our websocket object with the address to the websocket
        var ws;
        if (window.location.hostname=='localhost') {
            ws = new WebSocket("ws://localhost:4848/app/");
        } else {
            ws = new WebSocket("wss://" + config.host + config.prefix + "app/");
        }

        ws.onopen = function (message) {
            console.log("Socket has been opened!", message);
            ofb = message.isTrusted;
        };

        ws.onmessage = function (message) {
            listener(JSON.parse(message.data));
        };



        function sendRequest(request) {
            var defer = $q.defer();
            var callbackId = getCallbackId();
            callbacks[callbackId] = {
                time: new Date(),
                cb: defer
            };
            request.id = callbackId;
            // console.log('Sending request', request);
            if(ofb){
                ws.send(JSON.stringify(request));
            } else {
                setTimeout(function() {
                    ws.send(JSON.stringify(request));
                }, 300);
            }
            
            return defer.promise;
        }
    
        function listener(data) {
            var messageObj = data;
            //console.log("Received data from websocket: ", messageObj);
            // If an object exists with callback_id in our callbacks object, resolve it
            if (callbacks.hasOwnProperty(messageObj.id)) {
                //console.log(callbacks[messageObj.id]);
                //qlik returns everything important in the .result
                $rootScope.$apply(callbacks[messageObj.id].cb.resolve(messageObj.result));
                delete callbacks[messageObj.callbackID];
            }
        }
        // This creates a new callback ID for a request
        function getCallbackId() {
            currentCallbackId += 1;
            if (currentCallbackId > 10000) {
                currentCallbackId = 0;
            }
            return currentCallbackId;
        }
    
        Service.openDoc = function (qlikAppId) {
            var request = {
                "method": "OpenDoc",
                "handle": -1,
                "params": [qlikAppId, "", "", "", false],
                "delta": false,
                "jsonrpc": "2.0"
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }
    
    
        Service.getFieldData = function (fieldName, limit) {
    
            if (!limit) {
                limit = 500;
            }
    
            var request = {
                "method": "CreateSessionObject",
                "handle": 1,
                "params": [{
                    "qListObjectDef": {
                        "qDef": {
                            "qFieldDefs": [fieldName]
                        },
                        "qInitialDataFetch": [{
                            "qTop": 0,
                            "qLeft": 0,
                            "qHeight": limit,
                            "qWidth": 1
                        }]
                    },
                    "qInfo": {
                        "qType": "mashup"
                    }
                }],
                "delta": false,
                "jsonrpc": "2.0"
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }

        Service.getObject = function(handle, qId){
            var request = {
                "handle": handle,
                "method": "GetObject",
                "params": {
                    "qId": qId
                },
                "jsonrpc": "2.0"
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }
    
        Service.getLayout = function (handleId) {
            var request = {
                "method": "GetLayout",
                "handle": handleId,
                "params": [],
                "delta": true,
                "jsonrpc": "2.0",
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }
    
        Service.searchListObjectFor = function (handleId, searchString) {
            var request = {
                "jsonrpc": "2.0",
                "method": "SearchListObjectFor",
                "handle": handleId,
                "params": [
                  "/qListObjectDef",
                  searchString
                    ]
              }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }

        Service.abortListObjectSearch = function (handleId) {
            var request = {
                "jsonrpc": "2.0",
                "delta": true,
                "method": "AbortListObjectSearch",
                "handle": handleId,
                "params": [
                  "/qListObjectDef",
                    ]
              }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }


        Service.createSessionObject = function() {
            var request = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "CreateSessionObject",
                "handle": 1,
                "params": [
                  {
                    "qInfo": {
                      "qId": "",
                      "qType": "SessionLists"
                    },
                    "qSelectionObjectDef": {}
                  }
                ]
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }

        Service.evaluateMeasure = function(expression) {
            var request = {
                "handle": 1,
                "method": "Evaluate",
                "params": {
                    "qExpression": expression
                }
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        } 

        Service.getAuthenticatedUser = function() {
            var request = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "GetAuthenticatedUser",
                "handle": -1,
                "params": []
            }
            // Storing in a variable for clarity on what sendRequest returns
            var promise = sendRequest(request);
            return promise;
        }
    }

    return QlikWebSocketService;
})