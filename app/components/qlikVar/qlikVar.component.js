(function () {
    'use strict';

    define('qlikVar',function() {
        
        function qlikVar() {
                qlikVarController.$inject = ["qlikService", "$scope"];
                function qlikVarController(qlikService, $scope){
                    var vm = this;
                    var objectId;

                    vm.varType = 'String';
                    
                    vm.varModel;

                    vm.getVar = getVar;
                    function getVar(){
                        qlikService.getApp()
                            .variable.getContent(vm.qlikVar).then(function(reply){
                                console.log(reply)
                                vm.isNum = reply.qContent.qIsNum;
                                if (vm.isNum){
                                    vm.varModel = Number(reply.qContent.qString)
                                } else {
                                    vm.varModel = reply.qContent.qString;
                                }
                            });
                    }

                    vm.updateVar = updateVar;
                    function updateVar() {
                        console.log('set var', vm.qlikVar, vm.varModel);
                        if(vm.varModel){
                            $scope.varUpdated = {
                                name: vm.qlikVar,
                                value: vm.varModel
                            }
                            if (vm.isNum) {
                                qlikService.getApp()
                                .variable.setNumValue(vm.qlikVar, Number(vm.varModel)).then(function(reply){
                                    console.log(reply)
                                    // emit will send data 'up' to the view controller
                                    $scope.$emit('varUpdated', $scope.varUpdated);
                                    //broadcast to rootScope will send data to a sibling such as a kpi object
                                    $rootScope.$broadcast('varUpdated', $scope.varUpdated);
                                });
                            } else {
                                qlikService.getApp()
                                .variable.setStringValue(vm.qlikVar, vm.varModel).then(function(reply){
                                    console.log(reply)
                                    // emit will send data 'up' to the view controller
                                    $scope.$emit('varUpdated', $scope.varUpdated);
                                    //broadcast to rootScope will send data to a sibling such as a kpi object
                                    $rootScope.$broadcast('varUpdated', $scope.varUpdated);
                                });
                            }
                            
                        }
                    };

                    

                    vm.$onInit = function() {
                        getVar();
                    }


                    vm.$onDestroy = function() {
                    }


                    vm.$onChanges = function(changes) {
                    }
                }
        
                return {
                    bindings: {
                        qlikVar: '@',
                        varLabel: '@',
                        varOptions: '=',
                        varType: '@',
                        varUi: '@',
                        varPlaceholder: '@',
                        required: '<'
                    },
                    controller: qlikVarController,
                    controllerAs: 'qv',
                    templateUrl: './app/components/qlikVar/qlikVar.component.html'
                }
        }

        return qlikVar();
    });

} ());