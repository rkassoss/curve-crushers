define( 'dataService',function () {
     
    
        dataRetrieval.$inject = ['$http','qlikService'];
        function dataRetrieval($http, qlikService) {
            var service = this;
           

            var url = rootPath + '/assets/app-data/';
            var theraputicAreas = url.concat('theraputic-areas.json');
            var astellasHome = url.concat('astellas-home.json');

            service.getTheraputicAreas = getTheraputicAreas;
            service.getHomeViews = getHomeViews;
    
            function getTheraputicAreas() {
                var promise = $http.get(theraputicAreas);
                return promise;
            }

            function getHomeViews() {
                var promise = $http.get(astellasHome);
                return promise;
            }
        }

        return dataRetrieval;
})
 