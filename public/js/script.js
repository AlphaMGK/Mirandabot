// const socket = io();


// const outputYou = document.querySelector('.output-you');
// const outputBot = document.querySelector('.output-bot');

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const reco = new SpeechRecognition();

// reco.lang = 'en-US';
// reco.interimResult = false;
// reco.maxAlternatives = 1;

// document.querySelector('button').addEventListener('click', function(){
// 	reco.start();
// });
// reco.addEventListener('speechstart', () => {
//   console.log('Speech has been detected.');
// });

// reco.addEventListener('result', function(e){
// 	let last = e.result.length - 1;
// 	let text = e.result[last][0].transcrip;
// 	outputYou.textContent = text;

// 	console.log('confidence: '+e.result[0][0].confidence);
// 	socket.emit('chat msg', text);
// });
// reco.addEventListener('speechend', () => {
//   recognition.stop();
// });

// reco.addEventListener('error', (e) => {
//   outputBot.textContent = 'Error: ' + e.error;
// });

// function synthVoice(text) {
// 	const synth = window.speechSynthesis;
// 	const utterance = new SpeechSynthesisUtterance();
// 	utterance.text = text;
// 	synth.speak(utterance);
// }

// socket.on('bot reply', function(replyText) {
// 	synthVoice(replyText);

// 	if(replyText == '') replyText = '(No answer...)';
// 	outputBot.textContent = replyText;
// });


const messengerObj = messenger();
const btn = document.querySelector('button');
btn.onclick = function() {
  messengerObj.you();
  recognition.start();
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.addEventListener('result', e => {
  var message = e.results[0][0].transcript;
  messengerObj.you(message);
  messengerObj.bot();
  socket.emit('voice message', message);
});

recognition.onsoundstart = toggleBtnAnimation;
recognition.onsoundend = toggleBtnAnimation;

function toggleBtnAnimation() {
  if (btn.classList.contains('animate')) {
    // remove class after animation is done
    var event = btn.addEventListener("animationiteration", ele => {
      console.log('ended');
      btn.classList.remove('animate');
      btn.removeEventListener('animationiteration', event);
    });
  } else {
    btn.classList.add('animate');
  }
}

const socket = io();
socket.on('bot reply', botMessage => {
  speak(botMessage);
  messengerObj.bot(botMessage);
});

function speak(textToSpeak) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'en-IN';
  synth.speak(utterance);
}

// Handle updating of bot & you messages
function messenger() {
  const you = document.querySelector('.output-you');
  const bot = document.querySelector('.output-bot');

  function updateMessage(msg) {
    console.log('this is ', this);
    msg = msg || this.getAttribute('default-message');
    this.innerHTML = '&nbsp;' + msg;
  }

  return {
    bot: updateMessage.bind(bot),
    you: updateMessage.bind(you)
  }
}
