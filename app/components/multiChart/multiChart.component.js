(function () {
  'use strict';

  define('multiChart', function(){
      function multiChart() {
          multiChartController.$inject = ['qlikService'];
          function multiChartController(qlikService){
              var vm = this;
              vm.tabSelected = tabSelected;

              function tabSelected() {
                console.log('tab selected');
                qlikObject.resize();
              }
              
              vm.$onInit = function() {
                vm.loaderUp = true;
              }

              vm.$onDestroy = function() {
              }
          }

          return {
              bindings: {
                objects: '='
              },
              controller: multiChartController,
              controllerAs: 'mc',
              templateUrl: './app/components/multiChart/mutliChart.component.html'
          }
      }

      return multiChart();

  });

} ());