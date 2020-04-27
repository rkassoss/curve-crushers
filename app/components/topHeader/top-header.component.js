define( 'topHeader',function () {
    
    function topHeader() {
        topHeaderController.$inject = ['$state','qlikService','$transitions'];
        function topHeaderController($state,qlikService, $transitions) {
            var vm = this;

            vm.toggleSidebar = toggleSidebar;
            vm.sidebarIn = true;

            vm.stateName = $state.current.name;

            vm.pageTitle = "Astellas Pharma US";
            $transitions.onSuccess({}, function(transition) {
                vm.pageTitle = transition.to().title;
                console.log(
                    "Successful Transition from " + transition.from().title +
                    " to " + transition.to().title
                );
            });

            function toggleSidebar() {
                vm.sidebarIn = !vm.sidebarIn;
                $('#viewWrap').toggleClass('move');
                qlikObject.resize();
            }

            vm.$onInit = function() {
                qlikService.getApp().getAppLayout(function(layout){
                    // console.log(layout);
                    vm.relaodTime = layout.qLastReloadTime;
                    vm.appTitle = layout.qTitle;
                });
                qlikService.getApp()
                .getObject('CurrentSelections', 'CurrentSelections');
            }


            vm.$onDestroy = function() {
            }


            vm.$onChanges = function(changes) {
                
            }
        }
        return {
            bindings: {},
            controller: topHeaderController,
            controllerAs: 'th',
            templateUrl: 'app/components/topHeader/topHeader.component.html'
        }
    }

    return topHeader();
});