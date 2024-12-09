import countries from '../json/location.json'
import countryCodes from '../json/telephone.json'
import CountriesFlags from '../json/Countries.json'
export let FormattedCountryData = []
export let FormattedCountryCodeData = []
export let CountryCodeData = []
for (const [key, value] of Object.entries(countries)) {
    FormattedCountryData.push({value: key, label: value})

}
countryCodes.forEach(code=>{
    FormattedCountryCodeData.push({value:code.dial_code,label:`${code.name}`})
})
CountriesFlags.forEach(code=>{
    CountryCodeData.push({value:code.dial_code,label:`${code.flag} ${code.name}`})
})

export function CountryNameDecode(code){
    for (const key in FormattedCountryData) {
        if (code === FormattedCountryData[key].value) {
            return FormattedCountryData[key].label;
        }
    }

}
export function CountryNameToCodeDecode(abbreviation){
    let currentCountry;
    CountriesFlags.forEach(country=>{
        if(country.code === abbreviation){
            currentCountry = country.dial_code
        }
    })
    return currentCountry;

}
export function CountryCodeToNameDecode(code){
    let currentCountryName;
    CountriesFlags.forEach(country=>{
        if(country.dial_code === code){
            currentCountryName = country.code
        }
    })
    return currentCountryName;

}


export let CountrySelectData = CountriesFlags