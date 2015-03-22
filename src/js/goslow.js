
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

  // Center "Look at Camera" page
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
  //powerOn();
  //previewOff();
  stopCapture();
  //startCapture();
  //volume('00');
  // Show user buttons after camera checks out
  $('#intro .start-button button').show().bind('click', ready);
}

/**
 *
 */
var ready = function() {
  // Setup the camera
  var choice = goslow.choices[$(this).data('choice')];
  $('#ready .mode')
    .addClass('btn-' + choice.btn)
    .html(choice.title);
    mode(choice.mode);
  resolution(choice.resolution);
  frameRate(choice.fps);
  fov(choice.fov);

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
              recording(choice.count);
            }, 1000);
          }
        }, 1000);
      }, 1000)
    });
  });
};

function recording(count) {
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
  $('#recording').animate({top: '-=' + ($(window).height()) + 'px'}, 2000);
  $('#done').animate({top: '-=' + ($(window).height()) + 'px'}, 1000, function(){
    $('#done .status').html(last);
    videojs('#replay_video').ready(function(){
      var playback = this;
      playback.src({src: last, type: "video/mp4"});
    });
  });
}

function skipPlayback() {
  $('#playback_text').html(goslow.playback_text);
  $('#percent').text('');
  setTimeout(function() {
    $('body').fadeOut(1000, function(){
      location.reload();
    });
  }, 9000);
}
