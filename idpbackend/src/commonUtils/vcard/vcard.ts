import { IVCardDetails } from "./interfaces";
import { getFormattedString } from "./stringFormatter";

export const vCard = function ():IVCardDetails {

  function getPhoto() {
    return {
      url: '',
      mediaType: '',
      base64: false,
      /**
       * Attach a photo from a URL
       * @param  {string} url       URL where photo can be found
       * @param  {string} mediaType Media type of photo (JPEG, PNG, GIF)
       */
      attachFromUrl: function (url:string, mediaType:string) {
        // this.url = url;
        // this.mediaType = mediaType;
        // this.base64 = false;
      },
      /**
       * Embed a photo from a file using base-64 encoding (not implemented yet)
       * @param  {string} filename
       */
      embedFromFile: function (fileLocation:string) {
        // var fs = require("fs");
        // var path = require("path");
        // this.mediaType = path
        //   .extname(fileLocation)
        //   .toUpperCase()
        //   .replace(/\./g, '');
        // var imgData = fs.readFileSync(fileLocation);

        // this.url = imgData.toString("base64");
        // this.base64 = true;
      },
      /**
       * Embed a photo from a base-64 string
       * @param  {string} base64String
       */
      embedFromString: function (base64String:string, mediaType:string) {
        this.mediaType = mediaType;
        this.url = base64String;
        this.base64 = true;
      },
    };
  }

  function getMailingAddress() {
    return {
      /**
       * Represents the actual text that should be put on the mailing label when delivering a physical package
       * @type {String}
       */
      label: '',
      /**
       * Street address
       * @type {String}
       */
      street: '',
      /**
       * City
       * @type {String}
       */
      city: '',
      /**
       * State or province
       * @type {String}
       */
      stateProvince: '',
      /**
       * Postal code
       * @type {String}
       */
      postalCode: '',
      /**
       * Country or region
       * @type {String}
       */
      countryRegion: '',
    };
  }

  function getSocialUrls() {
    return {
      facebook: '',
      linkedIn: '',
      twitter: '',
      flickr: '',
    };
  }

  return {
    uid: '',
    birthday:'', 
    cellPhone: '',
    pagerPhone: '',
    email: '',
    workEmail: '',
    firstName: '',
    formattedName: '',
    gender: '',
    homePhone: '',
    homeFax: '',
    lastName: '',
    logo: getPhoto(),
    middleName: '',
    namePrefix: '',
    nameSuffix: '',
    nickname: '',
    note: '',
    organization: '',
    photo: getPhoto(),
    role: '',
    socialUrls: getSocialUrls(),
    source: '',
    title: '',
    url: '',
    workUrl: '',
    workPhone: '',
    workFax: '',
    version:'3.0',
    getFormattedString: function (): string {
      // const vCardFormatter = require("./lib/vCardFormatter");
      return getFormattedString(this);
    },
    workAddress: {
      label:'',
      street:'',
      city:'',
      stateProvince:'',
      postalCode:' ',
      countryRegion:' '
    },
    anniversary:'',
    otherEmail:'',
    otherPhone:''
  };
};

