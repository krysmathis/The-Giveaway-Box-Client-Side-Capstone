"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingsCtrl", function($scope, $uibModal, $log, $document, $timeout, $http, ngToast, $location, FilterFactory, GroupsFactory, ListingsFactory, AuthFactory, AddListingFactory, MasterDataFactory) {
    
    $scope.listings = []

    const f = ListingsFactory
    const masterData = MasterDataFactory

    let navContainer = document.querySelectorAll('.nav-hidden')
    
    $scope.isNew = (item) => moment().diff(moment(item.timestamp), "days") < 2
    
    //purchase button
    $scope.purchase = (e) => {
        console.log("making purchase")
        const user = AuthFactory.getUser()
        ngToast.create('You got it!');
        ListingsFactory.purchase(e.target.id, user)
    }
    
    // go ahead and store the master data once it's been updated
    let database = {
        categories: [],
        subCategories: [],
        attributes: [],
    }

    
    // check if user has a profile set up already or not
    // if not redirect them to the profile set-up
    $scope.init = () => {

        // clear the search bar
        document.querySelector(".filter__search-input").value = null
        $scope.filterSearchString = ""
        $scope.filter.keywords = []
        $scope.filter.category = 0

            if (masterData.isReady()) {
                database = masterData.database
                $scope.getListings(database)
                $scope.categories = database.categories
                $scope.selectedSubCategory = {}
                $scope.selectedCategory = {}
            } else {
                masterData.init().then(d => {
                    database = masterData.database
                    $scope.categories = database.categories
                    $scope.selectedCategory = {}
                    $scope.selectedSubCategory = {}
                    $scope.getListings(database)
                })                  
            }
        
            console.log("listings: ", ListingsFactory.listings)
    } 

    $scope.resetDropDown = () => {
        $scope.selectedCategory = $scope.categories[0]
        $scope.filter.category = 0
    }
    /**
     * Get the listings
     * DECISION: Might be better to let this process get the full list
     * And use the filter parameters to drive if it limits to just the 
     * listings from users in the selected groups
     * @param {*} database 
     */
    const progressInd = document.querySelector(".progress-circle.indefinite")
    
    $scope.getListings = (database) => {
        const user = AuthFactory.getUser()
        if (user) {
            ListingsFactory.getApprovedUsers(user).then(users=> {
                f.getListings(database).then(r=>{
                    $scope.listings = r
                    if (progressInd) {progressInd.style.display="none"}
                    $scope.unhideNav()
                    //navContainer.removeClass("hide")
                    document.querySelector(".progress-circle.indefinite").style.display="none"
                })
            })
        } else {
            f.getListings(database).then(r=>{
                $scope.listings = r
                if (progressInd) {progressInd.style.display="none"}
                $scope.unhideNav()
                //navContainer.removeClass("hide")
            })
        }
        
    }
    
    // unhide the nav elements so they are available once the data is loaded
    $scope.unhideNav = () => {
        Array.from(navContainer).forEach(el => angular.element(el).removeClass("nav-hidden"))
    }

    /**
     * FILTER
     */
    $scope.filter = {
        keywords: [],
        category: 0
    }

    if (GroupsFactory.userGroups.length === 0) {
        GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r =>{
            $scope.filterGroups = r
            $scope.inviteGroups = angular.copy($scope.filterGroups);
        })
    } else {
        $scope.filterGroups = GroupsFactory.userGroups
        $scope.inviteGroups = angular.copy($scope.filterGroups);
    }


    $scope.filterSearchString = ""
    $scope.filterListings = () => {
        $scope.listings = ListingsFactory.listings
        $scope.listings = FilterFactory.getfilteredListings($scope.listings,$scope.filter)
    }

    $scope.finder = (e) => {
        if (e.key === "Enter"){
            if ($scope.filterSearchString.length > 0){
                $scope.filter.keywords = $scope.filterSearchString.split(" ")
                $scope.listings = FilterFactory.getfilteredListings($scope.listings,$scope.filter)
            }
        }
    }

    // filter listings based on the selected groups
    $scope.filterListingsBasedOnGroups = () => {
        // reset the listings first
        $scope.listings = ListingsFactory.listings
        
        // update approved users
        ListingsFactory.updateApprovedUsers($scope.inviteGroups)
        const users = ListingsFactory.approvedUsers
        $scope.listings = FilterFactory.usersInGroups(users, $scope.listings,$scope.filter)

    }

    /**
     * MAP
     */
    $scope.mapDisplayed = false

    
    $scope.initializeMap = () => {
        
        
        // if the map is already open then don't initilize it again
        if (!document.getElementById("map-dropdown")) {
            return
        }
        
        $scope.centerMap = {lat: 36.1689027, lng: -86.73954520000001};
        $scope.mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(36.1689027, -86.73954520000001),
            disableDefaultUI: true
        }
        // Create an array of alphabetical characters used to label the markers.
        let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $timeout(() => {
            $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions)
            
           

            let locations = $scope.filteredListings.filter(li=> li.requestedDate===0).map(l=> {
                return {lat: l.user.lat, lng: l.user.long}
            })
                // $scope.marker = new google.maps.Marker({
                // position: $scope.centerMap,
                // map: $scope.map

                // Add some markers to the map.
            // Note: The code uses the JavaScript Array.prototype.map() method to
            // create an array of markers based on a given "locations" array.
            // The map() method here has nothing to do with the Google Maps API.
            let markers = locations.map(function(location, i) {
                return new google.maps.Marker({
                    position: location,
                    label: labels[i % labels.length]
                });
            });

            var markerCluster = new MarkerClusterer($scope.map, markers,
                {imagePath: "../../../images/markers/m"});

        },200)

        
    } 
  
    $scope.onClick = function onClick() {
        console.log("click");}
    
    
    $scope.checkMapBounds = () => {
        const bounds = $scope.map.getBounds()
        $scope.listings = FilterFactory.usersWithinBounds(bounds, ListingsFactory.listings)
        // create a simple toast:
        //ngToast.create('a toast message...');
    }



    /**
     * View Model for Categories
     */
    $scope.categories = database.categories.map(cat => {
        return {
            value: cat.externalId,
            label: cat.label,
            isSelected: false
        }
    })

    $scope.selectedCategory = {}
    $scope.selectedSubCategory = {}
    $scope.subCategories = []

    /**
     * View model for subcategories
     */
    $scope.getSubCategories = function() {
        $scope.filter.categoryExternalId = parseInt($scope.selectedCategory)
        $scope.filter.category = $scope.selectedCategory.label
        $scope.filterListings()
        const category = $scope.filter.categoryExternalId
        const filteredSubCategories = database.subCategories.filter(s=> s.categoryExtId === parseInt(category))
        $scope.subCategories = filteredSubCategories.map(cat => {
            return {
                value: cat.externalId,
                label: cat.label,
                isSelected: false,
            }
        })
    }

    /**
     * MODAL - controller for the modals
     * from: https://angular-ui.github.io/bootstrap/   
     */
    
    var $ctrl = this;
    $ctrl.items = ['item1', 'item2', 'item3'];
  
    $ctrl.animationsEnabled = true;
  
    $scope.open = function (size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          items: function () {
            return $ctrl.items;
          }
        }
      });
  
      modalInstance.result.then(function (selectedItem) {
        $ctrl.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  
    $ctrl.openComponentModal = function () {
      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        component: 'modalComponent',
        resolve: {
          items: function () {
            return $ctrl.items;
          }
        }
      });
  
      modalInstance.result.then(function (selectedItem) {
        $ctrl.selected = selectedItem;
      }, function () {
        $log.info('modal-component dismissed at: ' + new Date());
      });
    };
  
    $ctrl.openMultipleModals = function () {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'stackedModal.html',
        size: 'sm',
        controller: function($scope) {
          $scope.name = 'bottom';  
        }
      });
  
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-top',
        ariaDescribedBy: 'modal-body-top',
        templateUrl: 'stackedModal.html',
        size: 'sm',
        controller: function($scope) {
          $scope.name = 'top';  
        }
      });
    };
  
    $ctrl.toggleAnimation = function () {
      $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
    };

})

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module("TheGiveawayBoxApp").controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
      item: $ctrl.items[0]
    };
  
    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.selected.item);
    };
  
    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
  
  // Please note that the close and dismiss bindings are from $uibModalInstance.
  
  angular.module("TheGiveawayBoxApp").component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var $ctrl = this;
  
      $ctrl.$onInit = function () {
        $ctrl.items = $ctrl.resolve.items;
        $ctrl.selected = {
          item: $ctrl.items[0]
        };
      };
  
      $ctrl.ok = function () {
        $ctrl.close({$value: $ctrl.selected.item});
      };
  
      $ctrl.cancel = function () {
        $ctrl.dismiss({$value: 'cancel'});
      };
    }
});