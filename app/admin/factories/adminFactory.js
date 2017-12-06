// use this to upload categories

angular
.module("TheGiveawayBoxApp")
.factory("adminFactory", function ($http) {
    const firebasePath = "the-giveaway-box-app.firebaseio.com"
    return Object.create(null, {
        // a method to add tables to the database
        "addCategories": {
            value: function (categories) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    // user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/categories/.json?auth=${idToken}`,
                        data: categories
                    })
                })
            }
        },
        "addAttributes": {
            value: function (attributes) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    // user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/attributes/.json?auth=${idToken}`,
                        data: attributes
                    })
                })
            }
        },
        "addAttributeValues": {
            value: function (attributes) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    // user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/attributeValues/.json?auth=${idToken}`,
                        data: attributes
                    })
                })
            }
        },
        "addSubCategoryAttributes": {
            value: function (attributes) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    // user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/subCategoryAttributes/.json?auth=${idToken}`,
                        data: attributes
                    })
                })
            }
        },
        "addProductListingSeeds": {
            value: function (item) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    item.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/itemListings/.json?auth=${idToken}`,
                        data: item
                    }).then(result => {
                        console.log(result)
                    })
                })
            }
        },

        //subCategoryAttributes
    // End of object.create    
    })

});
