$(document).ready(function() {
  $(".new-tweet textarea").on("input", function () {
    const tweetText = $(this);
    const charCounter = tweetText.closest(".new-tweet").find(".counter");

    const inputValue = this.value;
    const remainingChars = 140 - inputValue.length;

    charCounter.text(remainingChars);

    if (remainingChars < 0) {
      charCounter.addClass("exceeded-limit");
    } else {
      charCounter.removeClass("exceeded-limit");
    }
  });
});
