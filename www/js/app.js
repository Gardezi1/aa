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
      url: '/',
      templateUrl:'templates/home.html',
      controller:'AppCtrl'
    })

    .state('edit',{
      url: '/edit/:name',
      templateUrl: 'templates/edit.html',
      controller:'AppCtrl'
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
      return $http.post(baseURL + '/addData', {rec:record});
  };

  api.deleteRecord = function(id){
    return $http.get(baseURL +'/delete/' + id );
  };

  api.updateRecord  = function(user){
    $http.post(baseURL + "/update/" ,{rec:user});
  };

  api.getAllRecord = function(){
    return $http.get(baseURL+'/getAll');
  };

  api.getOneRecord = function(id){
    return $http.get(baseURL + '/getOne/' + id)
  };

  return api;
})

.controller('AppCtrl' , function($scope , $stateParams , $state , API){

  // $scope.list=[
  //   {name:'John', age:25, gender:'boy'},
  //   {name:'Jessie', age:30, gender:'girl'},
  //   {name:'Johanna', age:28, gender:'girl'},
  //   {name:'Joy', age:15, gender:'girl'},
  //   {name:'Mary', age:28, gender:'girl'},
  //   {name:'Peter', age:95, gender:'boy'},
  //   {name:'Sebastian', age:50, gender:'boy'},
  //   {name:'Erika', age:27, gender:'girl'},
  //   {name:'Patrick', age:40, gender:'boy'},
  //   {name:'Samantha', age:60, gender:'girl'}
  // ];
  //



  $scope.homeOne = function(){
   API.getAllRecord().success(function(res) {
      console.log(res);
      $scope.list = res;
      debugger;
    });
  }

  $scope.edit = function(){
    // debugger;
    // console.log(id);
//    debugger;
    $scope.tempVar = $stateParams.name;
    API.getOneRecord($scope.tempVar).success(function(res){
      debugger;
      $scope.user = {id:res._id , name: res.name  , password: res.password};
      console.log(res);
    });
    console.log($stateParams);
  }

  $scope.deleteMe=function(id){
    console.log(id);
    API.deleteRecord(id);
    //debugger;
      $state.go('app');
  }

  $scope.submitData = function(formData){
    // debugger;
    var a = {name: formData.username  , password: formData.password};
    API.addRecord(a);
    $state.go('app');
  }

  $scope.submitUpdatedData= function(user){
    debugger;
    // $http.post('/url',{params: value}).sucess(function(){
    API.updateRecord(user);
  // }).console.error(function(){});
    $state.go('app');
  }

});
