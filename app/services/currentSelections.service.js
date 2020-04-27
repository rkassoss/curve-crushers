define('currentSelectionsService', function () {

    currentSelectionsService.$inject = ['qlikService','$q'];
    function currentSelectionsService(qlikService,$q) {

        var service = this;

        service.getCurrentSelections = getCurrentSelections;
        service.clearSelection = clearSelection;
        service.clearAll = clearAll;

        function getCurrentSelections() {
            var _numberOfSelections, _selections;
                var promise = qlikService.getApp().getList("CurrentSelections",function(reply) {
                    console.log(reply);
                    _selections = reply.qSelectionObject.qSelections;
                    service.selections = _selections;
                    service.assetName = false;
                    _numberOfSelections = _selections.length;
                    service.numberOfSelections = _numberOfSelections;
                    // console.log(_numberOfSelections);
                });
                return promise;
        }

        function clearSelection(qField) {
            // console.log(qField);
            qlikService.getApp().field(qField).clear();
            service.currentSelection = "";
        }
        
        function clearAll(state) {
            qlikService.getApp().clearAll(state);
        }


    }

    return currentSelectionsService;
});