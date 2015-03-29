
$(document).ready(function() {
  // Figure out the choices the user has
  var total_choices = 0;
  for (var x in goslow.choices) {
    var button = goslow.choices[x];
    $("#intro .button-template button").clone().appendTo('#intro .start-button').
      html(button.title).addClass('btn-' + button.btn).attr('data-choice', x);
    total_choices++;
  }
  $('#intro .start-button button').width($(window).width()/total_choices);
  preload();

  //$('.start-button').hide();
  // Disable rubber band effect on mac browser
  $(document).bind(
    'touchmove',
    function(e) {
      e.preventDefault();
    }
  );

  // Load the ready page
  $('#ready i').addClass('fa-arrow-circle-' + goslow.direction);

  // Slides in waiting move to the bottom for later animation
  $('.waiting').css('top', $(window).height());

  // Center page
  $('.full-page-wrapper').height($(window).height()).width($(window).width());
  $('.full-page').each(function(){
    var top = ($(window).height() - $(this).height())/2;
    $(this).css({
      top: top + 'px',
      position: 'absolute'
    });
  });


});

/**
 * Change camera's initial settings when the home page loads
 */
function preload() {
  fov('wide');
  mode('video');
  stopCapture();
  // Show user buttons after camera checks out
  $('#intro .start-button button').show().bind('click', ready);
}

var choice;
/**
 *
 */
var ready = function() {
  // Setup the camera
  choice = goslow.choices[$(this).data('choice')];
  $('#ready .mode')
    .addClass('btn-' + choice.btn)
    .html(choice.details);
    mode(choice.mode);
  resolution(choice.resolution);
  frameRate(choice.fps);
  fov(choice.fov);
  iso(choice.iso);

  // Show/hide the replay video
  if (!choice.playback) {
    $('#playback').hide();
  }



  $('#intro .start-button button').unbind();
  $(this).removeClass('btn-' + choice.btn).addClass('btn-danger');
  $('#intro').animate({top: '-=' + ($(window).height() + 5) + 'px'}, 3000);

  $('#ready').animate({top: '-=' + ($(window).height() + 5) + 'px'}, 2000, function(){
    $("#ready .arrow").animateRotate(360, 1500, function(){
      // Delay a second before running the countdown
      setTimeout(function(){
        // Remove the arrow to make room for the counter
        $("#ready .arrow").animate({'opacity':0}, 900, function(){
          // Temporary fill prevents text from shifting on the screen
          $("#ready .count").css('opacity', 0).html('J');
          $("#ready .arrow").hide();

        });
        $("#ready .lead").fadeOut(function(){ $(this).html("Get Ready!").fadeIn(); });
        // Run the countdown timer
        var count = 4;
        var countdown = setInterval(function(){
          $("#ready .count").
            css('opacity', 0).html(count).
            css('opacity', 1).animate({'opacity':0}, 900);
          count--;

          if (count == 0) {
            clearInterval(countdown);
            setTimeout(function(){
              // Start recording when the count is done
              //$('#ready').fadeOut(500);
              recording();
            }, 1000);
          }
        }, 1000);
      }, 1000)
    });
  });
};

function recording() {
  var count = choice.count;
  $("#recording .count").html(count);
  $('#ready').animate({top: '-=' + ($(window).height()) + 'px'}, 1500);
  $('#recording').animate({top: '-=' + ($(window).height()) + 'px'}, 1000, function(){
    startCapture();

    $("#recording .count").fadeOut(900);
    count--;

    var countdown = setInterval(function(){
      $("#recording .count").html(count).show().fadeOut(900);
      count--;

      if (count == -1) {
        clearInterval(countdown);
        setTimeout(function(){
          // Stop recording
          stopCapture();
          done(get_last());
        }, 1000);
      }
    }, 1000);
  });
}

function done(last) {
  var show_playback = choice.playback;
  if (goslow.test_mode && goslow.show_clip) {
    last = 'clip.mp4';
  }
  else {
    show_playback = false;
  }
  $('#recording').animate({top: '-=' + ($(window).height()) + 'px'}, 2000);
  $('#done').animate({top: '-=' + ($(window).height()) + 'px'}, 1000, function(){

    if (show_playback) {
      $('#done .status').html("Loading...");
      $('#done button').bind('click', function(){
        window.location.reload();
      });
      videojs('#replay_video').ready(function(){
        var playback = this;
        playback.src({src: last, type: "video/mp4"}).load().pause();

        playback.on('progress', function(){
          $('#done .progress-bar').width(parseInt(playback.bufferedPercent()*100) + '%');
        });

        playback.on('loadedalldata', function(){
          $('#done .progress').slideUp();
          playback.play();
          setTimeout(function(){
            $('#done .status').html("Enjoy!");
          }, 500);
        });

        playback.on('ended', function(){
          setTimeout(function(){
            window.location.reload();
          }, 2000);
        });
      });
    }
    else {
      $('#done .status').html("Thanks!");
      $('#done .full-page').each(function(){
        var top = ($(window).height() - $(this).height())/2;
        $(this).css({
          top: top + 'px',
          position: 'absolute'
        });
      });
      setTimeout(function(){
        window.location.reload();
      }, 5000);
    }
  });
}

