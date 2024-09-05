const { EmbedBuilder } = require("discord.js")
const { prefix, color } = require("../../ayarlar.js")
exports.run = async (client, message, args) => {

    let komutlar = client.commands.map(e => `**${e.help.name}** - __${e.help.description}__`).join("\n") || "Komutlar bulunamadı."
    let embed = new EmbedBuilder()
        .setAuthor({ name: `DarknessCode - Partner Bot`, iconURL: message.guild.iconURL() })
        .setColor(color)
        .setDescription(komutlar)
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
}
exports.conf = {
    aliases: ["y"]
}
exports.help = {
    name: "yardım",
    description: "Yardım menüsünü gösterir."
}