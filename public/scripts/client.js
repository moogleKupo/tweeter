$(document).ready(function() {

  const createTweetElement = function(tweet) {
    const userAvatars = tweet.user.avatars || ''; // Default to empty string if avatars property is not present
    const $tweet = $(`
      <article class="tweet">
        <header class="tweet-header">
          <img class="profile-picture" src="${userAvatars}" alt="${tweet.user.name}" />
          <h3>${tweet.user.name}</h3>
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
  const loadTweets = function() {
    const escapeHTML = function(str) {
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };

    const renderTweets = function(tweets) {
      const $tweetsContainer = $('#tweets-container');
      $tweetsContainer.empty();
      
      for (const tweet of tweets) {
        const $tweet = createTweetElement(tweet);
        $tweetsContainer.append($tweet);
      }
    };
    
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




  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    
    const $tweetText = $('#tweet-text');
    const tweetContent = $tweetText.val().trim();

    const $errorContainer = $('#tweet-error-message');
    $errorContainer.empty().hide(); // Clear and hide error messages

    if (tweetContent === "") {
      const $errMsg = $('<div>').text("Tweet content cannot be empty!");
      $errMsg.prepend('<i class="fa-solid fa-circle-exclamation"></i>');
      $errorContainer.append($errMsg).show().delay(2000).fadeOut();
    } else if (tweetContent.length > 140) {
      const $errMsg = $('<div>').text("Tweet is too long. Maximum length is 140 characters.");
      $errMsg.prepend('<i class="fa-solid fa-circle-exclamation"></i>');
      $errorContainer.append($errMsg).show().delay(2000).fadeOut();
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
