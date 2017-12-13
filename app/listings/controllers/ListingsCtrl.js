"use strict"

angular.module("TheGiveawayBoxApp")
.controller("ListingsCtrl", function($scope, $http, $location, FilterFactory, GroupsFactory, ListingsFactory, AuthFactory, AddListingFactory, MasterDataFactory) {
    
    $scope.listings = []

    const f = ListingsFactory
    const masterData = MasterDataFactory

    // $scope.test = () => {
    //     //ListingsFactory.makeEbaySearch("strollers")
    //     //ListingsFactory.makeAmazonSearch("stroller")  
    // }

    //purchase button
    $scope.purchase = (e) => {
        console.log("making purchase")
        const user = AuthFactory.getUser()
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
            if (masterData.categories.length > 0) {
                database = masterData.database
                $scope.getListings(database)
                $scope.categories = database.categories
                $scope.selectedSubCategory = {}
                $scope.selectedCategory = {}
            } else {
                masterData.init().then(d => {
                    database = masterData.database
                    $scope.getListings(database)
                    $scope.categories = database.categories
                    $scope.selectedCategory = {}
                    $scope.selectedSubCategory = {}
                })                  
            }
            console.log("listings: ", ListingsFactory.listings)
    } 

    $scope.resetDropDown = () => {
        $scope.selectedCategory = $scope.categories[0]
    }
    /**
     * Get the listings
     * DECISION: Might be better to let this process get the full list
     * And use the filter parameters to drive if it limits to just the 
     * listings from users in the selected groups
     * @param {*} database 
     */
    $scope.getListings = (database) => {
        const user = AuthFactory.getUser()
        if (user) {
            ListingsFactory.getApprovedUsers(user).then(users=> {
                f.getListings(database).then(r=>{
                    $scope.listings = r
                    document.querySelector(".progress-circle.indefinite").style.display="none"
                })
            })
        } else {
            f.getListings(database).then(r=>{
                $scope.listings = r
                document.querySelector(".progress-circle.indefinite").style.display="none"
            })
        }
        
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
        $scope.listings = FilterFactory.usersInGroups(users, $scope.listings)

    }

    /**
     * MAP
     */
    $scope.centerMap = {lat: 36.1689027, lng: -86.73954520000001};
    $scope.mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(36.1689027, -86.73954520000001),
        // mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
    $scope.marker = 
        new google.maps.Marker({
        position: $scope.centerMap,
        map: $scope.map
      }),
    
    $scope.checkMapBounds = () => {
        const bounds = $scope.map.getBounds()
        // console.log(bounds.contains($scope.centerMap))
        // console.log(bounds.contains({lat: -34, lng: 151}))
        $scope.listings = FilterFactory.usersWithinBounds(bounds, ListingsFactory.listings)
    }

    
        // new google.maps.LatLngBounds(sw, ne)

        // for (var a in markers) {
        // if (bounds.contains(new google.maps.LatLng(markers[a].lat, markers[a].lng)) {
        //     // marker is within bounds
        //     }
    

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

})