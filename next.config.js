/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    i18n: {
      locales: ["en"],
      defaultLocale: "en"
    },
    staticPageGenerationTimeout: 120,
    images: {
      domains: ['www.bbc.co.uk','www.aljazeera.com','a2.espncdn.com','www.afr.com','www.irishtimes.com','img.etimg.com','timesofindia.indiatimes.com',
              'i.cbc.ca','cbc.ca','www.bbci.co.uk','media.cnn.com','ichef.bbci.co.uk','us.cnn.com','cnnespanol.cnn.com','pyxis.nymag.com',
              'twt-thumbs.washtimes.com','i.insider.com','s.abcnews.com','cdn1.parksmedia.wdprapps.disney.com','live-production.wcms.abc-cdn.net.au',
              'imagesvc.meredithcorp.io','a1.espncdn.com','a3.espncdn.com','a.espncdn.com','static.foxnews.com','cf-images.us-east-1.prod.boltdns.net',
              'a57.foxsports.com','media-cldnry.s-nbcnews.com','s.yimg.com','mmajunkie.usatoday.com','reviewed-com-res.cloudinary.com','ftw.usatoday.com',
              'talksport.com','d.newsweek.com','techcrunch.com','media.zenfs.com','static.independent.co.uk','static.ffx.io','static.toiimg.com',
              'basketball.realgm.com','dwgyu36up6iuz.cloudfront.net','media.wired.com','images.wsj.net','cdn.arstechnica.net',
              'img.buzzfeed.com','post.medicalnewstoday.com','i.natgeofe.com','images.newscientist.com','nextbigfuture.s3.amazonaws.com','static.files.bbci.co.uk'],
    },
}
module.exports = nextConfig
