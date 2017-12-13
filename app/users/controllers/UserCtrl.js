    angular.module("TheGiveawayBoxApp")
.controller("UserCtrl", function($scope, $route, $http, $routeParams, $timeout, $location, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {
    

    console.log("User Controller is Initiated")

    $scope.listingsInit = () => {
        const user = AuthFactory.getUser()
        ListingsFactory.getCurrentUserListings(user).then(r=> {
            $scope.user.listings = r
        })
    }

    $scope.seedGroups = () => {
        const user = AuthFactory.getUser()
        GroupsFactory.seedUserGroups(user).then(r=> {
            console.log("you've been seeded")
            
        })
    }
    //utility function for filtering
    $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    
    $scope.deleteListing = (e) => {
        ListingsFactory.deleteListing(e.target.id).then(r=>{
            console.log("record deleted", e.target.id)
            $route.reload()
            // $timeout(function () {
            //     $location.url(`/users/${$scope.listing.userId}`)
            // }, 100);
        })
    }

    $scope.closeListing = (e) => {
        ListingsFactory.closeListing(e.target.id).then(r=>{
            console.log("another successful listing")
        })
    }


    $scope.refresh = () => $scope.groupsInit()

    // $scope.groups = []

    // $scope.groupsInit = () => {
    //     GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
    //         $scope.groups = []
    //         r.forEach(val => $scope.groups.push(val))
    //         console.log("init groups: ", $scope.groups)
    //     })
    // }

    /**
     * INVITE NEW USERS
     */
    $scope.inviteUser = () =>  {
        console.log($scope.groups)
        const invite = {
            userId: AuthFactory.getUser().uid,
            created: Date.now(),
            redeemed: false
        }
        InviteFactory.getInviteCode(invite).then(outcome  => {
            $scope.inviteCode = outcome
            console.log($scope.inviteCode)
            InviteFactory.setGroupInviteCodes($scope.inviteCode, $scope.user.inviteGroups)
        })
    }

    $scope.user = {
        invitegroups: [],
        joinGroups: [],
        listings: []
    };

    $scope.checkAll = function() {
        $scope.user.roles = angular.copy($scope.roles);
    };

    $scope.uncheckAll = function() {
        $scope.user.roles = [];
    };

    $scope.checkFirst = function() {
        $scope.user.roles.splice(0, $scope.user.roles.length); 
        $scope.user.roles.push('guest');
    };

    /** 
     * REDEEM INVITATIONS
     */
    $scope.inviteCode = ""
    //$scope.showJoinButton = () => $scope.availableGroups.length = 0
    $scope.availableGroups = null
    // Redeem Invites
    $scope.redeemInvite = () => GroupsFactory.getGroupsFromInvite($scope.inviteCode).then(g=>{
        console.log(g)
        $scope.availableGroups = g
    })

    $scope.joinGroups = () => {
        console.log("groups", $scope.groups)
        GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
            const userGroups = r
            // only add groups if they aren't already listed
            const groups = $scope.user.joinGroups.filter(g=> 
                // TODO: add the ! back in 
               !userGroups.some(i=> 
                    i.groupId === g.groupId))

            if (!groups || groups.length === 0) {
                console.log("No new groups")
                return
            }

            const user = AuthFactory.getUser()
            groups.forEach(g => {
                const userGroup = {
                    groupId: g.groupId,
                    groupName: g.groupName,
                    inviteCode: g.inviteCode,
                    dateAdded: Date.now()
                }
                GroupsFactory.joinGroup(user,userGroup).then(r=> {
                    GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
                        $scope.groups = r
                        console.log("init groups: ", $scope.groups)
                        $route.reload()
                    })
                })
            })
        })
    }

    
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
    
    $scope.uploadImage = () => {
        var filename = document.getElementById("userProfile__image");
        let file = filename.files[0]
        UserFactory.addImage(file).then(_url=> {
            $scope.$apply(function() {
                $scope.userData.image = _url
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
        console.log(address)

        $http({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
        }).then(r=> {
            const location = r.data.results[0].geometry.location
            $scope.userData.lat = location.lat
            $scope.userData.long = location.lng
            
            console.log(r.data.results[0].geometry.location)
            
            if (!$scope.editingProfile) {
                // Now upload the user data
                UserFactory.add($scope.userData).then(r=> {
                    console.log("user added")
                })
            } else {
                delete $scope.userData.id
                UserFactory.update($scope.userData, $scope.editingUserKey).then(r=> {
                    console.log("user updated")
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