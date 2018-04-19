var twilio = require('twilio');
var accountSid = 'AC02b441dd8dd58dead55cc654a2ad1fcb';
var authToken = 'f3f51e2e5761ef1f4bd6eaea7aa9907f';

var client = new twilio(accountSid, authToken);
var to_num = '+16164372084';
var from_num = '+16165524690';
var message_body = 'Your appointment';

client.messages
  .create({
    to: to_num,
    from: from_num,
    body: message_body
  }).then(message => console.log(message.sid, 'success'));
