// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform , $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      //debugger;
       currentState = toState.name;

       if (currentState == 'home'){}
       if (currentState == 'edit'){}
     });
  });
})

.config(function($stateProvider , $urlRouterProvider){
  $stateProvider

    .state('app' , {
      url: '/home',
      templateUrl:'templates/home.html',
      controller:'AppCtrl'
    })

    .state('edit',{
      url: '/edit/:name',
      templateUrl: 'templates/edit.html',
      controller:'AppCtrl'
    })

    .state('done' , {
      url: 'done',
      templateUrl:'templates/done.html'
    })

    .state('delete' , {
      url:'/delete',
      templateUrl:'templates/delete.html'
    })

    .state('authenticate' , {
      url: '/' ,
      templateUrl: 'templates/authentication.html',
      controller: 'AppCtrl'
    })

    .state('siginIn' , {
      url: '/signIn' ,
      templateUrl: 'templates/signIn.html',
      controller: 'AppCtrl'
    })

    .state('add' , {
      url:'/add',
      templateUrl:'templates/add.html',
      controller:'AppCtrl'
    });
})

.factory('API', function($http) {
  var api = {};
  var baseURL = 'http://localhost:3000';

  api.addRecord = function(record) {
      console.log(record);
    // $http.post(baseURL + '/addData', {name: record.name}.);
      return $http.post(baseURL + '/addData', {rec:record} );
  };

  api.deleteRecord = function(id){
    return $http.get(baseURL +'/delete/' + id );
  };

  api.updateRecord  = function(user){
    return $http.post(baseURL + "/update" ,{rec:user} );
  };

  api.getAllRecord = function(){
    return $http.get(baseURL+'/getAll');
  };

  api.getOneRecord = function(id){
    return $http.get(baseURL + '/getOne/' + id);
  };

  api.signUp = function(user){
    return  $http.post(baseURL + '/signUp' , {rec :user});
  };

  api.signIn = function(user){
      $http.post(baseURL + '/signIn' , {username :user.username , password:user.password}).then(function(response){
          debugger;
      } , function(response){
          debugger;
      });
  };

  return api;
})

.controller('AppCtrl' , function($scope , $stateParams , $state , API){
  $scope.homeOne = function(){
   API.getAllRecord().success(function(res) {
      // console.log(res);
      $scope.list = res;
      debugger;
    });
  }

  $scope.edit = function(){
    $scope.tempVar = $stateParams.name;
    API.getOneRecord($scope.tempVar).success(function(res){
      debugger;
      $scope.user = {id:res._id , name: res.name  , password: res.password};
      // console.log(res);
    });
    console.log($stateParams);
  }

  $scope.deleteMe=function(id){
    console.log(id);
    API.deleteRecord(id).then(function(res){
       $state.transitionTo('delete' ,{} , {reload: true });
    });
  }

  $scope.submitData = function(formData){
    var a = {name: formData.username  , password: formData.password};
    API.addRecord(a).then(function(res){
       $state.transitionTo('done' ,{} , {reload: true });
    });
  }

  $scope.signup = function(data){
    API.signUp(data).then(function(res){
      $state.transitionTo('app' ,{} , {reload: true });
    });
  }

  $scope.signIn = function(data){
    debugger;
    API.signIn(data).then(function(res){
        debugger;
    });
  }

  $scope.submitUpdatedData= function(user){
    debugger;
    API.updateRecord(user).then(function(res){
       $state.transitionTo('done' ,{} , {reload: true });
    });
  }

});
