"use strict"

angular.module("TheGiveawayBoxApp")
.controller("AddListingCtrl", function($scope, $route, $routeParams, $location, $timeout, AuthFactory, AddListingFactory, ListingsFactory) {
    
    // check if the item is in update mode
    $scope.inUpdateMode = () => {
        if ($routeParams.listingId) {
            return true
        } else {
            return false
        }
    }
    
    let updateMode = $scope.inUpdateMode();
    
    /**
     * File Upload workflow to control the progress bar
     * 
     */
    $scope.displayProgress = false

    $scope.uploadFile = function(){
        $scope.$apply(() => {
            $scope.displayProgress = true
            $scope.saveImage()
        })
    };

    $scope.addImage = (e) => 
        console.log(e.target.files)
        //AddListingFactory.addImage($scope.item.image)

    $scope.saveImage = () => {

        var filename = document.getElementById("addListing__image");
        let file = filename.files[0]
        AddListingFactory.addImage(file).then(_url=> {
            $scope.$apply(function() {
                $scope.item.image = _url
                $scope.displayProgress = false
            })
        })

    }
    /**
     * Controls for the new expiration date control
     */
    $scope.minDateString = moment().subtract(1,'day')

    $scope.reload = () => $route.reload()


    

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
    
    $scope.item = {
        label: "",
        desc: "",
        price: "",
        image: "",
        categoryExternalId: "",
        subCategoryExternalId: ""
    }

    // populate the attributes of the item if we are in update mode
    if (updateMode) {
       ListingsFactory.getSingleListing($routeParams.listingId).then(r=> {
            const storedItem = r
                $scope.item.label= storedItem.label,
                $scope.item.desc= storedItem.desc,
                $scope.item.price= storedItem.price,
                $scope.item.image= storedItem.image,
                $scope.item.categoryExternalId= storedItem.categoryExternalId,
                $scope.item.subCategoryExternalId= storedItem.subCategoryExternalId
                $scope.item.attributes = storedItem.attributes
                $scope.item.tags = storedItem.tags
                $scope.item.expirationDate = moment(storedItem.expirationDate)
        })
        
    } else {
        $scope.item = {
            label: "", //you won't believe this label
            desc: "",
            price: "",
            image: "http://via.placeholder.com/350x350",
            categoryExternalId: "",
            subCategoryExternalId: "",
            expirationDate: moment().add(30,'day')
        }
    }

    /**
     * Subcategory controls
     */
    // Binding for the drop down boxes
    $scope.selectedCategory = ""
    $scope.selectedSubCategory = ""

    const makeSelectedCategory = () => {
        let i = 0
        $scope.categories.forEach(cat => {
            if (cat.value === $scope.item.categoryExternalId) {
                $scope.selectedCategory = $scope.categories[i]
                $timeout(()=> $scope.getSubCategories(), 50)
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
            $scope.attributeModel = AddListingFactory.getAttributeView($scope.item.subCategoryExternalId)
        }
        
    }

    $scope.attributeModel = [];
        
    $scope.submitListing = () => {

        $scope.item.categoryExternalId = $scope.selectedCategory.value
        $scope.item.subCategoryExternalId = $scope.selectedSubCategory.value
        if (!$scope.inUpdateMode()){
            AddListingFactory.addListing($scope.item, $scope.attributeModel, $scope.tags)
            console.log("listing created")
            $route.reload()
        } else {
            console.log("ready to update")
            // send scope.item and have it update parts of the item before reloading
            ListingsFactory.updateListing($routeParams.listingId, $scope.item)
        }   
    }

// end of module
})