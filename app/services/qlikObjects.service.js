define('qlikObjects', function () {

    qlikObjects.$inject = ['qlikService','$q'];
    function qlikObjects(qlikService, $q) {
        var service = this;
        /**
     * breaks down an array of Qlik Object Ids into a batch and throttles
     * how many objects we get at a time.  Sometimes Qlik engines has trouble
     * handling so many object requests at a time.  This solves it.
     * @param {*} currObject 
     * @param {*} batchSize 
     */

    service.getQlikObjectsByBatch = function (currObject, batchSize, noSelectionList, deferred) {

        if (!batchSize) {
          batchSize = 4;
        }
  
        if (!deferred) {
          deferred = $q.defer();
        }
  
        var objectsToPass = currObject.splice(batchSize)
        var promises = [];
  
        currObject.forEach(function (obj) {
  
          //todo - refactor this
          if (noSelectionList) {
            if (_.contains(noSelectionList, obj)) {
              promises.push(qlikService.getApp().getObject(obj, obj, {noSelections: true}).then(function (model) {
                destroyableObjects.push(model);
              }));
            } else {
              promises.push(qlikService.getApp().getObject(obj, obj).then(function (model) {
                destroyableObjects.push(model);
              }));
            }
          } else {
            promises.push(qlikService.getApp().getObject(obj, obj).then(function (model) {
              destroyableObjects.push(model);
            }));
          }
  
        });
  
        $q.all(promises).then(function (a) {
          if (currObject.length > 0) {
            service.getQlikObjectsByBatch(objectsToPass, batchSize, noSelectionList, deferred);
          } else {
            deferred.resolve(true);
          }
        });
  
        return deferred.promise;
      };
        
    }

    return qlikObjects;
})