(function() {
  var App = function(){
    this.init();
  };

  App.prototype.init = function(){
    // get api
    navigator.getMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia
    );
  };

  // 分析录音的信息
  App.prototype.analyzeMic = function(callback){
    navigator.getMedia({audio: true}, function (stream){
      var audioCtx, mic, analyser;

      try{
        audioCtx = new (window.AudioContext || window.webkitAudioContext);
      }catch(e){
        throw new Error("不支持Web Audio API")
      }

      mic = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      mic.connect(analyser);
      if(callback){callback(analyser);}
    }, function(){});
  };

  // 分析媒体声音的信息
  App.prototype.analyzeMedia = function(callback){
    var audioCtx, analyser, $audio, source;

    try{
      audioCtx = new (window.AudioContext || window.webkitAudioContext);
    }catch(e){
      throw new Error("不支持Web Audio API")
    }

    analyser = audioCtx.createAnalyser();
    $audio = document.getElementById("audio");
    source = audioCtx.createMediaElementSource($audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    if(callback){callback(analyser);}
  };

  // onload run
  window.addEventListener("load", function(){
    var app, renderMicChart, renderMediaChart, initStage,
      stage1, stage2, stage3,
      container1, container2, container3;

    initStage = function(){
      stage1 = new createjs.Stage("canvas1");
      stage2 = new createjs.Stage("canvas2");
      stage3 = new createjs.Stage("canvas3");
      container1 = new createjs.Container();
      container2 = new createjs.Container();
      container3 = new createjs.Container();
      container1.x = container1.y =
      container2.x = container2.y =
      container3.x = container3.y = 0;
      stage1.addChild(container1);
      stage2.addChild(container2);
      stage3.addChild(container3);
    };

    renderMicChart = function(analyser){
      var arrData;

      arrData = new Uint8Array(128);
      analyser.getByteFrequencyData(arrData);

      container2.removeAllChildren();
      container3.removeAllChildren();

      for(var i=0,j=arrData.length, value; j>i; i++){
        var rect, circle;

        value = arrData[i];

        rect = new createjs.Shape();
        rect.graphics.beginFill("#000000").drawRect(i*5, 400-value, 3, 400);
        rect.x = rect.y = 0;

        circle = new createjs.Shape();
        circle.graphics.setStrokeStyle(5, "round").beginStroke(createjs.Graphics.getRGB(value,value,255,.2));
        circle.graphics.drawCircle(0, 0, value);
        circle.x = 300;
        circle.y = 300;

        container2.addChild(rect);
        container3.addChild(circle);
      }

      stage2.update();
      stage3.update();

      requestAnimationFrame(function(){
        renderMicChart(analyser);
      });
    };

    renderMediaChart = function(analyser){
      var arrData;

      arrData = new Uint8Array(128);
      analyser.getByteFrequencyData(arrData);

      container1.removeAllChildren();

      for(var i=0, j=arrData.length, value; j>i; i++){
        var rect;

        value = arrData[i];
        rect = new createjs.Shape();
        rect.graphics.beginFill("#000000").drawRect(i*5, 400-value, 3, 400);
        rect.x = rect.y = 0;

        container1.addChild(rect);
      }

      stage1.update();

      requestAnimationFrame(function(){
        renderMediaChart(analyser);
      });
    };

    initStage();

    app = new App();

    app.analyzeMic(renderMicChart);

    app.analyzeMedia(renderMediaChart);
  }, false);
})();
