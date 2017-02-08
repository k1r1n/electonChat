// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var server = "http://h-me.tv:1150/json";
var app = angular.module('app',[])
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
})
app.controller('main',function($scope,$http,$timeout){
  $scope.logged = false
  $scope.login = function(yourname){
    $scope.yourname = yourname
    if(yourname != "" && yourname != null){
      $scope.load = true
      $timeout(function(){
        $scope.logged = true
      },1000)
      $scope.getHistory()
    }
    else {
      alert("ใส่ชื่อด้วยไอ่สัส.")
    }
  }
  $scope.getHistory = function(){
    $http.get(server)
    .then(function(response){
      $scope.historys = response.data.length
      for(var i=0;i<response.data.length;i++){
        $('#chat').append('<div class="item"><img class="ui avatar image" title="'+response.data[i].datetime+'" src="http://semantic-ui.com/images/avatar/small/elliot.jpg"><div class="content"><a class="header">'+response.data[i].who+'</a>'+response.data[i].message+'</div></div>')
      }
    })
  }
  $scope.getLength = function(){
    $http.get(server)
    .then(function(response){
      $scope.historys = response.data.length
    })
  }
  $scope.send = function(txt){
    if(txt){
      if(txt == "/c")
        $("#chat").html("")
      var c = new Date();
      var datetime = c.getDate() + "/"+ (c.getMonth()+1)  + "/"+ c.getFullYear() + " @ "+ c.getHours() + ":"+ c.getMinutes() + ":"+ c.getSeconds();
      var data = {"who":$scope.yourname,"message":txt,"datetime":datetime}
      socket.emit('chat message', data);
      $scope.getLength()
      $scope.txt = ""
      //$scope.block = true
      // var promise = $timeout(function () {
      //   $scope.block = false
      // }, 1000);
      // $timeout.cancel(promise);
    }
  }
  socket.on('chat message', function(msg){
    $('#chat').append('<div class="item"><img class="ui avatar image"  title="'+msg.datetime+'" src="http://semantic-ui.com/images/avatar/small/elliot.jpg"><div class="content"><a class="header">'+msg.who+'</a>'+msg.message+'</div></div>')
    var elem = document.getElementById('div1')
    elem.scrollTop = elem.scrollHeight
  })
})
