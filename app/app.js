const app = angular.module("TheGiveawayBoxApp", ["ngRoute","checklist-model","ngAnimate","hl.sticky","ngToast","moment-picker","ui.bootstrap"]);

// Setup the filter
app.filter('categoryMatch', function() {
    
      // Create the return function and set the required parameter name to **input**
      return function(input, searchString) {
    
        const out = [];
    
        // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
        angular.forEach(input, function(listing) {
    
        //   if (listing.category.label.toLowerCase().includes(searchString.toLowerCase()) ||
        // listing.subCategory.label.toLowerCase().includes(searchString.toLowerCase())) {
        //     out.push(listing)
        //   }
            out.push(listing)
    
        })
    
        return out;
      }
    
    });


app.directive('customOnChange', function() {
    return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        var onChangeFunc = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeFunc);
    }
    };
});

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
            controller: 'ProfileCtrl',
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
            controller: 'ProfileCtrl',
            resolve: { isAuth }
        })
        .when('/listings/detail/:listingId', {
            templateUrl: 'app/addListing/partials/add-listing.html',
            controller: 'AddListingCtrl',
            resolve: { isAuth }
        })
        .otherwise('/auth')
})