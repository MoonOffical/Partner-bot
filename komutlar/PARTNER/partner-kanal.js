const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ content: `Bu komutu kullanmak için yetkin yok.` })
    }
    let kanal = message.mentions.channels.first()
    if (!kanal) {
        return message.reply({ content: `Bir kanal etiketlemelisin.` })
    }

    await message.reply({
        embeds: [{
            description: `Başarıyla partner kanalını ${kanal} olarak ayarladım.`
        }]
    })
    db.set(`${message.guild.id}_partnerkanal`, kanal.id)

}
exports.conf = {
    aliases: []
}
exports.help = {
    name: "partner-kanal",
    description: "Partner kanalını ayarlarsın."
}