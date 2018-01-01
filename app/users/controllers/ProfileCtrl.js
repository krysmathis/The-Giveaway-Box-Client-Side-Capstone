angular.module("TheGiveawayBoxApp")
.controller("ProfileCtrl", function($scope, $route, $http, $routeParams, $timeout, $location, ngToast, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {

        // handling if the user is editing their profile
        $scope.editingProfile = false
        $scope.editingUserKey = ""
        
        $scope.userData = 
            {
                userId: 0,
                email: "",
                firstName: null,
                lastName: null,
                address: "1710 Long Ave",
                city: "Nashville",
                state: "TN",
                zip: "37206",
                signup: Date.now(),
                lat: 0,
                long: 0,
                aboutMe: "designer, builder",   
                image: ""
            }
    
        $scope.createProfileInit = () => {
            //get the data from the database
            const user = AuthFactory.getUser()
            
            if (user) {
                UserFactory.singleUser(user.uid).then(r=> {
                    $scope.editingUserKey = r[0].id
                    delete r.id
                    $scope.editingProfile = true
                    $scope.userData = r[0]
                    const indexOfState = $scope.statesList.findIndex(i=> i.abbreviation === r[0].state)
                    $scope.selectedState = $scope.statesList[indexOfState]
                    //$scope.statesList[0]
                    
    
                })
            }
        }
        
        $scope.uploadFile = function(){
            $scope.$apply(() => {
                $scope.displayProgress = true
                $scope.saveImage()
            })
        };

        $scope.saveImage = () => {
            var filename = document.getElementById("userProfile__image");
            let file = filename.files[0]
            UserFactory.addImage(file).then(_url=> {
                $scope.$apply(function() {
                    $scope.userData.image = _url
                    $scope.displayProgress = false
                })
            })
        }
    
        $scope.addUsers = () => {
    
            const user = AuthFactory.getUser()
            $scope.userData.userId = user.uid,
            $scope.userData.email = user.email
    
            //format string for the date
            let address = $scope.userData.address.split(" ").join("+")
            address = address + "," + $scope.userData.city + "," + $scope.userData.state
            //console.log(address)
    
            $http({
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
            }).then(r=> {
                const location = r.data.results[0].geometry.location
                $scope.userData.lat = location.lat
                $scope.userData.long = location.lng
                
                //console.log(r.data.results[0].geometry.location)
                
                if (!$scope.editingProfile) {
                    // Now upload the user data
                    UserFactory.add($scope.userData).then(r=> {
                        $scope.$apply(() => {
                            ngToast.create("<i class='fa fa-check-circle-o'></i><strong> Done!</strong> Profile created!")
                        })
                    })
                } else {
                    delete $scope.userData.id
                    UserFactory.update($scope.userData, $scope.editingUserKey).then(r=> {
                        $scope.$apply(() => {
                            ngToast.create("<i class='fa fa-check-circle-o'></i><strong> Done!</strong> We have updated your profile.")
                        })
                    })
                }
            })
            
        }
          

    // $scope.selectedState = $scope.statesList[0]
    $scope.statesList = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ]
})


