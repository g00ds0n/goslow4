function error_restart(e){var a="There was a problem, please try again.";void 0!==e&&(a=e),$("body").append('<div class="goslow-error-wrapper"></div><div class="alert alert-danger goslow-error">'+a+"</div>"),$(".goslow-error-wrapper").bind("click",function(){return!1}),setTimeout(function(){$("body").fadeOut(1e3,function(){location.reload()})},4e3)}function get_last(){var e=goslow.videos;return $.ajax({url:e,async:!1,dataType:"html"}).done(function(a,n,t){var o=$("tbody img[alt='[DIR]']",a).last();e+=o.closest("tr").find("a.link").attr("href"),$.ajax({url:e,async:!1,dataType:"html"}).done(function(a,n,t){var o=$("a:contains('MP4')",a).last().attr("href");e+=o})}),e}function command(e,a){if(a="undefined"!=typeof a?a:!1,goslow.test_mode)return!0;var n="http://10.5.5.9/gp/gpControl/"+e,t=null;return $.ajax({url:n,async:!1,timeout:2e3,jsonp:!1,cache:!0,dataType:"jsonp"}).done(function(e,a,n){console.log(a),t=e}).fail(function(e,n,t){a||console.log(t)}),t}function powerOn(){}function volume(e){}function previewOn(){command("execute?p1=gpStream&c1=start")}function previewOff(){command("execute?p1=gpStream&c1=stop")}function mode(e){switch(e){case"photo":command("command/mode?p=1");break;case"multishot":command("command/mode?p=2");break;case"video":case"default":command("command/mode?p=0")}}function modeVideo(){command("command/mode?p=0")}function startCapture(){command("command/shutter?p=1")}function stopCapture(){command("command/shutter?p=0",!0)}function fov(e){switch(e){case"medium":command("setting/4/1");break;case"narrow":command("setting/4/2");break;case"wide":case"default":command("setting/4/0")}}function resolution(e){switch(e){case"WVGA":command("setting/2/13");break;case"960":command("setting/2/10");break;case"720":command("setting/2/12");break;default:case"1080":command("setting/2/9")}}function frameRate(e){switch(e){case 12:break;case 15:break;case 24:command("setting/3/10");break;case 30:command("setting/3/8");break;case 48:command("setting/3/7");break;case 60:command("setting/3/5");break;case 90:command("setting/3/3");break;case 120:command("setting/3/0");break;case 240:}}function iso(e){switch(e){case 6400:command("setting/13/0");break;case 1600:command("setting/13/1");break;case 400:default:command("setting/13/2")}}function next_page(e){$(".goslow-page").hide();var a=$(window).height()+"px";$("#"+e).css("height",a).show()}function sleep(e){for(var a=(new Date).getTime(),n=0;1e7>n&&!((new Date).getTime()-a>e);n++);}var auto_off=function e(){$("#instructions").unbind("click",ready),command("bacpac","PW","%00"),setTimeout(function(){$("#instructions").bind("click",ready)},3e3)};
//# sourceMappingURL=./goslow-functions-min.js.map