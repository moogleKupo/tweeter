// Client-side JS logic goes here
// jQuery is already loaded
// Reminder: Use (and do all your DOM work in) jQuery's document ready function

// Sample tweet data

$(document).ready(function() {
  const data = [
    
  ];

  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      dataType: 'json',
    })
    .done(function(tweets) {
      console.log('Fetched tweets:', tweets);
      // Call a function to render the fetched tweets
      renderTweets(tweets);
    })
    .fail(function(error) {
      console.log('Error fetching tweets:', error);
    });
  };

  loadTweets();
  
  // Function to render tweets
  const renderTweets = function(tweets) {
    const $tweetsContainer = $('#tweets-container'); // Get the container element
    $tweetsContainer.empty(); // empty the container prior to rendering a new tweet

    // Loop through each tweet and append it to the container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet); // Create a tweet element
      $tweetsContainer.append($tweet); // Append the tweet element to the container
    }
  };

  // Function to create a tweet element
  const createTweetElement = function(tweet) {
    const $tweet = $(`
      <article class="tweet">
        <header class="tweet-header">
          <img class="profile-picture" src="${tweet.user.avatars}" alt="${tweet.user.name}" />
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


  // Event listener for form submission
  $('#tweet-form').submit(function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = $(this).serialize(); // Serialize form data

    // AJAX POST request
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: formData,
    })
    .done(function(response) {
      // Assuming the response contains the newly created tweet object
      renderTweets([response]); // Render the new tweet
      $('#tweet-text').val(''); // Clear the text area
    })
    .fail(function(error) {
      console.log('Error:', error);
    });
  });
});
