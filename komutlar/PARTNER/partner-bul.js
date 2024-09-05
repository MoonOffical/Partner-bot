const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { prefix, color } = require("../../ayarlar.js");
const db = require("croxydb");

exports.run = async (client, message, args) => {
    let guilds = client.guilds.cache.filter(g => db.get(`${g.id}_partnerdurum`));

    if (!guilds.size) {
        return message.reply("Hiçbir sunucuda partner durumu açık değil.");
    }

    let guildsarray = Array.from(guilds.values());
    let s = 0;
    const sayfasayısı = 5;

    const generateEmbed = (s) => {
        const start = s * sayfasayısı;
        const end = start + sayfasayısı;
        const serversToShow = guildsarray.slice(start, end);

        let description = serversToShow.map(guild => {
            const owner = client.users.cache.get(guild.ownerId);
            return `**Sunucu Adı:** ${guild.name}\n**ID:** ${guild.id}\n**Sahibi:** ${owner ? owner.tag : "Bilinmiyor"}\n**Üye Sayısı:** ${guild.memberCount}`;
        }).join('\n\n');

        const embed = new EmbedBuilder()
            .setTitle("Partner Durumu Açık Olan Sunucular")
            .setColor(color)
            .setDescription(description || "Gösterilecek sunucu yok.")
            .setFooter({ text: `Sayfa ${s + 1}/${Math.ceil(guildsarray.length / sayfasayısı)}` });

        return embed;
    };

    const generateButtons = () => {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('geri')
                    .setLabel('Önceki')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(s === 0),
                new ButtonBuilder()
                    .setCustomId('ileri')
                    .setLabel('Sonraki')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(s === Math.ceil(guildsarray.length / sayfasayısı) - 1)
            );
    };

    const msg = await message.channel.send({
        embeds: [generateEmbed(s)],
        components: [generateButtons()]
    });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
        if (i.user.id !== message.author.id) return i.reply({ content: 'Bu komutu yalnızca komutun sahibi kullanabilir!', ephemeral: true });

        if (i.customId === 'ileri') {
            s++;
        } else if (i.customId === 'geri') {
            s--;
        }

        await i.update({
            embeds: [generateEmbed(s)],
            components: [generateButtons()]
        });
    });

    collector.on('end', async () => {
        await msg.edit({
            components: []
        });
    });
};

exports.conf = {
    aliases: ["partnerbul"]
};

exports.help = {
    name: "partner-bul",
    description: "Partner durumu açık olan kanalları listeler."
};
