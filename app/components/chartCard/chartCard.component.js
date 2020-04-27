(function () {
    'use strict';


        define( 'chartCard',function () {
            
            function chartCard() {
                chartCardController.$inject = ['dataService','qlikService','$uibModal'];
                function chartCardController(dataService,qlikService,$uibModal) {
                    var vm = this;
                    var theObject;

                    vm.exportToExcel = exportToExcel;
                    vm.expand = expand;
       
                    function exportToExcel() {
                        vm.model.exportData()
                            .then(function(reply){
                                // console.log(reply);
                                var baseUrl = (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "");
                                var link = reply.qUrl;
                                window.open(baseUrl+link,'_blank');
                            });
                    }

                    function expand() {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            component: 'expandModal',
                            size: 'lg',
                            resolve: {
                                qlikId: function () {
                                    return vm.qlikId;
                                }
                            }
                        });
                    }

                    function getQlikObject() {
                        qlikService.getApp()
                        .visualization.get(vm.qlikId).then(function(vis){
                            // console.log('chart',vis);
                            vis.show(vm.qlikId);
                            theObject = vis;
                            vm.model = vis.model;
                            vis.model.layout.showTitles = false;
                            vm.title = vis.model.layout.title;
                            vm.sub = vis.model.layout.subtitle;
                            vm.footer = vis.model.layout.footnote;
                            vis.model.Validated.bind(function(){
                                // console.log('chart',vis);
                                vis.model.layout.showTitles = false;
                                vm.title = vis.model.layout.title;
                                vm.sub = vis.model.layout.subtitle;
                                vm.footer = vis.model.layout.footnote;
                            });
                        });
                    }

                    vm.$onInit = function() {
                        getQlikObject();
                    }


                    vm.$onDestroy = function() {
                        // console.log('destroy');
                        if(theObject) theObject.close();
                    }


                    vm.$onChanges = function(changes) {
                        
                    }

                }
                return {
                    bindings: {
                        qlikId: '@',
                        changeTitle: '@',
                        removeHeader: '<',
                        objectClass: '@',
                        qExpand: '<',
                        styleAtt: '@'
                    },
                    controller: chartCardController,
                    controllerAs: 'cc',
                    templateUrl: './app/components/chartCard/chartCard.component.html'
                }
            }

            return chartCard();
        });
} ());