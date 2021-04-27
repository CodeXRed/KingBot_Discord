const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("Hello world!")
})

app.listen(3000, () => {
  console.log("Project is ready!")
})

const Discord = require("discord.js")
const client = new Discord.Client()

const settings = require('./settings')

const prefix = '?'

const commands = [
  {
    commandName: 'ping',
    enabled: true,
    channelTypesAllowed: ['text', 'dm'],
    asyncFunction: async function (message){
      message.channel.send('Pinging...').then((m) => {
        m.edit(`Pong! It took me ${client.ws.ping}ms to edit this message!`)
      })
    }
  },
  {
    commandName: 'suggest',
    enabled: true,
    channelTypesAllowed: ['text'],
    asyncFunction: async function (message){
      
    }
  }
];

client.on("message", message => {
   if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase()

  let validCommand = false;
  let commandIndex = -1;
  for(let i in commands){
    if(commands[i].commandName === command) {
      validCommand = true; 
      commandIndex = i;
    }
  }

  if(validCommand === false) return message.channel.send('That is not a valid command!');

  let inGoodChannel = false;
  for(let i in commands[commandIndex].channelTypesAllowed){
    if(commands[commandIndex].channelTypesAllowed[i] === message.channel.type){
      inGoodChannel = true;
    }
  }

  if(inGoodChannel === false) return message.channel.send(`You can only use that command in ${commands[commandIndex].channelTypesAllowed} channels!`)  

  if(commands[commandIndex].enabled !== true) return message.channel.send(`The **${command}** command is currently disabled.`);

  commands[commandIndex].asyncFunction(message)
})

client.login(process.env['token'])
