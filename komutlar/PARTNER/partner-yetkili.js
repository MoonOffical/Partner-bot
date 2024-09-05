const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ content: `Bu komutu kullanmak için yetkin yok.` })
    }
    let rol = message.mentions.roles.first()
    if (!rol) {
        return message.reply({ content: `Bir yetkili rolü etiketlemelisin.` })
    }

    await message.reply({
        embeds: [{
            description: `Başarıyla partner yetkili rolünü ${rol} olarak ayarladım.`
        }]
    })
    db.set(`${message.guild.id}_partneryetkili`, rol.id)

}
exports.conf = {
    aliases: []
}
exports.help = {
    name: "partner-yetkili",
    description: "Partner yetkili rolünü ayarlarsın."
}