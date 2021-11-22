$(window).load(function() {
  $(".swipebar").swipe({
    swipeStatus: function(event, phase, direction, distance, duration, fingers) {
      if (phase == "move" && direction == "down") {
        $(".topbar").addClass("opentopbar");
        $(".sOverlay").addClass("overlay");
        return false;
      }
      if (phase == "move" && direction == "up") {
        $(".topbar").removeClass("opentopbar");
        $(".sOverlay").removeClass("overlay");
        return false;
      }
    }
  });
  $(".sOverlay").swipe({
    swipeStatus: function(event, phase, direction, distance, duration, fingers) {
      if (phase == "move" && direction == "up") {
        $(".topbar").removeClass("opentopbar");
        $(".sOverlay").removeClass("overlay");
        return false;
      }
    }
  });

  $(".preview").swipe({
    swipeStatus: function(event, phase, direction, distance, duration, fingers) {
      if (phase == "move" && direction == "left") {
        imageCount++;
        if (imageCount > 25) {
          imageCount = 25;
        }
        $(".preview").css("background-image", images[imageCount]);
        $(".gMore").css("display", "none");
        $(".gMore2").css("display", "none");
        return false;
      }
      if (phase == "move" && direction == "right") {
        imageCount--;
        if (imageCount == 0) {
          imageCount = 1;
          $(".cc").html("Count : " + imageCount);
        }
        $(".preview").css("background-image", images[imageCount]);
        $(".gMore").css("display", "none");
        $(".gMore2").css("display", "none");
        return false;
      }
    }
  });

  $(".lockScrn").swipe({
    swipeStatus: function(event, phase, direction, distance, duration, fingers) {
      if (phase == "move" && direction == "up" || phase == "move" && direction == "down" || phase == "move" && direction == "left" || phase == "move" && direction == "right") {
        $(".lockScrn").addClass("locked");
        $(".lErr").css("opacity", "1");
        $(".lock").css("transform", "translate(-50%,-50%) scale(1)");
        $(".lock").css("opacity", "1");
        setTimeout(function() {
          $(".lErr").css("opacity", "0");
        }, 2000)
        return false;
      }
    }
  });
});

var swiper = new Swiper('.swiper-container', {
  pagination: {
    el: '.swiper-pagination',
  },
});
var mTask = document.querySelector(".mTask");
var tops = document.querySelector(".topX");
var toms = document.querySelector(".tomX");

function mTaskF() {
  var values = mTask.value;
  var tph = 280 + -values;
  var tmh = (-280 + -values);
  if (tph > 380) {
    tph = 380;
    tmh = -180;
  }
  if (tmh < -380) {
    tmh = -380;
    tph = 180;
  }
  if (values < 120 && values > -120) {
    mTask.style.opacity = "1";
  } else {
    mTask.style.opacity = "0";
  }
  if (values < -120) {
    toms.style.opacity = "0.5";
  } else {
    toms.style.opacity = "1";
  }
  if (values > 120) {
    tops.style.opacity = "0.5";
  } else {
    tops.style.opacity = "1";
  }
  tops.style.height = tph + "px";
  toms.style.height = -tmh + "px";
}

function mTaskC() {
  var values = document.querySelector(".mTask").value;
  var tops = document.querySelector(".topX");
  var toms = document.querySelector(".tomX");
  if (values > 100) {
    document.querySelector(".mTask").value = 100;
  }
  if (values < -100) {
    document.querySelector(".mTask").value = -100;
  }
  if (values < -130) {
    tops.style.height = "100%";
    tops.style.transition = "0.5s";
    tops.style.zIndex = "1";
    toms.style.zIndex = "0";
  }
  if (values > 130) {
    toms.style.height = "100%";
    tops.style.zIndex = "0";
    toms.style.zIndex = "1";
  }
}

function range() {
  var rangeBar = document.querySelector(".in").value;
  var scaleObjt = document.querySelector(".body");
  scaleObjt.style.transform = `translate(-50%,-50%) scale(${rangeBar})`;
}

function rangex() {
  var rangeBar = document.querySelector(".op").value;
  var scaleObjt = document.querySelector(".mainWindow");
  scaleObjt.style.opacity = rangeBar;
}

var months = ["January", "February", "March",
    "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];

function setTime() {
  var sBT = document.querySelector(".sBT");
  var wTime = document.querySelector(".wTime");
  var wDate = document.querySelector(".wDate");
  var nTime = document.querySelector(".nTime");
  var second = document.querySelector('.seco');
  var minute = document.querySelector('.minu');
  var hour = document.querySelector('.hour');
  var time = new Date();
  var seconds = time.getSeconds();
  var minutes = time.getMinutes();
  var hours = time.getHours();
  var days = ["Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"];
  var date = time.getDate();
  var year = time.getFullYear();
  var session = "AM";

  if (hours == 0) {
    hours = 12;
  }

  if (hours > 12) {
    hours = hours - 12;
    session = "PM";
  }

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  $(".sBT").html(hours + ":" + minutes + " " + session);
  $(".wTime").html(hours + ":" + minutes);
  $(".wDate").html(days[time.getDay()] + ", " + months[time.getMonth()] + " " + date);
  $(".nTime").html(hours + ":" + minutes + " " + session + " | " + days[time.getDay()] + ", " + months[time.getMonth()] + " " + date);
}
setInterval(setTime, 1000);
setTime();

/*var mM = document.querySelector(".mainWindow");
mM.addEventListener("touchstart", touchHover);
mM.addEventListener("touchmove", touchHover);
mM.addEventListener("touchend", touchHoverEnd);
mM.addEventListener("mousemove", mouseHover);
mM.addEventListener("mouseleave", mouseHoverEnd);*/

(function() {
  var cleanUp, debounce, i, len, ripple, rippleContainer, ripples, showRipple;

  debounce = function(func, delay) {
    var inDebounce;
    inDebounce = undefined;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      clearTimeout(inDebounce);
      return inDebounce = setTimeout(function() {
        return func.apply(context, args);
      }, delay);
    };
  };

  showRipple = function(e) {
    var pos, ripple, rippler, size, style, x, y;
    ripple = this;
    rippler = document.createElement('span');
    size = ripple.offsetWidth;
    pos = ripple.getBoundingClientRect();
    x = e.pageX - pos.left - (size / 2);
    y = e.pageY - pos.top - (size / 2);
    style = 'top:' + y + 'px; left: ' + x + 'px; height: ' + size + 'px; width: ' + size + 'px;';
    ripple.rippleContainer.appendChild(rippler);
    return rippler.setAttribute('style', style);
  };

  cleanUp = function() {
    while (this.rippleContainer.firstChild) {
      this.rippleContainer.removeChild(this.rippleContainer.firstChild);
    }
  };

  ripples = document.querySelectorAll('[ripple]');

  for (i = 0, len = ripples.length; i < len; i++) {
    ripple = ripples[i];
    rippleContainer = document.createElement('div');
    rippleContainer.className = 'ripple--container';
    ripple.addEventListener('mousedown', showRipple);
    ripple.addEventListener('mouseup', debounce(cleanUp, 2000));
    ripple.rippleContainer = rippleContainer;
    ripple.appendChild(rippleContainer);
  }
}());

navigator.getBattery().then(function(battery) {
  var sBB = document.querySelector(".sBB");
  var bat1 = document.querySelector(".bat1");
  if (battery.charging) {
    bat1.style.background = "#00ff00";
    sBB.innerHTML = battery.level * 100 + "%";
    bat1.style.height = `${battery.level*100}%`;
  } else {
    sBB.innerHTML = battery.level * 100 + "%";
    bat1.style.height = `${battery.level*100}%`;
  }
});

navigator.connection.addEventListener('change', logNetworkInfo);

function logNetworkInfo() {
  var wif = document.querySelector(".wis");
  var g4 = document.querySelector(".g4");
  if (navigator.connection.type == "wifi") {
    wif.innerHTML = "wifi";
    document.querySelector(".ncell").style.color = "#bbb";
    document.querySelector(".nwifi").style.color = "#34b1e9";
    g4.display = "none";
  }
  else if (navigator.connection.type == "cellular") {
    wif.style.display = "none";
    document.querySelector(".nwifi").style.color = "#bbb";
    document.querySelector(".ncell").style.color = "#34b1e9";
    g4.style.display = "block";
  }
  else {
    wif.innerHTML = "wifi_tethering";
    g4.style.display = "none";
    document.querySelector(".ncell").style.color = "#bbb";
    document.querySelector(".nwifi").style.color = "#bbb";
  }
}
logNetworkInfo();

alert("Features\n    . Swipeable lockscreen\n    . Notification panel.\n    . Brightness controller.\n    . Swipeable menu.\n    . Functionable gallery.\n    . Clock follows cursor(Clock).(removed)\n    . Calender.(removed)\nSlide the range to scale the phone.");
alert("What's New\n   . More wallpapers.\n    . Functionable recent button.\n    . More than that multitasking mode.\n    . Working back button.\n    . And some new apps.\nImportant!!!\nMaybe I will leave it right here. But I will continue if you suggest me something.If you want to know about my next project then open notepad(app) for more info. Anyways if you like then please upvote.");

window.onload = function() {
  setTimeout(function() {
    $(".boot").css("display", "none");
  }, 3000);
};







var images = [
    '',
    'linear-gradient(to top, #ba28ff, #34b1e9)',
    'url("https://i.imgur.com/MUWQ5fz.jpg?1")',
    'url("https://i.imgur.com/pY7oXcf.jpg?1")',
    'url("https://i.imgur.com/3PNeJEF.jpg")',
    'url("https://i.imgur.com/lAbkcgd.jpg?1")',
    'url("https://i.imgur.com/4tl9iDn.jpg?1")',
    'url("https://i.imgur.com/47P3XE2.jpg")',
    'url("https://i.imgur.com/fTUf2IB.jpg?1")',
    'url("https://i.imgur.com/dgspQ4H.jpg?1")',
    'url("https://i.imgur.com/tfvkewq.gif")',
    'url("https://i.imgur.com/cdIo6zN.gif")',
    'url("https://i.imgur.com/TYkkUEZ.gif")',
    'url("https://i.imgur.com/IT0GNh8.jpg")',
    'url("https://i.imgur.com/00kMu62.jpg?1")',
    'url("https://i.imgur.com/yWBfb2N.png?1")',
    'url("https://i.imgur.com/hhoaJP3.jpg?1")',
    'url("https://i.imgur.com/2JNqKRh.jpg?1")',
    'url("https://i.imgur.com/ECc7mUt.jpg")',
    'url("https://i.imgur.com/HbPdiuK.jpg")',
    'url("https://i.imgur.com/wKKIezT.jpg")',
    'url("https://i.imgur.com/TPfGuM7.png?1")',
    'url("https://i.imgur.com/QNoDCqf.gif")',
    'url("https://i.imgur.com/I2N4waK.gif")',
    'url("https://i.imgur.com/CQdrRmc.gif")',
    'url("https://i.imgur.com/dgspQ4H.jpg")',
    'url("https://i.imgur.com/BJCdP6M.gif")'];

var ispower = true;

var mlTask = false;
var isTask1 = false;





//If recent modal is on or not
var isRecent = false;

//if any app is running or not
//var runapps = false;

//if apps are running or not
var isApp1 = false;
var isApp2 = false;
var isApp3 = false;
var isApp4 = false;
var isApp5 = false;
var isApp6 = false;
var isApp7 = false;
var isApp8 = false;
var isApp9 = false;
var isApp10 = false;
var isApp11 = false;
var isApp12 = false;
var isApp13 = false;
var isApp14 = false;
var isApp15 = false;
var isApp16 = false;
var isApp17 = false;
var isApp18 = false;

//if any app is running in the background or not
var backApp1 = false;
var backApp2 = false;
var backApp3 = false;
var backApp4 = false;
var backApp5 = false;
var backApp6 = false;
var backApp7 = false;
var backApp8 = false;
var backApp9 = false;
var backApp10 = false;
var backApp11 = false;
var backApp12 = false;
var backApp13 = false;
var backApp14 = false;
var backApp15 = false;
var backApp16 = false;
var backApp17 = false;
var backApp18 = false;



var imageCount = 0;

var galleryBack = 1;





function touchHover(e) {
  c = document.querySelector(".cursor");
  var cX = e.touches[0].clientX;
  var cY = e.touches[0].clientY;
  if (ispower) {
    c.style.display = "block";
    c.style.top = cY + "px";
    c.style.left = cX + "px";
  }
}

function touchHoverEnd() {
  c.style.display = "none";
}



function mouseHover(e) {
  c = document.querySelector(".cursor");
  var x = e.clientX;
  var y = e.clientY;
  if (ispower) {
    c.style.display = "block";
    c.style.top = y + "px";
    c.style.left = x + "px";
  }
}

function mouseHoverEnd() {
  c.style.display = "none";
}

function power() {
  if (!ispower) {
    ispower = true;
    $(".power").css("background", "#fff");
    $(".screen").addClass("unlock");
    $(".lIn").value = "";
    $(".softkeys").css("bottom", "-30px");
  } else {
    ispower = false;
    $(".power").css("background", "#666");
    $(".screen").removeClass("unlock");
    $(".lockScrn").removeClass("locked");
    $(".lock").css("transform", "translate(-50%,-50%) scale(1.3)");
    $(".lock").css("opacity", "0");
    $(".topbar").removeClass("opentopbar");
    $(".sOverlay").removeClass("overlay");
    errorCount = 0;
    blockCount = 0;
  }
}





function ins(n) {
  document.querySelector(".lIn").value = document.querySelector(".lIn").value + n;
  document.querySelector(".lIn").value = document.querySelector(".lIn").value.trim();
}

function iX() {
  var subs = document.querySelector(".lIn").value;
  document.querySelector(".lIn").value = subs.substring(0, subs.length - 1);
}
var lockPass = "2468";
var errorCount = 0;
var blockCount = 0;

function iK() {
  var lIn = document.querySelector(".lIn").value;
  var lockW = document.querySelector(".lockW");
  var lock = document.querySelector(".lock");
  document.querySelector(".lIn").value = "";

  if (lIn == lockPass) {
    lockW.classList.add("locked");
    lock.style.transform = "translate(-50%,-50%) scale(0.3)";
    lock.style.opacity = "0";
    document.querySelector(".softkeys").style.bottom = "0";
  } else if (lIn.length < 1) {
    disabled = true;
  } else {
    document.querySelector(".lErr").innerHTML = "Incorrect PIN entered";
    $(".lErr").css("opacity", "1");
    setTimeout(function() {
      $(".lErr").css("opacity", "0");
    }, 2000);
    errorCount++;
    if (errorCount == 5) {
      $(".lock").css("display", "none");
      $(".tryagain").css("display", "block");
      $(".tryagain").html("<h4>Try again in 30 seconds</h4> <h5>Just kidding Password is <strong>1234</strong></h5> <h6>Pleawaitooooôooooooooooooolooooôooooo for 5 seconds</h6>");
      blockCount++;
      if (blockCount == 5) {
        alert("Congratulations!!! \nYou have locked the android UI forever. \nJK don't worry I'll unlock it. \nBut don't forget to upvote my code please!!!")
        blockCount = 0;
      }
      setTimeout(function() {
        $(".lock").css("display", "block");
        $(".tryagain").css("display", "none");
        errorCount = 0;
      }, 5000);
    }
  }
}

function gallery() {
  $(".gallery").addClass("appOpen");
  $(".gallery").appendTo($(".mainWindow"));
  $(".statusBar").css("background", "rgba(0,0,0,0.5)");
  if (galleryBack === 1) { galleryBack = 2; } isApp1 = true;

  if (!backApp1) {
    var app1 = document.createElement("div");
    app1.className = "rTabs app1";
    app1.innerHTML = "<div class='ttmc' onclick='appO(1)'><img class='tabIcon' src='https://i.imgur.com/bytdIsW.png'><span class='rTabT'>Gallery</span></div><i class='material-icons rTabC' onclick='h(1)'>close</i><i class='material-icons rTabC' onclick='j(1)'>view_agenda</i>";
    $(".tmcc").append(app1);
    backApp1 = true;
  }
}

function appF() {
  $(".bgf").css("visibility", "visible");
  $(".bg").css("transform", "translate(-115%,-50%) scale(9)");
}

function bgf() {
  $(".bgf").css("visibility", "hidden");
  $(".bg").css("transform", "translate(-115%,-50%) scale(0)");
}
var thums = document.querySelectorAll(".thums");

function img(thumb) {
  $(".gin").css("display", "block");
  if (galleryBack === 2) {
    galleryBack = 3;
  }
  switch (thumb) {
    case "1":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[1]);
      imageCount = 1;
      break;
    case "2":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[2]);
      imageCount = 2;
      break;
    case "3":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[3]);
      imageCount = 3;
      break;
    case "4":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[4]);
      imageCount = 4;
      break;
    case "5":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[5]);
      imageCount = 5;
      break;
    case "6":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[6]);
      imageCount = 6;
      break;
    case "7":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[7]);
      imageCount = 7;
      break;
    case "8":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[8]);
      imageCount = 8;
      break;
    case "9":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[9]);
      imageCount = 9;
      break;
    case "10":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[10]);
      imageCount = 10;
      break;
    case "11":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[11]);
      imageCount = 11;
      break;
    case "12":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[12]);
      imageCount = 12;
      break;
    case "13":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[13]);
      imageCount = 13;
      break;
    case "14":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[14]);
      imageCount = 14;
      break;
    case "15":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[15]);
      imageCount = 15;
      break;
    case "16":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[16]);
      imageCount = 16;
      break;
    case "17":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[17]);
      imageCount = 17;
      break;
    case "18":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[18]);
      imageCount = 18;
      break;
    case "19":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[19]);
      imageCount = 19;
      break;
    case "20":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[20]);
      imageCount = 20;
      break;
    case "21":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[21]);
      imageCount = 21;
      break;
    case "22":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[22]);
      imageCount = 22;
      break;
    case "23":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[23]);
      imageCount = 23;
      break;
    case "24":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[24]);
      imageCount = 24;
      break;
    case "25":
      $(".preview").addClass("previewOpen");
      $(".preview").css("background-image", images[25]);
      imageCount = 25;
      break;
  }
}

function galleryMore() {
  $(".gMore").css("display", "block");
  $(".gMore2").css("display", "block");
}

function gMore() {
  $(".gMore").css("display", "none");
  $(".gMore2").css("display", "none");
  if (imageCount) {
    $(".mainWindow").css("background-image", images[imageCount]);
    $(".bfg").css("background-image", images[imageCount]);
    $(".recentM").css("background-image", images[imageCount]);
    $(".mModal").css("background-image", images[imageCount]);
  }
}

function gMore2() {
  $(".gMore").css("display", "none");
  $(".gMore2").css("display", "none");
  if (imageCount) {
    $(".lockW").css("background-image", images[imageCount]);
    $(".lockScrn").css("background-image", images[imageCount]);
  }
}



function home() {
  $(".gallery").removeClass("appOpen");
  $(".message").removeClass("appOpen");
  $(".bgf").css("visibility", "hidden");
  $(".bg").css("transform", "translate(-115%,-50%) scale(0)");
  $(".errorM").removeClass("errShow");
  $(".statusBar").css("background", "rgba(0,0,0,0)");
  isApp1 = false;
  isApp2 = false;
  isApp3 = false;
  isApp4 = false;
  isApp5 = false;
  isApp6 = false;
  isApp7 = false;
  isApp8 = false;
  isApp9 = false;
  isApp10 = false;
  isApp11 = false;
  isApp12 = false;
  isApp13 = false;
  isApp14 = false;
  isApp15 = false;
  isApp16 = false;
  isApp17 = false;
  isApp18 = false;
  isRecent = false;
  isTask1 = false;
  $(".recentM").removeClass("rcv");
  $(".mModal").css("visibility", "hidden");
  $(".topX").css("height", "280px");
  $(".tomX").css("height", "280px");
  document.querySelector(".mTask").value = 0;
  $(".noteM").removeClass("appOpen");
}

function back() {
  imageCount = 0;
  if (isApp1) {
    galleryBack--;
    switch (galleryBack) {
      case 2:
        $(".preview").removeClass("previewOpen");
        $(".preview").css("background-image", "none");
        break;
      case 1:
        $(".gallery").removeClass("appOpen");
        isApp1 = false;
        break;
    }
  }
  $(".bgf").css("visibility", "hidden");
  $(".bg").css("transform", "translate(-115%,-50%) scale(0)");
  $(".errorM").removeClass("errShow");
  $(".recentM").removeClass("rcv");
  $(".message").removeClass("appOpen");
  $(".noteM").removeClass("appOpen");
  isRecent = false;
  $(".statusBar").css("background", "rgba(0,0,0,0)");
}

function clearA() {
  $(".app1").remove();
  backApp1 = false;
  $(".app2").remove();
  backApp2 = false;
  $(".app3").remove();
  backApp3 = false;
  $(".app4").remove();
  backApp4 = false;
  $(".app5").remove();
  backApp5 = false;
  $(".app6").remove();
  backApp6 = false;
  $(".app7").remove();
  backApp7 = false;
  $(".app8").remove();
  backApp8 = false;
  $(".app9").remove();
  backApp9 = false;
  $(".app10").remove();
  backApp10 = false;
  $(".app11").remove();
  backApp11 = false;
  $(".app12").remove();
  backApp12 = false;
  $(".app13").remove();
  backApp13 = false;
  $(".app14").remove();
  backApp14 = false;
  $(".app15").remove();
  backApp15 = false;
  $(".app16").remove();
  backApp16 = false;
  $(".app17").remove();
  backApp17 = false;
  $(".app18").remove();
  backApp18 = false;
  $(".clear").css("display", "none");
  $(".nrua").css("display", "block");
  setTimeout(function() {
    isRecent = false;
    $(".recentM").removeClass("rcv");
  }, 1000);
}

function recent() {
  if (!isRecent) {
    isRecent = true;
    $(".recentM").addClass("rcv");
  } else {
    isRecent = false;
    $(".recentM").removeClass("rcv");
  }
  if (backApp1 || backApp2 || backApp3 || backApp4 || backApp5 || backApp6 || backApp7 || backApp8 || backApp9 || backApp10 || backApp11 || backApp12 || backApp13 || backApp14 || backApp15 || backApp16 || backApp17 || backApp18) {
    $(".clear").css("display", "block");
    $(".nrua").css("display", "none");
  } else {
    $(".clear").css("display", "none");
    $(".nrua").css("display", "block");
  }
}






















function closeErr() {
  $(".errorM").removeClass("errShow");
}

function app(apps) {
  switch (apps) {
    case "gl":
      gallery();
      break;
    case "fb":
      facebook();
      break;
    case "ms":
      messenger();
      break;
    case "ig":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Instagram has stopped.");
      break;
    case "sl":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Sololearn has stopped.");
      break;
    case "tw":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Twitter has stopped.");
      break;
    case "mf":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, My Files has stopped.");
      break;
    case "ph":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Phone has stopped.");
      break;
    case "cn":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Contacts has stopped.");
      break;
    case "mg":
      message();
      break;
    case "pm":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Google Play Music has stopped.");
      break;
    case "cm":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, camera has stopped.");
      break;
    case "ps":
      $(".errorM").addClass("errShow");
      $(".errorMSG").text("Unfortunately, Google Play Store has stopped.");
      break;
    case "np":
      $(".noteM").addClass("appOpen");
      break;
  }
}

function h(recentApps) {
  if (recentApps === 1) {
    $(".app1").remove();
    backApp1 = false;
    $(".gallery").removeClass("appOpen");
  }
  if (recentApps === 2) { $(".app2").remove();
    backApp2 = false; }
  if (recentApps === 3) { $(".app3").remove();
    backApp3 = false; }
  if (recentApps === 4) { $(".app4").remove();
    backApp4 = false; }
  if (recentApps === 5) { $(".app5").remove();
    backApp5 = false; }
  if (recentApps === 6) { $(".app6").remove();
    backApp6 = false; }
  if (recentApps === 7) { $(".app7").remove();
    backApp7 = false; }
  if (recentApps === 8) { $(".app8").remove();
    backApp8 = false; }
  if (recentApps === 9) { $(".app9").remove();
    backApp9 = false; }
  if (recentApps === 10) { $(".app10").remove();
    backApp10 = false; }
  if (recentApps === 11) { $(".app11").remove();
    backApp11 = false; }
  if (recentApps === 12) { $(".app12").remove();
    backApp12 = false; }
  if (recentApps === 13) { $(".app13").remove();
    backApp13 = false; }
  if (recentApps === 14) { $(".app14").remove();
    backApp14 = false; }
  if (recentApps === 15) { $(".app15").remove();
    backApp15 = false; }
  if (recentApps === 16) { $(".app16").remove();
    backApp16 = false; }
  if (recentApps === 17) { $(".app17").remove();
    backApp17 = false; }
  if (recentApps === 18) { $(".app18").remove();
    backApp18 = false; }

  if (backApp1 || backApp2 || backApp3 || backApp4 || backApp5 || backApp6 || backApp7 || backApp8 || backApp9 || backApp10 || backApp11 || backApp12 || backApp13 || backApp14 || backApp15 || backApp16 || backApp17 || backApp18) {
    $(".clear").css("display", "block");
    $(".nrua").css("display", "none");
  } else {
    $(".clear").css("display", "none");
    $(".nrua").css("display", "block");
  }
}


function facebook() {
  $(".errorM").addClass("errShow");
  $(".errorMSG").text("Unfortunately, Facebook has stopped.");
  if (!backApp2) {
    var app2 = document.createElement("div");
    app2.className = "rTabs app2";
    app2.innerHTML = "<div class='ttmc' onclick='appO(2)'><img class='tabIcon' src='https://i.imgur.com/X3FGh8d.png'><span class='rTabT'>Facebook</span></div><i class='material-icons rTabC' onclick='h(2)'>close</i><i class='material-icons rTabC' onclick='j(2)'>view_agenda</i>";
    $(".tmcc").append(app2);
    backApp2 = true;
  }
}

function messenger() {
  $(".errorM").addClass("errShow");
  $(".errorMSG").text("Unfortunately, Messenger has stopped.");
  if (!backApp3) {
    var app3 = document.createElement("div");
    app3.className = "rTabs app3";
    app3.innerHTML = "<div class='ttmc' onclick='appO(3)'><img class='tabIcon' src='https://i.imgur.com/X3FGh8d.png'><span class='rTabT'>Messenger</span></div><i class='material-icons rTabC' onclick='h(3)'>close</i><i class='material-icons rTabC' onclick='j(3)'>view_agenda</i>";
    $(".tmcc").append(app3);
    backApp3 = true;
  }
}

function message() {
  $(".message").addClass("appOpen");
  if (!backApp4) {
    var app4 = document.createElement("div");
    app4.className = "rTabs app4";
    app4.innerHTML = "<div class='ttmc' onclick='appO(4)'><img class='tabIcon' src='https://i.imgur.com/X3FGh8d.png'><span class='rTabT'>Messenger</span></div><i class='material-icons rTabC' onclick='h(4)'>close</i><i class='material-icons rTabC' onclick='j(4)'>view_agenda</i>";
    $(".tmcc").append(app4);
    backApp4 = true;
  }
}




function appO(open) {
  switch (open) {
    case 1:
      gallery();
      $(".app1").addClass("tabOpen");
      $(".gallery").css("z-index", "3");
      setTimeout(function() {
        $(".app1").removeClass("tabOpen");
        setTimeout(function() {
          $(".gallery").css("z-index", "1");
        }, 300);
        isRecent = false;
        $(".recentM").removeClass("rcv");
      }, 250);
      break;
    case 2:
      $(".app2").addClass("tabOpen");
      $(".errorM").css("z-index", "3");
      setTimeout(function() {
        $(".app2").removeClass("tabOpen");
        setTimeout(function() {
          $(".errorM").css("z-index", "1");
        }, 300);
        isRecent = false;
        $(".recentM").removeClass("rcv");
      }, 250);
      facebook();
      break;
  }
}

function j(selected) {
  $(".mModal").css("visibility", "visible");
  $(".recentM").removeClass("rcv");
  $(".statusBar").css("background", "rgba(0,0,0,0.5)");
  switch (selected) {
    case 1:
      $(".gallery").addClass("appOpen");
      $(".gallery").css("z-index", "3");
      $(".gal").css("display", "none")
      if (galleryBack === 1) { galleryBack = 2; }
      isApp1 = true;
      if (!isTask1) {
        $(".gallery").appendTo($(".topX"));
        isTask1 = true;
        isTask1 = true;
      } else {
        $(".gallery").appendTo($(".tomX"));
        isTask1 = true;
      }
      break;
    case 4:
      $(".message").addClass("appOpen");
      $(".message").css("z-index", "3");
      if (isTask1) {
        $(".message").appendTo($(".tomX"));
        $(".gallery").addClass("appOpen");
        isApp4 = true;
        isTask1 = true;
      } else {
        $(".message").appendTo($(".topX"));
        $(".gallery").addClass("appOpen");
        isApp4 = true;
        isTask1 = true;
      }
      break;
  }
}

