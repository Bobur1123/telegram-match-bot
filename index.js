import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import 'dotenv/config';

// === Config ===
const TOKEN = process.env.API_TOKEN; // Replace with your token
const CHAT_ID = process.env.CHAT_ID; // Replace with your group chat ID

const bot = new TelegramBot(TOKEN, { polling: false });

// === Teams ===
const teams = ['Green Team', 'Blue Team', 'Orange Team', 'Red Team'];

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function generateMatches() {
  const otherTeams = teams.filter(team => team !== 'Green Team');
  const shuffledOthers = shuffle([...otherTeams]);

  // Pick two teams for the first match (no Green Team)
  const match1 = [shuffledOthers[0], shuffledOthers[1]];

  // Green Team + the remaining team for the second match
  const remainingTeam = shuffledOthers[2];
  const match2 = ['Green Team', remainingTeam];

  return `🎯 *Today's Matches:*\n\n⚔️ ${match1[0]} vs ${match1[1]}\n⚔️ ${match2[0]} vs ${match2[1]}`;
}


function sendMatches() {
  const message = generateMatches();
  bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
}

// Schedule: Every Mon, Wed, Fri at 04:00 PM
cron.schedule('0 16 * * 1,3,5', () => {
  sendMatches();
  console.log('✅ Matches sent at 4:00 PM');
});

console.log('🤖 Telegram Match Bot is up and running...');
