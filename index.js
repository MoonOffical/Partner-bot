const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.js");
const { prefix, color } = require("./ayarlar.js")
const db = require("croxydb")
const Discord = require("discord.js")

const discordTranscripts = require('discord-html-transcripts');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { error } = require("console");
const { resolveSrv } = require("dns/promises");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

    client.user.setPresence({ activities: [{ name: 'Moon' }] });

    console.log('_________________________________________');
    console.log(`Kullanıcı İsmi     : ${client.user.username}`);
    console.log(`Sunucular          : ${client.guilds.cache.size}`);
    console.log(`Kullanıcılar       : ${client.users.cache.size}`);
    console.log(`Prefix             : ${ayarlar.prefix}`);
    console.log(`Durum              : Bot Çevrimiçi!`);
    console.log('_________________________________________');
});

fs.readdir("./komutlar/GENEL", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/GENEL/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})

fs.readdir("./komutlar/PARTNER", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/PARTNER/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})
////////////////////////////////////////// MAİN COMMANDS ////////////////////////////////////////

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId.startsWith('partnertext')) {
        const modal = new ModalBuilder()
            .setCustomId("ptextmodal")
            .setTitle("DarknessCode")
        const text = new TextInputBuilder()
            .setCustomId("ptext")
            .setLabel("Partner Text Gir")
            .setMinLength(1)
            .setMaxLength(1250)
            .setPlaceholder("Bir partner texti gir.")
            .setStyle(TextInputStyle.Paragraph)
        const row = new ActionRowBuilder().addComponents(text)
        modal.addComponents(row)
        await interaction.showModal(modal)
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "ptextmodal") {
            let ptext = interaction.fields.getTextInputValue('ptext')
            db.set(`${interaction.guild.id}_partnertext`, ptext)
            await interaction.reply({ content: `Partner textin ayarlandı!`, ephemeral: true })
        }
    }
})

client.on("interactionCreate", async interaction => {
    if (interaction.customId.startsWith('pkabul')) {
        let data = db.get(`${interaction.guild.id}_${interaction.message.id}_partnerlikisteği`)
        let karsıid = data.id;
        let karsıtext = db.fetch(`${karsıid}_partnertext`)
        let karsıkanall = db.fetch(`${karsıid}_partnerkanal`)
        let karsılogg = db.fetch(`${karsıid}_partnerlog`)
        let ptext = db.fetch(`${interaction.guild.id}_partnertext`)
        let pkanal = db.fetch(`${interaction.guild.id}_partnerkanal`)
        let g = client.guilds.cache.get(karsıid)
        let partnerkanal = interaction.guild.channels.cache.get(pkanal)
        let karsıkanal = client.channels.cache.get(karsıkanall)
        let karsılog = client.channels.cache.get(karsılogg)
        await interaction.update({ components: [] })
        await interaction.followUp({ content: `Partnerlik isteğini kabul ettin.`, ephemeral: true })
        karsıkanal.send({ content: `${ptext}` })
        partnerkanal.send({ content: `${karsıtext}` })

        await karsılog.send({
            embeds: [{
                description: `\`${interaction.guild.name}\` adlı sunucuya atmış olduğunuz partnerlik isteği \`${interaction.user.username}\` tarafından kabul edildi.!`
            }]
        })
        db.delete(`${interaction.guild.id}_${interaction.message.id}_partnerlikisteği`)
    }

    if (interaction.customId.startsWith('pred')) {
        let karsıid = db.fetch(`${interaction.guild.id}_${interaction.message.id}_partnerlikisteği`)
        let karsılogg = db.fetch(`${karsıid}_partnerlog`)
        let g = client.guilds.cache.get(karsıid)
        let karsılog = g.channels.cache.get(karsılogg)

        interaction.update({
            embeds: [{
                author: {
                    name: `${client.user.username} - Partner Sistemi`, iconURL: g.iconURL()
                },

                description: `\`${g.name}\` adlı sunucudan gelen partnerlik isteği \`${interaction.user.username}\` tarafından reddedildi!`,

                footer: {
                    text: `Bu komutu kullanan kullanıcı ${interaction.user.username}`, iconURL: g.iconURL()

                },
                color: color

            }], components: []
        })

        karsılog.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Partner Sistemi`, iconURL: g.iconURL()
                },

                description: `\`${interaction.guild.name}\` adlı sunucuya atmış olduğunuz partnerlik isteği \`${interaction.user.username}\` tarafından reddedildi.!`,

                footer: {
                    text: `Bu komutu kullanan kullanıcı ${interaction.user.username}`, iconURL: g.iconURL()
                },
                color: color

            }]
        })
        db.delete(`${interaction.guild.id}_${interaction.message.id}_partnerlikisteği`)

    }
})
