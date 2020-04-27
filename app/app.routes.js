define('routes',function(){
    function routeConfig($locationProvider, $stateProvider, $urlRouterProvider){   
        $urlRouterProvider.otherwise('/');
        $locationProvider.hashPrefix(''); 
        $stateProvider
        .state('home', {
            url: '/',
            template: '<home></home>',
            title: 'Curve Crushers'
        })
    }
    routeConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
    return routeConfig;
});