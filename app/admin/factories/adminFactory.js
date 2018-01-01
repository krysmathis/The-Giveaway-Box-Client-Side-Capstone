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
        "addSubCategories": {
            value: function (categories) {
                return firebase.auth().currentUser.getIdToken(true)
                .then(idToken => {  
                    // add the userId as a property
                    // user.userId = firebase.auth().currentUser.uid
                    return $http({
                        method: "POST",
                        url: `https://${firebasePath}/subCategories/.json?auth=${idToken}`,
                        data: categories
                    })
                })
            }
        },

        //addSubCategories
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
        "attributes": {
            value: [
            {
                externalId: 1,
                label: "Condition",
                desc: "Item Condition",
                inputType: "select",
                inclusive: false,
                valueType: 0,
                viewModel: [
                    {value: "OK"},
                    {value: "Still in good use"},
                    {value: "Great - very little use"},
                    {value: "New - never used"},
                ]
            },
            {   externalId: 2,
                label: "Size",
                desc: "Size based on age",
                inputType: "select",
                inclusive: false,
                valueType: 0,
                viewModel: [
                    {value: "birth-12 months"},
                    {value: "12-24 months"},
                    {value: "2 years"},
                    {value: "3-4 years"},
                    {value: "5-7 years"},
                    { value: "8-11 years"},
                    { value: "12-14 years"},
                ]
            },
            {   externalId: 3,
                label: "Brand",
                desc: "Stroller brands",
                inputType: "select",
                inclusive: false,
                valueType: 0,
                viewModel: [
                    {value: "Graco"},
                    {value: "Baby Jogger"},
                    {value: "Bugaboo"},
                    {value: "Chicco"},
                    {value: "Maclaren"},
                    {value: "Stokke"},
                    {value: "Unbranded or Other"},
                ]
            },
            {   externalId: 4,
                label: "Age",
                desc: "Age groups",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "birth-12 months"},
                    {value: "12-24 months"},
                    {value: "2 years"},
                    {value: "3-4 years"},
                    {value: "5-7 years"},
                    { value: "8-11 years"},
                    { value: "12-14 years"},
                ]
            },
            {
                externalId: 6,
                label: "Child Weight",
                desc: "List of child weights",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "0-3 lbs"},
                    {value: "4-20 lbs"},
                    {value: "21-30 lbs"},
                    {value: "31-40 lbs"},
                    {value: "41-60 lbs"},
                    {value: "61-80 lbs"},
                    {value: "61-80 lbs"},
                    {value: "81-100 lbs"},
                ]
            },
            {
                externalId: 7,
                label: "Color",
                desc: "Primary color",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "black"},
                    {value: "white"},
                    {value: "red"},
                    {value: "orange"},
                    {value: "yellow"},
                    {value: "green"},
                    {value: "blue"},
                    {value: "purble"},
                    {value: "pink"},
                    {value: "all the colors!"},
                ]
            },
            {   externalId: 8,
                label: "Stroller Size",
                desc: "Size based on age",
                inputType: "select",
                inclusive: false,
                valueType: 0,
                viewModel: [
                    {value: "birth-12 months"},
                    {value: "12-24 months"},
                    {value: "2 years & up"},
                ]
            },
            {   externalId: 9,
                label: "Stroller Speed",
                desc: "Rough estimate of stroller speed",
                inputType: "select",
                inclusive: false,
                valueType: 0,
                viewModel: [
                    {value: "Pokey"},
                    {value: "Take some effort"},
                    {value: "Speedy"},
                ]
            },
            {   externalId: 10,
                label: "Age",
                desc: "Bike Age groups",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "2 years"},
                    {value: "3-4 years"},
                    {value: "5-7 years"},
                    { value: "8-11 years"},
                    { value: "12-14 years"},
                ]
            },
            {   externalId: 11,
                label: "Wheel Size",
                desc: "Bike Wheel Sizes",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "12 inches"},
                    {value: "14 inches"},
                    {value: "16 inches"},
                    { value: "18 inches"},
                    { value: "20 inches"},
                    { value: "24 inches"},
                ]
            },
            {   externalId: 12,
                label: "Scooter Brands",
                desc: "Brands of Scooters",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "District"},
                    {value: "Envy"},
                    {value: "Fuzion"},
                    { value: "Lucky Brand"},
                    { value: "MADD"},
                    { value: "Razor"},
                    { value: "Unbranded"}
                ]
            },
            {   externalId: 13,
                label: "Skateboard Brands",
                desc: "Brands of Skateboards",
                inputType: "select",
                inclusive: true,
                valueType: 0,
                viewModel: [
                    {value: "Alien Workshop"},
                    {value: "Birdshop"},
                    {value: "Blind"},
                    { value: "Element"},
                    { value: "Penny Skateboard"},
                    { value: "Plan B"},
                    { value: "Powell Peralta"},
                    { value: "Santa Cruz"}
                ]
            },
                
        ],
            enumerable: true,
            writable: true
        }

        //subCategoryAttributes
    // End of object.create    
    })

});
