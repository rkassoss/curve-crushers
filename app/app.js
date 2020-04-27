var qlikObject;
var destroyableObjects = [];
var appId;
var config;

var appIdList = {
    'localhost': 'Curve Crushers COVID-19.qvf'
};

var configList = {
    'localhost': { // local dev webserver with dev qs server
        host: 'localhost',
        prefix: '/',
        port: 4848,
        isSecure: false
    }
};

appId = appIdList[window.location.hostname];
config = configList[window.location.hostname];
var base = window.location.protocol+ "//" + window.location.host + window.location.pathname;
var rootPath = base.substr( 0, base.lastIndexOf( "/" ) );

require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    paths: {
        'ui.router': rootPath + '/bower_components/angular-ui-router/release/angular-ui-router',
        'uibootstrap': rootPath + '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'duscroll': rootPath + '/bower_components/angular-scroll/angular-scroll.min',
        'ngSelectable': rootPath + '/bower_components/ngSelectable/src/ngSelectable'
        // 'uibootstrap': 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min',
    },
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    }
});

// bootstrap the app
require(["js/qlik"], function (qlik) {
    var errors = [];
    qlik.on("error", function(error){
		//error handling
		console.log('Qlik error', error);
		errors.push(error); 
		if(error.code === 16 || ["OnSessionTimedOut","OnSessionClosed"].indexOf(error.method)>-1){ 
            document.getElementById('errorModal').style.display = 'block';
            $('#errorModal').modal('show')
		}
	});
    require(["angular", 'ui.router', 'uibootstrap', 'duscroll','ngSelectable', "routes",

            'home',
           
            'topHeader', 'productsGrid',

            'chartCard', 'expandModal', 'kpiCard', 'multiChart', 'filterDropdown', 'qlikVar',

            'dataService', 'qlikService', 'currentSelectionsService', 'filterDropdownService', 'QlikWebSocketService'
    ],
        function (angular, uiRoute, uibootstrap, duscroll,ngSelectable, routes,

            home,

            topHeader, productsGrid,
            
            chartCard, expandModal, kpiCard, multiChart, filterDropdown, qlikVar,
            
            dataService, qlikService,currentSelectionsService, filterDropdownService, QlikWebSocketService ) {
            app = angular.module('mashup-app', [
                'ui.router',
                'ui.bootstrap',
                'duScroll',
                'ngSelectable'
            ]).config(['$compileProvider',
            function( $compileProvider ) {   
              $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
              $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:application\//);
              $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|cust-scheme):/);
              $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
              $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            }
            ])
            .value('duScrollDuration', 2000)
            .value('duScrollOffset', 270)
            .value('duScrollBottomSpy', true);

            app.config(routes);
            app.component('home',home);
  
            app.component('topHeader',topHeader);
            app.component('productsGrid',productsGrid);

            app.component('kpiCard', kpiCard);
            app.component('chartCard',chartCard);
            app.component('expandModal',expandModal);
            app.component('multiChart', multiChart);
            app.component('filterDropdown', filterDropdown);
            app.component('qlikVar', qlikVar);

            app.service('dataService', dataService);
            app.service('qlikService', qlikService);
            app.service('currentSelectionsService',currentSelectionsService);
            app.service('filterDropdownService',filterDropdownService);
            app.service('QlikWebSocketService', QlikWebSocketService);

            // Replace broken images when you load images from dynamic URL (productsGrid component)
            app.directive('onError', function() {  
                return {
                  restrict:'A',
                  link: function(scope, element, attr) {
                    element.on('error', function() {
                      element.attr('src', attr.onError);
                    })
                  }
                }
            });

            app.filter( 'autoNumber', function() {
                return function( number ) {
                    if ( number ) {
                        abs = Math.abs( number );
                        if ( abs >= Math.pow( 10, 12 ) ) {
                            // trillion
                            number = ( number / Math.pow( 10, 12 ) ).toFixed( 1 ) + "T";
                        } else if ( abs < Math.pow( 10, 12 ) && abs >= Math.pow( 10, 9 ) ) {
                            // billion
                            number = ( number / Math.pow( 10, 9 ) ).toFixed( 1 ) + "B";
                        } else if ( abs < Math.pow( 10, 9 ) && abs >= Math.pow( 10, 6 ) ) {
                            // million
                            number = ( number / Math.pow( 10, 6 ) ).toFixed( 1 ) + "M";
                        } else if ( abs < Math.pow( 10, 6 ) && abs >= Math.pow( 10, 3 ) ) {
                            // thousand
                            number = ( number / Math.pow( 10, 3 ) ).toFixed( 1 ) + "K";
                        }
                        return number;
                    }
                };
            } );

            app.run(['qlikService', function (qlikService) {
                qlikService.openApp(qlik, appId, config);
                qlikObject = qlik;
            }]);
            angular.bootstrap(document, ["qlik-angular", "mashup-app"]);
        }
    )
});