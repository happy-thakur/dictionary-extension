
$(function(){

  localStorage.setItem("one", 1);

    // getting selected string
    function getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    }

    $('body').keyup(
      function(e) {
        if(e.keyCode == 17 && e.shiftKey){
          e.preventDefault();
          var text = getSelectedText();

          if(text !== "" && text !== undefined)
            getMeaning(text);
        }
      });

    // get meaning..
    function getMeaning(str) {
      var hindi = new Array(), eng = new Array(), hindi_str = "", eng_str = "";

        // create the url..
        // by default to hindi..
        var dest   =   "hi",
            from  =   "en",
            format=   "json";
        str = str.trim();
        var url = "https://glosbe.com/gapi/translate?from="+from+"&dest="+dest+"&format=json&phrase="+str+"&pretty=true";
        var url2 = encodeURI(url);

        // request to get meaning..
        $.get(url2, function(res, status) {
          // now extract the data..
          if(res['result'] == "ok" && res['tuc'].length > 0) {
            // dp all stuffs..
            res['tuc'].forEach(function(data) {
              if(data['phrase'] !== undefined && data['phrase']['language'] == dest) {
                var temp_str = "";
                hindi.push(data['phrase']['text']);
                   if(data['meanings'] !== undefined) {
                    data['meanings'].forEach(function(data2) {
                      temp_str = data2['text']+" ";
                    });
                    // eng[e++] = data['phrase']['text'];
                  }
                  if(temp_str !== "") {
                    hindi[hindi.length - 1] += "("+temp_str+")";
                  }
                  hindi_str += "<p class='happ-list-show'>"+hindi[hindi.length - 1]+"</p>";
              } else if(data['meanings'] !== undefined) {
                eng.push("");
                data['meanings'].forEach(function(data2) {
                  eng[eng.length-1] += data2['text'];
                });
                eng_str += "<p class='happ-list-show'>"+eng[eng.length-1]+"</p>";
              }
            });
          } else {
          }
          if(hindi.length > 0)
            createBox(hindi, hindi_str);
          else if(eng.length > 0) {
            createBox(eng, eng_str);
          } else {
            var sss = "<p class='happ-list-show'>No meaning found..</p>";
            createBox([], sss)
          }

        });
    }

    // creare a div
    function createBox(mydata, hindi_str) {
      if($("div.happ-dragme").length == 0) {
        // mydata.forEach(function(items) {
        //   console.log(items);
        // });
      $('body').append("<div class='happ-dragme'><div style='margin-bottom: 25px;display: flex; justify-content: space-between; flex-direction: row-reverse;'><h2 id='happ-close-me' style='float: right; font-size: 18px; margin: 0px; cursor: pointer;font-weight: 800;color: black; margin-right: 10px; margin-top: 5px; display: inline-block;' title='Close'>X</h2><h1 style='display: inline-block; margin: 0px; float: left; font-size: 22px;'>Meanings</h1></div><p>"+hindi_str+"</p></div>");
      var x = $("div.happ-dragme");

      x.css({
        "position": "fixed",
        "bottom": "20px",
        "right": "20px",
        "background": "#48b751",
        "height": "250px",
        "width": "250px",
        "z-index": "10000",
        "overflow-y": "auto",
        "cursor": "move",
        "color": "white"
      });
      x.draggable();
    } else {
      var x = $("div.happ-dragme");
      x.html(hindi_str);
    }
    if($("p.happ-list-show").length > 0) {
      $("p.happ-list-show").css({
        "font-size": "18px",
        "margin": "2px",
        "padding-left": "10px",
        "border-bottom": "1px solid white",
        "font-weight": "800",
        "cursor": "default"
      });
    }
     $('h2#happ-close-me').click(function() {
      $('div.happ-dragme').remove();
    });
    }

    function createBodyData(mydata) {
      var str = "";
      mydata.forEach(function(data) {
        str += "<p class='happ-list-show'>"+data+" </p>";
      });
      return str;
    }

  });
// if result == "ok" then ok
// then tuc[] -> 0 -> phrase -> text [if language = hi else language = en]

// tuc[] -> meanings
