// Client-side JS logic goes here
// jQuery is already loaded
// Reminder: Use (and do all your DOM work in) jQuery's document ready function

$(document).ready(function() {
  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      dataType: 'json',
    })
    .done(function(tweets) {
      renderTweets(tweets);
    })
    .fail(function(error) {
      console.log('Error fetching tweets:', error);
    });
  };

  loadTweets();

  const renderTweets = function(tweets) {
    const $tweetsContainer = $('#tweets-container');
    $tweetsContainer.empty();
    
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.append($tweet);
    }
  };

  const createTweetElement = function(tweet) {
    const userAvatars = tweet.user.avatars || ''; // Default to empty string if avatars property is not present
    const $tweet = $(`
      <article class="tweet">
        <header class="tweet-header">
        <img class="profile-picture" src="${userAvatars}" alt="${tweet.user.name}" />          <h3>${tweet.user.name}</h3>
          <span>${tweet.user.handle}</span>
        </header>
        <div class="tweet-content">
          <p>${tweet.content.text}</p>
        </div>
        <footer class="tweet-footer">
          <i class="far fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
          <span class="tweet-time">${timeago.format(tweet.created_at)}</span>
        </footer>
      </article>
    `);
    return $tweet;
  };

  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    
    const $tweetText = $('#tweet-text');
    const tweetContent = $tweetText.val().trim();

    if (tweetContent === "") {
      alert("Tweet content cannot be empty.");
    } else if (tweetContent.length > 140) {
      alert("Tweet is too long. Maximum length is 140 characters.");
    } else {
      const formData = $(this).serialize();
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: formData,
      })
      .done(function(response) {
        const $newTweet = createTweetElement(response);
        $('#tweets-container').prepend($newTweet);
        $tweetText.val('');
      })
      .fail(function(error) {
        console.log('Error:', error);
      });
    }
  });
});
