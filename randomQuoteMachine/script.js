const quoteAPI = "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";

const newQuoteButton = document.querySelector("button");
const textSpan = document.getElementById("text");
const author = document.getElementById("author")

var colors = [
  '#16a085',
  '#27ae60',
  '#2c3e50',
  '#f39c12',
  '#e74c3c',
  '#9b59b6',
  '#FB6964',
  '#342224',
  '#472E32',
  '#BDBB99',
  '#77B1A9',
  '#73A857'
];



function adjustFooter() {
  const quoteBox = document.getElementById('quote-box');
  const footer = document.getElementById('footer');
  const quoteBoxHeight = quoteBox.offsetHeight;
  $("#footer").css("top", '${quoteBoxHeight-80}px');
}


const fetchData = async () => {
  try {
    const res = await fetch(`${quoteAPI}`);
    if (!res.ok) {
      alert("Quote Link Error");
      return;
    }
    const data = await res.json();
    displayQuote(data);
    adjustFooter();

    newQuoteButton.addEventListener('click', () => {
      displayQuote(data);
      adjustFooter();
    });
  } catch (err) {
    console.log(err);
  }
};

const displayQuote = (data) => {
  const randomIndex = Math.floor(Math.random() * data.quotes.length);
  const randomQuote = data.quotes[randomIndex];
  $("#text").text(randomQuote.quote);
  $("#author").text(randomQuote.author);

  const randomColor = Math.floor(Math.random() * colors.length);
  const colorPicked = colors[randomColor];

  $("body").css("background-color", colorPicked);
  $("#text").css("color", colorPicked);
  $("#author").css("color", colorPicked);
  $("#new-quote").css("background-color", colorPicked);
  $(".btn").css("background-color", colorPicked);

  const tweetText = encodeURIComponent(`"${randomQuote.quote}" - ${randomQuote.author}`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  $("#tweet-quote").attr("href", tweetUrl);
};

fetchData();