const app = angular.module("TheGiveawayBoxApp", ["ngRoute","checklist-model"]);

angular.module("TheGiveawayBoxApp").config(function ($routeProvider) {
    /**
     * Configure all Angular application routes here
     */
    $routeProvider.
        when('/auth', {
            templateUrl: 'app/auth/partials/auth.html',
            controller: 'AuthCtrl'
        })
        .when('/add-listing', {
            templateUrl: 'app/addListing/partials/add-listing.html',
            controller: 'AddListingCtrl',
            resolve: { isAuth }
        })
        .when('/users/:userId', {
            templateUrl: 'app/users/partials/profile.html',
            controller: 'UserCtrl',
            resolve: { isAuth }
        })
        .when('/users', {
            templateUrl: 'app/users/partials/users.html',
            controller: 'UserCtrl',
            resolve: { isAuth }
        })
        .when('/admin', {
            templateUrl: 'app/admin/partials/admin.html',
            controller: 'adminCtrl',
            resolve: { isAuth }
        })
        .when('/listings', {
            templateUrl: 'app/listings/partials/listings.html',
            controller: 'ListingsCtrl',
            resolve: { isAuth }
        })
        .when('/create-profile', {
            templateUrl: 'app/users/partials/create-profile.html',
            controller: 'UserCtrl',
            resolve: { isAuth }
        })
        .when('/listings/detail/:listingId', {
            templateUrl: 'app/addListing/partials/add-listing.html',
            controller: 'AddListingCtrl',
            resolve: { isAuth }
        })
        .otherwise('/auth')
})