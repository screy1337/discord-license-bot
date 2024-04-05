const mysql = require('mysql');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const connection = mysql.createConnection({
  user: 'loader',
  host: 'localhost',
  password: '',
  database: 'keys'
});

const allowedRole = ''; 

connection.connect(err => {
  if (err) {
    console.error('MySQL bağlantısı başarısız oldu:', err);
    return;
  }
  console.log('MySQL bağlantısı başarıyla kuruldu');
});

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
  if (!message.member.roles.cache.has(allowedRole)) return;

  if (message.content.startsWith('/ekle')) {
    const args = message.content.slice('/ekle'.length).trim().split(/ +/);
    const anahtar = args.shift().toLowerCase();
    const bitmeSuresi = args.shift();
    const hwid = args.shift();

    connection.query('INSERT INTO anahtarlar (Anahtar, SonKullanmaTarihi, KullanildiMi, HWID) VALUES (?, ?, 0, ?)', [anahtar, bitmeSuresi, hwid], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      const successMessage = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Anahtar Oluşturuldu')
        .setDescription(`Anahtar: ${anahtar}\nBitiş Süresi: ${bitmeSuresi}\nSon Kullanım Tarihi: Henüz kullanılmadı.`);

      message.channel.send({ embeds: [successMessage] });
    });
  } else if (message.content.startsWith('/sil')) {
    const anahtar = message.content.slice('/sil'.length).trim();

    connection.query('DELETE FROM anahtarlar WHERE Anahtar = ?', [anahtar], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      if (results.affectedRows > 0) {
        const successMessage = new Discord.MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Anahtar Başarıyla Silindi')
          .setDescription(`${anahtar} key başarıyla silindi.`);

        message.channel.send({ embeds: [successMessage] });
      } else {
        const errorMessage = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Hata')
          .setDescription(`${anahtar} key bulunamadı veya silinemedi.`);

        message.channel.send({ embeds: [errorMessage] });
      }
    });
  } else if (message.content === '/kontrol') {
    connection.query('SELECT 1', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      const successMessage = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Veritabanına Erişim Sağlandı')
        .setDescription('Veritabanına başarıyla erişildi.');

      message.channel.send({ embeds: [successMessage] });
    });
  } else if (message.content.startsWith('/süre-ekle')) {
    const args = message.content.slice('/süre-ekle'.length).trim().split(/ +/);
    const anahtar = args.shift().toLowerCase();
    const gunSayisi = parseInt(args.shift());

    if (isNaN(gunSayisi) || gunSayisi <= 0) {
      const errorMessage = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Hata')
        .setDescription('Geçersiz gün sayısı.');

      return message.channel.send({ embeds: [errorMessage] });
    }

    connection.query('UPDATE anahtarlar SET SonKullanmaTarihi = DATE_ADD(SonKullanmaTarihi, INTERVAL ? DAY) WHERE Anahtar = ?', [gunSayisi, anahtar], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      if (results.affectedRows > 0) {
        const successMessage = new Discord.MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Süre Başarıyla Eklendi')
          .setDescription(`${anahtar} anahtarına ${gunSayisi} gün süre eklendi.`);

        message.channel.send({ embeds: [successMessage] });
      } else {
        const errorMessage = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Hata')
          .setDescription(`${anahtar} anahtarı bulunamadı.`);

        message.channel.send({ embeds: [errorMessage] });
      }
    });
  } else if (message.content.startsWith('/toplusüreekle')) {
    const args = message.content.slice('/toplusüreekle'.length).trim().split(/ +/);
    const gunSayisi = parseInt(args.shift());

    if (isNaN(gunSayisi) || gunSayisi <= 0) {
      const errorMessage = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Hata')
        .setDescription('Geçersiz gün sayısı.');

      return message.channel.send({ embeds: [errorMessage] });
    }

    connection.query('UPDATE anahtarlar SET SonKullanmaTarihi = DATE_ADD(SonKullanmaTarihi, INTERVAL ? DAY)', [gunSayisi], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      const successMessage = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle('Toplu Süre Ekleme')
        .setDescription(`${gunSayisi} gün tüm anahtarlara başarıyla eklendi.`);

      message.channel.send({ embeds: [successMessage] });
    });
  } else if (message.content === '/komutlar') {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Komutlar')
      .addFields(
        { name: '/ekle', value: 'Örnek: /ekle ornek 0000.00.00 hwid', inline: false },
        { name: '/sil', value: 'Örnek: /sil ornek', inline: false },
        { name: '/süre-ekle', value: 'Örnek: /süre-ekle ornek 1', inline: false },
        { name: '/toplusüreekle', value: 'Örnek: /toplusüreekle 1', inline: false },
        { name: '/kontrol', value: 'Veritabanına erişimi gösterir', inline: false }
      );
    message.channel.send({ embeds: [embed] });
  }
});

client.login('TO');
