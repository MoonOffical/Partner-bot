const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");
const { prefix, color } = require("../../ayarlar.js")
exports.run = async (client, message, args) => {
    let partnerLog = db.get(`${message.guild.id}_partnerlog`);
    let karşıyetkili = db.get(`${args[0]}_partneryetkili`)
    let partnerText = db.get(`${message.guild.id}_partnertext`);
    if (!db.get(`${message.guild.id}_partnerdurum`)) {
        return message.reply({ content: `Partnerlik durumun kapalı.` })
    }

    let karşısw = client.guilds.cache.get(args[0]);
    if (!karşısw) return message.reply("Geçersiz sunucu idsi.")

    const partnerEmbed = new EmbedBuilder()
        .setTitle("DarknessCode - Partner Bot")
        .setColor(color)
        .setDescription(`**Gönderen Sunucu:** ${message.guild.name} - (${message.guild.id})\n` +
            `**Sahibi:** ${message.guild.ownerId}\n` +
            `**Üye Sayısı:** ${message.guild.memberCount}\n\n` +
            `**Partnerlik Texti:**\n\`\`\`\n${partnerText}\`\`\``)
        .setTimestamp()

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pkabul')
                .setLabel('Kabul Et')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('pred')
                .setLabel('Reddet')
                .setStyle(ButtonStyle.Danger)
        );

    const karşılog = karşısw.channels.cache.get(db.get(`${args[0]}_partnerlog`));
    if (!karşılog) return message.reply("Karşı Sunucunun partner log kanalı bulunamadı!");

    karşılog.send({
        content: `<@&${karşıyetkili}>`,
        embeds: [partnerEmbed],
        components: [actionRow]
    }).then(e => {
        let d = {
            id: message.guild.id,
            mesajid: e.id
        }
        db.set(`${args[0]}_${e.id}_partnerlikisteği`, d)
    })
    message.channel.send({ content: `Partnerlik isteği gönderildi.` })
};

exports.conf = {
    aliases: ["partnerol"]
};

exports.help = {
    name: "partner-ol",
    description: "Bir sunucuyla partner olursun."
};
