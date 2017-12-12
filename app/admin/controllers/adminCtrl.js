angular.module("TheGiveawayBoxApp")
.controller("adminCtrl", function($scope, $location, adminFactory, GroupsFactory, AuthFactory, ListingsFactory) {

// controller for category data

$scope.addCategories = () => {
    $scope.categories.forEach(cat => {
        adminFactory.addCategories(cat)
    })
}

$scope.seedGroups = () => {
    GroupsFactory.seedGroups()
}

$scope.addSubCategories = () => {
    $scope.subCategories.forEach(cat => {
        adminFactory.addSubCategories(cat)
    })
}

$scope.addAttributes = () => {
    $scope.attributes.forEach(attr => {
        adminFactory.addAttributes(attr)
    })
}

$scope.addAttributeValues = () => {
    $scope.attributeValueList.forEach(attr => {
        adminFactory.addAttributeValues(attr)
    })
}


$scope.addSubCategoryAttributes = () => {
    $scope.subCategoryAttributes.forEach(attr => {
        adminFactory.addSubCategoryAttributes(attr)
    })
}

$scope.addProductListingSeeds = () => {
    $scope.productListingSeeds.forEach(item => {
        adminFactory.addProductListingSeeds(item)
    })
}

$scope.approvedUsers = () => {
    const user = AuthFactory.getUser()
    ListingsFactory.getApprovedUsers(user).then(r=> console.log(r))
}
//$scope.productListingSeeds
//subCategoryAttributes

//addAttributeValues()

$scope.productListingSeeds = [
    {
        desc: "a heavyweight stroller",
        image: "https://images-na.ssl-images-amazon.com/images/I/915e2De5-BL._SX355_.jpg",
        price: 0,
        available: true,
        timestamp: Date.now(),
        categoryExternalId: 800,
        subcategoryExternalId: 8001
    }
]

$scope.categories = [
    {
        externalId: 100,
        label: "Action",
        desc: "Figures & Hero Play, NERF Blasters"
    },
    {
        externalId: 200,
        label: "Arts",
        desc: "& Crafts, Educational Toys, Books"
    },
    {
        externalId: 300,
        label: "Baby",
        desc: "Toddler & Preschool Learning Toys"
    },
    {
        externalId: 400,
        label: "Bikes & Riding Toys",
        desc: "Moving kids around"
    },
    {
        externalId: 500,
        label: "Outdoor",
        desc: "Play, Kids Sports and Swimming"
    },
    {
        externalId: 600,
        label: "Kids Furniture",
        desc: "For rooms and stuff"
    },
    {
        externalId: 700,
        label: "Building",
        desc: "Blocks, LEGOs"
    },
    {
        externalId: 800,
        label: "Strollers",
        desc: "Toddler & Preschool Learning Toys"
    }
]

$scope.subCategories = [
    {
        externalId: 1001,
        categoryExtId: 100,
        label: "Action Figures"

    },
    {
        externalId: 1002,
        categoryExtId: 100,
        label: "Toy Guns Blasters and Wepaons"
    },
    {
        externalId: 1003,
        categoryExtId: 100,
        label: "Tools and Working"
    },
    {
        externalId: 2001,
        categoryExtId: 200,
        label: "Arts & Crafts"
    },
    {
        externalId: 2002,
        categoryExtId: 200,
        label: "Learning & Education"
    },
    {
        externalId: 2003,
        categoryExtId: 200,
        label: "Children's Books"
    },
    {
        externalId: 3001,
        categoryExtId: 300,
        label: "Baby Toys"
    },
    {
        externalId: 3002,
        categoryExtId: 300,
        label: "Toddler & Preschool Learning"
    },
    {
        externalId: 4001,
        categoryExtId: 400,
        label: "Bicycles"
    },
    {
        externalId: 4002,
        categoryExtId: 400,
        label: "Tricycles"
    },
    {
        externalId: 4003,
        categoryExtId: 400,
        label: "Power Wheels & Powered Riding"
    },
    {
        externalId: 4004,
        categoryExtId: 400,
        label: "Scooters"
    },
    {
        externalId: 4005,
        categoryExtId: 400,
        label: "Skateboards"
    },
    {
        externalId: 4006,
        categoryExtId: 400,
        label: "Helmets, Pads & Safety"
    },
    {
        externalId: 8001,
        categoryExtId: 800,
        label: "Strollers"
    },
]

// valueType 0 = text, 1 = num, 2 = dec
$scope.attributes = [
    {
        externalId: 1,
        label: "Condition",
        desc: "Item Condition",
        inputType: "select",
        inclusive: false,
        valueType: 0,
        viewModel: [
            {
                label: "got a lot of use, needs repair",
                value: "got a lot of use, needs repair",
                isSelected: false
            },
            {
                isSelected: false,
                label: "fair",
                value: "fair"
            },
            // {
            //     sequence: 3,
            //     value: "good condition"
            // },
            // {
            //     sequence: 4,
            //     value: "new or like new"
            // },
        ]
    },
    {   externalId: 2,
        label: "Size",
        desc: "Size based on age",
        inputType: "select",
        inclusive: false,
        valueType: 0
    },
    {   externalId: 3,
        label: "Brand",
        desc: "Stroller brands",
        inputType: "select",
        inclusive: false,
        valueType: 0
    },
    {   externalId: 4,
        label: "Age",
        desc: "Age groups",
        inputType: "select",
        inclusive: true,
        valueType: 0
    },
    {
        externalId: 5,
        label: "Stroller Style",
        desc: "Style of stroller",
        inputType: "select",
        inclusive: true,
        valueType: 0
    },
    {
        externalId: 6,
        label: "Child Weight",
        desc: "List of child weights",
        inputType: "select",
        inclusive: true,
        valueType: 0
    },
    {
        externalId: 7,
        label: "Color",
        desc: "Primary color",
        inputType: "select",
        inclusive: true,
        valueType: 0
    }
]

$scope.attributeValueList = [
    {
        attributeExternalId: 1,
        sequence: 1,
        value: "hello"
    },
    {
        attributeExternalId: 2,
        sequence: 1,
        value: "birth-12 months"
    },
    {
        attributeExternalId: 2,
        sequence: 2,
        value: "12-24 months"
    },
    {
        attributeExternalId: 2,
        sequence: 3,
        value: "2 years"
    },
    {
        attributeExternalId: 2,
        sequence: 4,
        value: "3-4 years"
    },
    {
        attributeExternalId: 2,
        sequence: 5,
        value: "5-7 years"
    },
    {
        attributeExternalId: 2,
        sequence: 6,
        value: "8-11 years"
    },
    {
        attributeExternalId: 2,
        sequence: 7,
        value: "12-14 years"
    },
    {
        attributeExternalId: 4,
        sequence: 1,
        value: "birth-12 months"
    },
    {
        attributeExternalId: 4,
        sequence: 2,
        value: "12-24 months"
    },
    {
        attributeExternalId: 4,
        sequence: 3,
        value: "2 years"
    },
    {
        attributeExternalId: 4,
        sequence: 4,
        value: "3-4 years"
    },
    {
        attributeExternalId: 4,
        sequence: 5,
        value: "5-7 years"
    },
    {
        attributeExternalId: 4,
        sequence: 6,
        value: "8-11 years"
    },
    {
        attributeExternalId: 4,
        sequence: 7,
        value: "12-14 years"
    },
    {
        attributeExternalId: 5,
        sequence: 1,
        value: "Jogger"
    },
    {
        attributeExternalId: 5,
        sequence: 2,
        value: "Travel"
    },
    {
        attributeExternalId: 5,
        sequence: 3,
        value: "Fully-loaded"
    },
    {
        attributeExternalId: 6,
        sequence: 1,
        value: "0-3 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 2,
        value: "4-20 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 3,
        value: "21-30 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 4,
        value: "31-40 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 5,
        value: "41-60 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 6,
        value: "61-80 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 7,
        value: "61-80 lbs"
    },
    {
        attributeExternalId: 6,
        sequence: 8,
        value: "81-100 lbs"
    },

]

$scope.subCategoryAttributes = [
    {
        subCategoryExternalId: 8001,
        attributeExternalId: 1
    },
    {
        subCategoryExternalId: 8001,
        attributeExternalId: 2
    },
    {
        subCategoryExternalId: 8001,
        attributeExternalId: 3
    },

]




// END OF MODULE
})
