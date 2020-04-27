(function () {
    'use strict';

    define('filterDropdown',function() {
        
        function filterDropdown() {
                filterDropdownController.$inject = ["qlikService","filterDropdownService","QlikWebSocketService"];
                function filterDropdownController(qlikService, filterDropdownService, QlikWebSocketService){
                    var vm = this;
                    var objectId;

                    if (!vm.fieldLabel) {
                        vm.fieldLabel = vm.fieldName;
                    }

                    vm.filterDropdownService = filterDropdownService;
                    vm.fetchValues = fetchValues;
                    vm.applySelection = applySelection;
                    vm.applySingleSelection = applySingleSelection;

                    vm.searchWithWildCard = function () {
                        // console.log('in', vm.searchString);
                            QlikWebSocketService.openDoc(appId).then(function(connection) {
                                var handleId = "";
                                var objectId = "";
                                QlikWebSocketService.getFieldData(vm.fieldName)
                                        .then(function (fieldResult) {
                                            if (fieldResult) {
                                                handleId = fieldResult.qReturn.qHandle;
                                                objectId = fieldResult.qReturn.qGenericId;
                                                return QlikWebSocketService.searchListObjectFor(handleId, vm.searchString);
                                            }
                                        })
                                        .then(function (searchResult) {
                                            if (searchResult) {
                                                return QlikWebSocketService.getLayout(handleId);
                                            }
                                        })
                                        .then(function (layoutResult) {
                                            // console.log(layoutResult)
                                            if (layoutResult) {
                                                var mapItem = layoutResult.qLayout["0"].value.qListObject.qDataPages["0"].qMatrix;
                                                // // console.log(mapItem);
                                                vm.rows = _.flatten(mapItem);
                                            }
                                            //now we can destroy our original list
                                            qlikService.getApp().destroySessionObject(objectId);
                                        });
                                });
                    };

                    vm.clearSearch = function () {
                        vm.searchString = '';
                        QlikWebSocketService.openDoc(appId).then(function(connection) {
                            var handleId = "";
                            var objectId = "";
                            QlikWebSocketService.getFieldData(vm.fieldName)
                                    .then(function (fieldResult) {
                                        if (fieldResult) {
                                            handleId = fieldResult.qReturn.qHandle;
                                            objectId = fieldResult.qReturn.qGenericId;
                                            return QlikWebSocketService.abortListObjectSearch(handleId);
                                        }
                                    })
                                    .then(function (searchResult) {
                                        if (searchResult) {
                                            return QlikWebSocketService.getLayout(handleId);
                                        }
                                    })
                                    .then(function (layoutResult) {
                                        // console.log(layoutResult)
                                        if (layoutResult) {
                                            var mapItem = layoutResult.qLayout["0"].value.qListObject.qDataPages["0"].qMatrix;
                                            // // console.log(mapItem);
                                            vm.rows = _.flatten(mapItem);
                                        }
                                        //now we can destroy our original list
                                        qlikService.getApp().destroySessionObject(objectId);
                                    });
                            });
                    }

                    vm.clearField = function () {
                        filterDropdownService.closeAllFilters();
                        vm.fieldObject.clear();
                    }

                    function applySelection(value) {
                        console.log(value);
                        vm.fieldObject.selectValues([value],true,true);
                    }
                    
                    function applySingleSelection(value) { // present=> single selection
                        // console.log(value);
                        vm.fieldObject.selectMatch(value);
                    }

                    function fetchValues() {
                        // // console.log(vm.fieldName);
                        qlikService.getApp().createList({
                            "qDef": {
                                "qFieldDefs": [vm.fieldName],
                                "qSortCriterias": [{
                                    "qSortByLoadOrder"  : 0,
                                    "qSortByAscii" : 1
                                }]
                            },
                            "qAutoSortByState": {
                                qDisplayNumberOfRows: 1
                            },
                            "qInitialDataFetch": [{
                                qTop : 0,
                                qLeft : 0,
                                qHeight : 50,
                                qWidth : 1
                            }]
                        }, function(reply) {
                            // console.log(vm.fieldName, reply);
                            objectId = reply.qInfo.qId;
                            vm.rows = _.flatten(reply.qListObject.qDataPages[0].qMatrix);
                            vm.fieldType = reply.qListObject.qDimensionInfo.qDimensionType;
                            vm.selections = reply.qSelectionInfo;
                            if(checkifHas(vm.rows, 'S')){
                                vm.hasSelection = true;
                            } else{
                                vm.hasSelection = false;
                            }
                        });
                    }

                    vm.myMethod = function ($event, $ui, $selected, $list) {
                        // console.log($event, $ui, $selected, $list);
                        var array = [];
                        if (vm.fieldType == 'N') {
                            array = $selected.map(function(val){
                                return val.qNum
                            })
                        } else {
                            array = $selected.map(function(val){
                                return val.qText
                            })
                        }
                        console.log(array);
                        vm.fieldObject.selectValues(array,true,true);

                    }

                    function checkifHas(arr, val) {
                        return arr.some(function(arrVal) {
                            return val === arrVal;
                        });
                    }

                    

                    vm.$onInit = function() {
                        vm.fieldObject = qlikService.getApp().field(vm.fieldName);
                        fetchValues();
                    }


                    vm.$onDestroy = function() {
                        // console.log('destroy list'+ objectId);
                        qlikService.getApp().destroySessionObject(objectId);
                    }


                    vm.$onChanges = function(changes) {
                        
                    }
                }
        
                return {
                    bindings: {
                        fieldName: '@',
                        fieldLabel: '@'
                    },
                    controller: filterDropdownController,
                    controllerAs: 'fd',
                    templateUrl: './app/components/filterDropdown/filterDropdown.component.html'
                }
        }

        return filterDropdown();
    });

} ());