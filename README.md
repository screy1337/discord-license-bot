Bu kod bir Discord botu oluşturuyor ve bu bot, bir Discord sunucusunda bazı komutları işlemek için tasarlanmıştır. Kod, bir MySQL veritabanına bağlanarak belirli komutları gerçekleştirir. İşlevsellik açısından aşağıdaki özelliklere sahiptir:

Anahtar Ekleme (/ekle): Bu komut, belirli bir anahtarı ve son kullanma tarihini MySQL veritabanına ekler. Komut şu formatta çalışır: /ekle anahtar son_kullanma_tarihi hwid.

Anahtar Silme (/sil): Belirtilen bir anahtarı MySQL veritabanından siler. Komut şu formatta çalışır: /sil anahtar.

Süre Ekleme (/süre-ekle): Bir anahtarın son kullanma tarihine belirli bir süre ekler. Komut şu formatta çalışır: /süre-ekle anahtar gün_sayısı.

Toplu Süre Ekleme (/toplusüreekle): Tüm anahtarların son kullanma tarihlerine belirli bir süre ekler. Komut şu formatta çalışır: /toplusüreekle gün_sayısı.

Veritabanı Bağlantı Kontrolü (/kontrol): Botun MySQL veritabanına erişip erişemediğini kontrol eder.

Komut Listesi (/komutlar): Sunucudaki kullanıcılara mevcut komutları gösterir.

Bu kod, Discord sunucusunda anahtarları yönetmek için kullanılabilir bir bot oluşturmak için kullanılabilir. Ancak, allowedRole değişkeni bir rolün kimlik bilgisini içermelidir; aksi takdirde, belirli bir rolün olup olmadığını kontrol edemezsiniz. Ayrıca, MySQL bağlantı bilgileri doğru olmalıdır (user, host, password, database) ve Discord botunun token'i (client.login) doğru olmalıdır.
