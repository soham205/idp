interface ILogoDetails {
  url: string;
  mediaType: string;
  base64: boolean;
  attachFromUrl: (url: any, mediaType: any) => void;
  embedFromFile: (fileLocation: any) => void;
  embedFromString: (base64String: any, mediaType: any) => void;
}

interface IPhotoDetails {
  url: string;
  mediaType: string;
  base64: boolean;
  attachFromUrl: (url: any, mediaType: any) => void;
  embedFromFile: (fileLocation: any) => void;
  embedFromString: (base64String: any, mediaType: any) => void;
}

interface ISocialUrls {
  facebook: string;
  linkedIn: string;
  twitter: string;
  flickr: string;
}

export interface IMailingAddressDetails {
  label: string;
  street: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryRegion: string;
}

export interface IVCardDetails {
  /**
   * Specifies a value that represents a persistent, globally unique identifier associated with the vCard
   * @type {String}
   */
  uid: string;
  /**
   * Date of birth
   * @type {Datetime}
   */
  birthday: string;
  /**
   * Cell phone number
   * @type {String}
   */
  cellPhone: string;
  /**
   * Other cell phone number or pager
   * @type {String}
   */
  pagerPhone: string;
  /**
   * The address for private electronic mail communication
   * @type {String}
   */
  email: string;
  /**
   * The address for work-related electronic mail communication
   * @type {String}
   */
  workEmail: string;
  /**
   * First name
   * @type {String}
   */
  firstName: string;
  /**
   * Formatted name string associated with the vCard object (will automatically populate if not set)
   * @type {String}
   */
  formattedName: string;
  /**
   * Gender.
   * @type {String} Must be M or F for Male or Female
   */
  gender: string;
  /**
   * Home mailing address
   * @type {object}
   */

  /**
   * Home phone
   * @type {String}
   */
  homePhone: string;
  /**
   * Home facsimile
   * @type {String}
   */
  homeFax: string;
  /**
   * Last name
   * @type {String}
   */
  lastName: string;
  /**
   * Logo
   * @type {object}
   */
  logo: ILogoDetails;
  /**
   * Middle name
   * @type {String}
   */
  middleName: string;
  /**
   * Prefix for individual's name
   * @type {String}
   */
  namePrefix: string;
  /**
   * Suffix for individual's name
   * @type {String}
   */
  nameSuffix: string;
  /**
   * Nickname of individual
   * @type {String}
   */
  nickname: string;
  /**
   * Specifies supplemental information or a comment that is associated with the vCard
   * @type {String}
   */
  note: string;
  /**
   * The name and optionally the unit(s) of the organization associated with the vCard object
   * @type {String}
   */
  organization: string;
  /**
   * Individual's photo
   * @type {object}
   */
  photo: IPhotoDetails;
  /**
   * The role, occupation, or business category of the vCard object within an organization
   * @type {String}
   */
  role: string;
  /**
   * Social URLs attached to the vCard object (ex: Facebook, Twitter, LinkedIn)
   * @type {String}
   */
  socialUrls: ISocialUrls;
  /**
   * A URL that can be used to get the latest version of this vCard
   * @type {String}
   */
  source: string;
  /**
   * Specifies the job title, functional position or function of the individual within an organization
   * @type {String}
   */
  title: string;
  /**
   * URL pointing to a website that represents the person in some way
   * @type {String}
   */
  url: string;
  /**
   * URL pointing to a website that represents the person's work in some way
   * @type {String}
   */
  workUrl: string;
  /**
   * Work mailing address
   * @type {object}
   */
  workAddress: IMailingAddressDetails;
  /**
   * Work phone
   * @type {String}
   */
  workPhone: string;
  /**
   * Work facsimile
   * @type {String}
   */
  workFax: "";
  /**
   * anniversary date string
   * @type {String}
   */
  version: String;
  anniversary: string;
  /**
   * anniversary date string
   * @type {String}
   */
  otherEmail: string,
  otherPhone: string

  getFormattedString: () => string;
}
