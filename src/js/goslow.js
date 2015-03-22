
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


function done1() {
  next_page("done");
  if (goslow.repeat > 0 && goslow.test_mode != true) {
    $('#done').append('<video id="gopro_playback" autoplay class="video-js vjs-default-skin" width="640" height="356"></video>');
    videojs("gopro_playback").ready(function(){
      var latestVideo = get_last();
      var ext = latestVideo.substr(latestVideo.lastIndexOf('.') + 1);
      var count = goslow.repeat;

      var playback = this;

      playback
        // Turn on the volume, iOS devices ignore this
        .volume(1)
        // Load the latest video
        .src({
          src: latestVideo,
          type: "video/mp4"
        })
        // Pause it to stop the autoplay
        .pause()
        // No errors occurred while loading, start off here
        .on("loadstart", function(){
          $('#playback_text').text('Getting your video...');
          // If it's an MP4, it will step through the video to show the user
          // something is happenning. This adds one more count to the number
          // of times it's repeated.
          if (ext == 'MP4') {
            //count++;
          }
        })
        // Display the percentage loaded
        .on("progress", function(){
          var loaded = this.bufferedPercent();
          // Only step through the video if it's an mp4 (Because they're huge)
          if (ext == 'MP4') {
            // Have the video step thru while it's loading, one second at a time
            var positionLoaded = Math.floor(this.duration() * loaded);
            if (positionLoaded >= this.currentTime() && loaded < 1) {
              this.currentTime(positionLoaded);
            }
          }
          $('#percent').text(Math.floor(loaded * 100) + '%');
        })
        // Video is fully transferred
        .on("loadedalldata", function(){
          setTimeout(function(){
            $('#playback_text').text("Here's your video!");
            $('#percent').text('');
          }, 500);

          // Reset the playhead
          this.currentTime(0);
          // Wait a second then start playing the video
          setTimeout(function(){
            playback.play();
            // Failsafe timeout if the video doesn't repeat correctly
            setTimeout(function(){
              $('html').fadeOut(1000, function(){
                location.reload();
              });
            }, ((goslow.repeat * goslow.record_timer) + (goslow.record_timer * 2)) * 1000);
          }, 1000);
        })
        .on("ended", function(){
          count--;
          if (count > 0) {
            if (count == 1 && goslow.playback_slowmo) {
              $('#playback_text').text("Slow motion");
              // In video.js, the video tag given a new ID
              var video = document.getElementById($('#gopro_playback video').attr('id'));
              // playbackRate isn't available on video.js so we change it a different way
              video.playbackRate = 0.5;
            }
            this.play();
          }
          else {
            setTimeout(function(){
              $('body').fadeOut(1000, function(){
                location.reload();
              });
            }, 1000);
          }
        })
        .on("error", function(xhr, status, error){
          var playback = videojs("gopro_playback");
          $('#done > video').remove();
          playback.dispose();
          goslow.playback_text = "Sorry, there was an <span class='text-danger'>error</span> trying to playback your video.";
          skipPlayback();
        });
    });
  }
  else if (goslow.repeat > 0 && goslow.test_mode == true) {
    $('#done').append('<img width="640" height="356" src="goslow.png">');
    $('#playback_text').text('Test Mode: No Playback');
    setTimeout(function(){
      $('html').fadeOut(1000, function(){
        location.reload();
      });
    }, 5000);
  }
  else {
    skipPlayback();
  }
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
