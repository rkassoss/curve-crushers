(function () {
    'use strict';

    define('kpiCard',function(){
        function kpiCard() {
            kpiCardController.$inject = ['qlikService'];
            function kpiCardController(qlikService){
                var vm = this;
                var kpiObject, chartObject, sessId;

                function getObjects() {
                    qlikService.getApp().visualization.get(vm.qlikId).then(function(kpi){
                        vm.loaderUp = false;
                        kpiObject = kpi;
                        vm.mainModel = {
                            title: kpi.model.layout.title,
                            sub: kpi.model.layout.subtitle,
                            footer: kpi.model.layout.footnote,
                            label: kpi.model.layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
                            value: kpi.model.layout.qHyperCube.qDataPages[0].qMatrix[0][0].qText
                        }

                        if (kpi.model.layout.qHyperCube.qMeasureInfo.length == 2) {
                            vm.secModel = {
                                label: kpi.model.layout.qHyperCube.qMeasureInfo[1].qFallbackTitle,
                                value: kpi.model.layout.qHyperCube.qDataPages[0].qMatrix[0][1].qText
                            }
                        } else {
                            vm.secModel = false;
                        }
                    });
                }

                vm.$onInit = function() {
                    vm.loaderUp = true;
                    getObjects();
                    qlikService.getApp().getList("CurrentSelections",function(reply) {
                        sessId = reply.qInfo.qId;
                        getObjects();
                    });
                }

                vm.$onDestroy = function() {
                    if (chartObject) kpiObject.close();
                    if (sessId) qlikService.getApp().destroySessionObject(sessId);
                }
            }
    
            return {
                bindings: {
                    qlikId: '@',
                    styleAtt: '@',
                    hideLabel: '<'
                },
                controller: kpiCardController,
                controllerAs: 'kc',
                templateUrl: './app/components/kpiCard/kpiCard.component.html'
            }
        }

        return kpiCard();
    });


    

} ());