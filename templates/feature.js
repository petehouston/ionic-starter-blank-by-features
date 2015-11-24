angular.module('${module}', [])

.config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('${state}', {
            url: '/${state}',
            templateUrl: 'features/${feature}/${feature}.tpl.html',
            controller: '${controller}'
        });
})

.controller('${controller}', function ($scope) {
    $scope.title = '${title}';
})
