import { IVCardDetails } from "./interfaces";

/**
 * Encode string
 * @param  {String}     value to encode
 * @return {String}     encoded string
 */
function e(value: string) {
  if (value) {
    if (typeof value !== "string") {
      value = "" + value;
    }
    return value
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }
  return "";
}
/**
 * Return new line characters
 * @return {String} new line characters
 */
function nl() {
  return "\r\n";
}

/**
 * Convert date to YYYYMMDD format
 * @param  {Date}       date to encode
 * @return {String}     encoded date
 */
function YYYYMMDD(date: Date) {
  return (
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2)
  );
}

function getFormattedPhoto(
  photoType: string,
  url: string,
  mediaType: string,
  base64: boolean
) {
  var params;
  params = base64 ? ";ENCODING=b;MEDIATYPE=image/" : ";MEDIATYPE=image/";

  var formattedPhoto = photoType + params + mediaType + ":" + e(url) + nl();
  return formattedPhoto;
}

export function getFormattedString(vCard: IVCardDetails) {
  var formattedVCardString = "";
  formattedVCardString += "BEGIN:VCARD" + nl();
  var encodingPrefix = ";CHARSET=UTF-8";
  formattedVCardString += `VERSION:${vCard.version}` + nl()

  var formattedName = vCard.formattedName;
  if (!formattedName) {
    formattedName = "";
    [vCard.firstName, vCard.middleName, vCard.lastName].forEach(function (
      name
    ) {
      if (name) {
        if (formattedName) {
          formattedName += " ";
        }
      }
      formattedName += name;
    });
  }
  formattedVCardString += "FN" + encodingPrefix + ":" + e(formattedName) + nl();
  formattedVCardString +=
    "N" +
    encodingPrefix +
    ":" +
    e(vCard.lastName) +
    ";" +
    e(vCard.firstName) +
    ";" +
    e(vCard.middleName) +
    ";" +
    e(vCard.namePrefix) +
    ";" +
    e(vCard.nameSuffix) +
    nl();
  if (vCard.nickname) {
    formattedVCardString +=
      "NICKNAME" + encodingPrefix + ":" + e(vCard.nickname) + nl();
  }
  if (vCard.gender) {
    formattedVCardString += "GENDER:" + e(vCard.gender) + nl();
  }
  if (vCard.uid) {
    formattedVCardString += "UID" + encodingPrefix + ":" + e(vCard.uid) + nl();
  }
  if (vCard.birthday) {
    formattedVCardString += "BDAY:" + YYYYMMDD(new Date(vCard.birthday)) + nl();
  }
  if (vCard.anniversary) {
    formattedVCardString +=
      "ANNIVERSARY:" + YYYYMMDD(new Date(vCard.anniversary)) + nl();
  }
  if (vCard.email) {
    let emailArray: string[] = [];
    if (!Array.isArray(vCard.email)) {
      emailArray = [vCard.email];
    }
    emailArray.forEach(function (address: string) {
      formattedVCardString +=
        "EMAIL" + encodingPrefix + ";type=HOME:" + e(address) + nl();
    });
  }

  if (vCard.workEmail) {
    let emailArray: string[] = [];
    if (!Array.isArray(vCard.workEmail)) {
      emailArray = [vCard.workEmail];
    }
    emailArray.forEach(function (address: string) {
      formattedVCardString +=
        "EMAIL" + encodingPrefix + ";type=WORK:" + e(address) + nl();
    });
  }

  if (vCard.otherEmail) {
    let otherEmailArray: string[] = [];
    if (!Array.isArray(vCard.otherEmail)) {
      otherEmailArray = [vCard.otherEmail];
    }
    otherEmailArray.forEach(function (address: string) {
      formattedVCardString +=
        "EMAIL" + encodingPrefix + ";type=OTHER:" + e(address) + nl();
    });
  }

  if (vCard.logo.url) {
    formattedVCardString += getFormattedPhoto(
      "LOGO",
      vCard.logo.url,
      vCard.logo.mediaType,
      vCard.logo.base64
    );
  }
  if (vCard.photo.url) {
    formattedVCardString += getFormattedPhoto(
      "PHOTO",
      vCard.photo.url,
      vCard.photo.mediaType,
      vCard.photo.base64
    );
  }

  if (vCard.cellPhone) {
    let cellPhoneArray: string[] = [];
    if (!Array.isArray(vCard.cellPhone)) {
      cellPhoneArray = [vCard.cellPhone];
    }
    cellPhoneArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;TYPE=CELL:' + e(number) + nl();
    });
  }

  if (vCard.pagerPhone) {
    let pagerPhoneArray: string[] = [];
    if (!Array.isArray(vCard.pagerPhone)) {
      pagerPhoneArray = [vCard.pagerPhone];
    }
    pagerPhoneArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;VALUE=uri;TYPE="pager,cell":tel:' + e(number) + nl();
    });
  }

  if (vCard.homePhone) {
    let homePhoneArray: string[] = [];
    if (!Array.isArray(vCard.homePhone)) {
      homePhoneArray = [vCard.homePhone];
    }
    homePhoneArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;VALUE=uri;TYPE="voice,home":tel:' + e(number) + nl();
    });
  }

  if (vCard.workPhone) {
    let workPhoneArray: string[] = [];
    if (!Array.isArray(vCard.workPhone)) {
      workPhoneArray = [vCard.workPhone];
    }
    workPhoneArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;TYPE=WORK:' + e(number) + nl();
    });
  }

  if (vCard.homeFax) {
    let homeFaxArray: string[] = []
    if (!Array.isArray(vCard.homeFax)) {
      homeFaxArray = [vCard.homeFax];
    }
    homeFaxArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;VALUE=uri;TYPE="fax,home":tel:' + e(number) + nl();
    });
  }

  if (vCard.workFax) {
    let workFax: string[] = []
    if (!Array.isArray(vCard.workFax)) {
      workFax = [vCard.workFax];
    }
    workFax.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;VALUE=uri;TYPE="fax,work":tel:' + e(number) + nl();
    });
  }

  if (vCard.otherPhone) {
    let otherPhoneArray: string[] = [];
    if (!Array.isArray(vCard.otherPhone)) {
      otherPhoneArray = [vCard.otherPhone];
    }
    otherPhoneArray.forEach(function (number: string) {
      formattedVCardString +=
        'TEL;VALUE=uri;TYPE="voice,other":tel:' + e(number) + nl();
    });
  }

  // [
  //   {
  //     details: vCard.homeAddress,
  //     type: "HOME",
  //   },
  //   {
  //     details: vCard.workAddress,
  //     type: "WORK",
  //   },
  // ].forEach(function (address) {
  //   formattedVCardString += getFormattedAddress(encodingPrefix, address);
  // });

  if (vCard.title) {
    formattedVCardString +=
      "TITLE" + encodingPrefix + ":" + e(vCard.title) + nl();
  }
  if (vCard.role) {
    formattedVCardString +=
      "ROLE" + encodingPrefix + ":" + e(vCard.role) + nl();
  }
  if (vCard.organization) {
    formattedVCardString +=
      "ORG" + encodingPrefix + ":" + e(vCard.organization) + nl();
  }
  if (vCard.url) {
    formattedVCardString += "URL" + encodingPrefix + ":" + e(vCard.url) + nl();
  }
  if (vCard.workUrl) {
    formattedVCardString +=
      "URL;type=WORK" + encodingPrefix + ":" + e(vCard.workUrl) + nl();
  }
  if (vCard.note) {
    formattedVCardString +=
      "NOTE" + encodingPrefix + ":" + e(vCard.note) + nl();
  }

  if (vCard.socialUrls) {
    for (const [socialMediaPlatform, socialMediaUrl] of Object.entries(
      vCard.socialUrls
    )) {

      if (socialMediaUrl) {
        formattedVCardString +=
          "X-SOCIALPROFILE" +
          encodingPrefix +
          ";TYPE=" +
          socialMediaPlatform +
          ":" +
          e(socialMediaUrl) +
          nl();
      }
    }
  }

  if (vCard.source) {
    formattedVCardString +=
      "SOURCE" + encodingPrefix + ":" + e(vCard.source) + nl();
  }
  formattedVCardString += "REV:" + new Date().toISOString() + nl();

  formattedVCardString += "END:VCARD" + nl();

  return formattedVCardString;
}
