const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
exports.run = async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ content: `Bu komutu kullanmak için yetkin yok.` })
    }
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("partnertext")
                .setLabel("Text Ayarla")
                .setStyle(ButtonStyle.Secondary)
        )
    await message.reply({
        embeds: [{
            title: "Darkness Code - Partner Bot",
            description: "Partner texti ayarlamak için butona bas.",
            timestamp: new Date().toISOString(),
            color: color
        }], components: [row]
    })
}
exports.conf = {
    aliases: ["partnertext"]
}
exports.help = {
    name: "partner-text",
    description: "Partner textini ayarlarsın."
}