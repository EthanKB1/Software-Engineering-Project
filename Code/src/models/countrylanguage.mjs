export default class CountryLanguage {
    countryCode;
    language;
    isOfficial;
    percentage;

    constructor(countryCode, language, isOfficial, percentage) {
    this.countrycode = countryCode;
    this.language = language;
    this.isOfficial = isOfficial;
    this.percentage = percentage;

    }

}