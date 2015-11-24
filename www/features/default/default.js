angular.module('app.features.default', [])

.config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('default', {
            url: '/default',
            templateUrl: 'features/default/default.tpl.html',
            controller: 'DefaultCtrl as default'
        });
})

.controller('DefaultCtrl', function () {
    var vm = this;

    vm.title = 'Default Page';
    vm.message = 'This is default page';
})
