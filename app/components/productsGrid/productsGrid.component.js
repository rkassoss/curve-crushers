(function () {
    'use strict';

    define('productsGrid', function(){


        function productsGrid() {
            productsGridController.$inject = ['qlikService','$uibModal'];
            function productsGridController(qlikService, $uibModal){
                var vm = this;
                var previousIndex;
                vm.activeProduct = null;

                // once reportlinks table is loaded to the app, create a hypercube
                vm.reportLinks = null;
                vm.rootPath = rootPath;
                
                vm.expand = function(qlikId){
                    // console.log(qlikId);
                    var modalInstance = $uibModal.open({
                        animation: true,
                        component: 'expandModal',
                        size: 'lg',
                        resolve: {
                            qlikId: function () {
                                return qlikId;
                            }
                        }
                    });
                }

                vm.handleObjects = function(productIndex) {
                    // console.log(vm.activeProduct, productIndex, vm.hiddenObjects);
                    vm.hiddenObjects = vm.products[productIndex].hiddenKpis.concat(vm.products[productIndex].hiddenCharts);
                    if(destroyableObjects.length){ // first, destroy previously shown objects
                        _.each(destroyableObjects, function(model){
                            // console.log('destorying object', model);
                            model.close();
                        });
                        destroyableObjects = [];
                    } 
                    _.each(vm.hiddenObjects, function(a){ // manually show hidden objects so we could store models for destroyableObjects array
                        qlikService.getApp()
                        .visualization.get(a).then(function(vis){
                            // console.log('getting object', vis);
                            destroyableObjects.push(vis);
                            vis.show(a, {noSelections: true});
                        });
                    });
                }

                vm.$onInit = function () {

                }

                vm.$onDestroy = function() {
                  
                }
            }

            return {
                bindings: {
                    products: "="
                },
                controller: productsGridController,
                controllerAs: 'pg',
                templateUrl: './app/components/productsGrid/productsGrid.component.html'
            }
        }
        return productsGrid();
    });

} ());