angular.module("TheGiveawayBoxApp")
.controller("UserCtrl", function($scope, $route, $routeParams, $timeout, $location, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {
    
    $scope.listingsInit = () => {
        const user = AuthFactory.getUser()
        ListingsFactory.getCurrentUserListings(user).then(r=> {
            $scope.user.listings = r
            
        })
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

    $scope.refresh = () => $scope.groupsInit()

    $scope.groups = []

    $scope.groupsInit = () => {
        GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
            $scope.groups = []
            r.forEach(val => $scope.groups.push(val))
            console.log("init groups: ", $scope.groups)
        })
    }

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
               userGroups.some(i=> 
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

    $scope.userData = 
        {
            userId: $routeParams.userId,
            firstName: "Krys",
            lastName: "Mathis",
            address: "1710 Long Ave",
            city: "Nashville",
            state: "TN",
            zip: "37206",
            signup: Date.now(),
            lat: 0,
            long: 0,
            aboutMe: "designer, builder",   
            image: ""
        },
    
    
    $scope.addUsers = () => {
        UserFactory.add(user)
    }

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