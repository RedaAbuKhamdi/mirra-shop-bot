const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json())
const port = 3000
let chatId = {
  id:[],
  update: async function(new_id = null){
    if (new_id == null){
      this.id = JSON.parse(await fs.readFileSync('chat_id.txt'));
      console.log(this.id);
    }else{
      if(!this.id.includes(new_id)){
        this.id.push(new_id);
        await fs.writeFileSync('chat_id.txt', JSON.stringify(this.id));
      }
    }
  }
};



// replace the value below with the Telegram token you receive from @BotFather
const token = '5156793102:AAHnu-ASzQjKOUUUBLSt7u0WRU0bS6cczck';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  console.log(msg);
  if (msg.text.toLowerCase() == 'K1HeL2'){
    await chatId.update(msg.chat.id+'');
    console.log(chatId);
    bot.sendMessage(msg.chat.id,`Здравствуйте, ${msg.chat.first_name}! Ваш номер зарегистрирован!`);
  }

  // send a message to the chat acknowledging receipt of their message
});

function sendOrderInfo(url, order){
  console.log(order);
  for (id of chatId.id){
    bot.sendMessage(id, `Поступил новый заказ! ${order.comment == undefined || order.comment == "" ? "" :"Есть комментарий"}\nСсылка:${url}\nСтоимость продуктов: ${order.price} ₽\nИтого к оплате: ${order.price + order.delivery_price} ₽\nЗаказчик: ${order.name}\nТелефон: ${order.phone}\nПокупатель: ${order.distro_status}\nСпособ доставки: ${order.delivery_service}\nАдрес: ${order.address}`);
  }
}
app.listen(port, () => {
  chatId.update();
  console.log(`Telegramm app listening on port ${port}`);
});
app.post('/send/orderinfo', async (req, res)=>{
    console.log('=----------------------');
    console.log(req.body);
    sendOrderInfo(req.body.url, req.body.order);
    res.send(200);
});