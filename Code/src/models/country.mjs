export default class Country { 
    code;
    name;
    continent;
    region;
    surfaceArea;
    indepYear;
    population;
    lifeExpectancy;
    GNP;
    GNPOld;
    localName;
    governmentForm;
    headOfState;
    capital;
    code2;

    constructor(code, name, continent, region, surfaceArea, indepYear, population, lifeExpectancy, GNP, 
        GNPOld, localName, governmentForm, headOfState, capital, code2) {
        this.code = code;
        this.name = name;
        this.continent = continent
        this.region = region;
        this.surfaceArea = surfaceArea;
        this.indepYear = indepYear;
        this.population = population;
        this.lifeExpectancy = lifeExpectancy;
        this.GNP = GNP;
        this.GNPOld = GNPOld;
        this.localName = localName;
        this.governmentForm = governmentForm;
        this.headOfState = headOfState;
        this.capital = capital;
        this.code2 = code2;

        }

}