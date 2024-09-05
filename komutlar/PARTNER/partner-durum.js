const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
const db = require("croxydb")
exports.run = async (client, message, args) => {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply({ content: `Bu komutu kullanmak için yetkin yok.` })
    }
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("partnerdurum")
                .setLabel("Durum")
                .setStyle(ButtonStyle.Secondary)
        )
    let embed = await message.reply({
        embeds: [{
            title: "Darkness Code - Partner Bot",
            description: "Partner durumu açmak/kapatmak için butona bas.",
            timestamp: new Date().toISOString(),
            color: color
        }], components: [row]
    })
    let collector = embed.createMessageComponentCollector()

    collector.on("collect", async i => {
        if (i.customId === "partnerdurum") {
            if (db.get(`${message.guild.id}_partnerdurum`)) {
                db.delete(`${message.guild.id}_partnerdurum`)
                await i.reply({ content: `Partner durumu kapatıldı.`, ephemeral: true })
            } else {
                if (!db.get(`${message.guild.id}_partnerkanal`)) {
                    return i.reply({ content: `Partner kanalı ayarlanmamış.`, ephemeral: true })
                }
                if (!db.get(`${message.guild.id}_partnerlog`)) {
                    return i.reply({ content: `Partner log kanalı ayarlanmamış.`, ephemeral: true })
                }
                if (!db.get(`${message.guild.id}_partneryetkili`)) {
                    return i.reply({ content: `Partner yetkili rolü ayarlanmamış.`, ephemeral: true })
                }
                db.set(`${message.guild.id}_partnerdurum`, true)
                await i.reply({ content: `Partner durumu aktif edildi.`, ephemeral: true })
            }
        }
    })
}
exports.conf = {
    aliases: ["partnerdurum"]
}
exports.help = {
    name: "partner-durum",
    description: "Partner durum açar/kaparsın."
}