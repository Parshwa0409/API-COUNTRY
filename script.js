let allCountriesList = [];

let dataFetched = false;

const countryContent = document.querySelector("div.row.country-content");

class Country {
  constructor(png, regex, official, capital, languages) {
    this.png = png;
    this.regex = regex;
    this.official = official;
    this.capital = capital;
    this.languages = languages;
  }
}

async function getResponse() {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,capital,languages,postalCode",
    {
      method: "GET",
    }
  );

  const data = await response.json(); // Extracting data as a JSON Object from the response

  for (let {
    flags: { png },
    postalCode: { regex },
    name: { official },
    capital,
    languages,
  } of data) {
    let newCountry = new Country(png, regex, official, capital, languages);

    allCountriesList.push(newCountry);
  }

  dataFetched = true;
}

async function searchWithPostalCode(postalCode) {
  !dataFetched ? await getResponse() : null;

  let filteredCountries = [];

  filteredCountries = allCountriesList.filter((country) =>
    country.regex !== undefined ? postalCode.match(country.regex) : false
  );

  return filteredCountries;
}

function createCountryContainer(png, official, capital, languages) {
  const countryToBeAddedDiv = document.createElement("div");
  countryToBeAddedDiv.classList.add("col-lg-3");
  countryToBeAddedDiv.classList.add("col-md-6");

  countryToBeAddedDiv.innerHTML = `
        <div class="country-item">
          <img src=${png} alt="" />
          <h1>${official}</h1>
          <h3>Capital: ${capital}</h3>
          <h3>Language: ${languages[Object.keys(languages)[0]]}</h3>
        </div>`;

  return countryToBeAddedDiv;
}

async function addCountries(postalCode) {
  countryContent.innerHTML = "";

  const requiredContries = await searchWithPostalCode(postalCode);

  if (requiredContries.length === 0) {
    alert("no such countries");
    return;
  }

  for (let { png, official, capital, languages } of requiredContries) {
    const countryToBeAdded = createCountryContainer(
      png,
      official,
      capital,
      languages
    );
    countryContent.append(countryToBeAdded);
  }
}

demoCode = `
      <div class="col-lg-3 col-md-6">
        <div class="country-item">
          <img src="https://flagcdn.com/w320/cy.png" alt="" />
          <h3>Republic of Cyprus</h3>
          <h3>Capital: Nicosia</h3>
          <h3>Language: Greek</h3>
        </div>
      </div>`;

//======================================

document.querySelector("#search-btn").addEventListener("click", () => {
  let postalCode = document.querySelector("#postal-code-input").value;

  postalCode === ""
    ? alert("Postal Code cannot be empty!!!")
    : addCountries(postalCode);

  document.querySelector("#postal-code-input").value = "";
});
