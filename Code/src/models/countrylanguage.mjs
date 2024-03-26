export default class CountryLanguage {
    countrycode;
    language;
    isOfficial;
    percentage;

    constructor(countrycode, language, isofficial, percentage) {
    this.countrycode = countrycode;
    this.language = language;
    this.isOfficial = isofficial;
    this.percentage = percentage;

    }

}