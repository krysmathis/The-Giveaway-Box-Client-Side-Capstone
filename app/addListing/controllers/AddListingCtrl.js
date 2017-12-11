"use strict"

angular.module("TheGiveawayBoxApp")
.controller("AddListingCtrl", function($scope, $routeParams, $location, $timeout, AuthFactory, AddListingFactory, ListingsFactory) {
    
    
    $scope.inUpdateMode = () => {
        if ($routeParams.listingId) {
            return true
        } else {
            return false
        }
    }

    let updateMode = $scope.inUpdateMode();

    $scope.addImage = (e) => 
        console.log(e.target.files)
        //AddListingFactory.addImage($scope.item.image)

    $scope.saveImage = () => {

        var filename = document.getElementById("addListing__image");
        let file = filename.files[0]
        AddListingFactory.addImage(file).then(_url=> {
            $scope.item.image = _url
        })

    }

    /**
     * tag objects
     */

    $scope.tags = ["test"]
    $scope.getMaxTagId = () => Math.max.apply(Math,array.map(function(o){return o.y;}))
    $scope.newTag = "";
    
    $scope.addTags = (tag) => {
            if ($scope.tags.find(f=> f===tag)) {
                //TODO user display when the tag won't go in
                console.log("already here")
            } else {
                $scope.tags.push(tag)
            }
    }

    $scope.updateTags = (e) => {
        if (e.key === "Enter") {
            $scope.addTags($scope.newTag)
            $scope.newTag = ""
        } else if (e.keyCode === 8 && $scope.newTag.length === 0) {
            $scope.tags.pop()
        }
    }
    
    $scope.removeTag = (e) => {
        const tags = $scope.tags
        const i = tags.indexOf(e.target.innerHTML)
        tags.splice(i,1)
    }

    /**
     * category objects
     */
    $scope.categories = []
    
    $scope.item = {}
    if (updateMode) {
       ListingsFactory.getSingleListing($routeParams.listingId).then(r=> {
            const item = r
            $scope.item = {
                label: item.label,
                desc: item.desc,
                price: item.price,
                image: item.image,
                categoryExternalId: item.categoryExternalId,
                subCategoryExternalId: item.subCategoryExternalId
            }
        })
        
    } else {
        $scope.item = {
            label: "",
            desc: "",
            price: "",
            image: "",
            categoryExternalId: "",
            subCategoryExternalId: ""
        }
    }

    // Binding for the drop down boxes
    $scope.selectedCategory = ""
    $scope.selectedSubCategory = ""

    const makeSelectedCategory = () => {
        let i = 0
        $scope.categories.forEach(cat => {
            if (cat.value === $scope.item.categoryExternalId) {
                $scope.selectedCategory = $scope.categories[i]
                $timeout(()=> $scope.getSubCategories(), 50)
                //$scope.getSubCategories()
               return
            }
            i++
        })
    }

    const makeSelectedSubCategory = () => {
        let i = 0;
        $scope.subCategories.forEach(cat => {
            if (cat.value === $scope.item.subCategoryExternalId) {
               $scope.selectedSubCategory = $scope.subCategories[i]
               $scope.getAttributes()
               return
            }
            i++
        })
    }

    // use the cached view model otherwise pull a new one
    if (AddListingFactory.catgoryViewModel === undefined) {
        AddListingFactory.getCategories().then(r=> {
            $scope.categories = AddListingFactory.getCategoryViewModel()
                makeSelectedCategory();
            
        })
    } else {
        console.log("pulling from cache")
        $scope.categories = AddListingFactory.categoryViewModel()
        makeSelectedCategory();

    }
    
    
    // only load the subcategories once the category is selected
    $scope.subCategories = [];

    $scope.getSubCategories = function() {
        $scope.item.categoryExternalId = $scope.selectedCategory.value
        if (AddListingFactory.subCategories.length === 0) {
            AddListingFactory.getSubCategories().then(r=>{
                $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryExternalId);
                makeSelectedSubCategory()
            })
        } else {
            $scope.subCategories = AddListingFactory.getSubCategoryViewModel($scope.item.categoryExternalId);
            makeSelectedSubCategory();
        }
    }

    /**
     * attribute objects
     * 
     */
    $scope.getAttributes = () => {
        $scope.item.subCategoryExternalId = $scope.selectedSubCategory.value
        if (AddListingFactory.attributes.length === 0) {
            AddListingFactory.getAttributes().then(r=> {
                $scope.attributeModel = AddListingFactory.getAttributeView($scope.item.subCategoryExternalId)
                console.log("view", AddListingFactory.attributeView)
            });
        } else {    
            console.log("pulling from cache")
            $scope.attributeModel =AddListingFactory.getAttributeView($scope.item.subCategoryExternalId)
        }
        
    }

    $scope.attributeModel = [];
        
    $scope.submitListing = () => {
        $scope.item.categoryExternalId = $scope.selectedCategory.value
        $scope.item.subCategoryExternalId = $scope.selectedSubCategory.value
        if (!$scope.inUpdateMode()){
            AddListingFactory.addListing($scope.item, $scope.attributeModel, $scope.tags)
        } else {
            console.log("ready to update")
            const user = AuthFactory.getUser()
            ListingsFactory.getApprovedUsers(user).then(r=> console.log(r))
        }   
    }

// end of module
})