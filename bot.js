require('dotenv').config();
const { handleRefundCommand } = require('./refundScript');
const { handleTinderCommand } = require('./tinderScript'); // Import the handleTinderCommand function from the script file


const { Client, GatewayIntentBits, EmbedBuilder, Embed } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



client.on('ready', () => {
    console.log('bot is ready');
})


client.on('messageCreate', (message) => {
    if(message.content.startsWith('!help')){
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // You can use any color code or name
            .setTitle('Tinder Bot Commands')
            .setDescription('Here are some useful commands for the Tinder Bot:')
            .addFields(
                {name:'Create a Support Ticket', value: 'Use `!sb <email>` to create a ticket with Tinder Support to lift shadowban.'},
                {name: 'Request a Refund', value:'Use `!refund <email> <orderID>` to create a refund request for an order.'}
            )
            .setFooter({ text: 'Tinder Ticket Bot - Powered by MM'})
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
    else if (message.content.startsWith('!sb ')) {
        const email = message.content.slice('!sb '.length).trim();
        handleTinderCommand(email);
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // You can use any color code or name
            .setTitle('Tinder Bot Commands')
            .addFields(
                {name:'Successfully Submitted a Ticket!', value: `You just submitted a shadowban lift ticket for ${email}.`},
            )
            .setFooter({ text: 'Tinder Ticket Bot - Powered by MM'})
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
    else if (message.content.startsWith('!refund ')){
        const email = message.content.split(' ')[1]
        const orderID = message.content.split(' ')[2]
        console.log(email)
        console.log(orderID)
        handleRefundCommand(email,orderID);
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // You can use any color code or name
            .setTitle('Tinder Bot Commands')
            .addFields(
                {name:'Successfully Submitted a Ticket!', value: `You just submitted a refund request ticket for ${email} and Order ID ${orderID}.`},
            )
            .setFooter({ text: 'Tinder Ticket Bot - Powered by MM'})
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
    
});

client.login(process.env.DISCORD_BOT_ID);