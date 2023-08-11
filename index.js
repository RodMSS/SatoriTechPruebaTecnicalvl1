async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchCharacters(locationUrl) {
    const locationData = await fetchData(locationUrl);
    const residents = locationData.residents.slice(0, 5);

    const charactersContainer = document.getElementById("tableRow");
    charactersContainer.innerHTML = "";

    for (const residentUrl of residents) {
        const residentData = await fetchData(residentUrl);

        const characterDiv = document.createElement("td");
        characterDiv.classList.add("character");
        characterDiv.innerHTML = `
            <div>
                <img src="${residentData.image}" alt="${residentData.name}" width="100">
                <p>${residentData.name}</p>
                <p>Status: ${residentData.status}</p>
                <p>Species: ${residentData.species}</p>
                <p>Origin: ${residentData.origin.name}</p>
                <p>Episodes: ${residentData.episode.slice(0, 3).map(ep => `<a href="${ep}" target="_blank">${ep}</a>`).join(', ')}</p>
            </div>
        `;

        characterDiv.addEventListener("click", () => openModal(residentData));
        charactersContainer.appendChild(characterDiv);
    }
}

function openModal(characterData) {
    const modal = document.getElementById("modal");
    modal.innerHTML = `
        <h2>${characterData.name}</h2>
        <p>Status: ${characterData.status}</p>
        <p>Species: ${characterData.species}</p>
        <p>Origin: ${characterData.origin.name}</p>
        <p>Episodes: ${characterData.episode.slice(0, 3).map((ep, index) => `<a href="${ep}" target="_blank">Episode ${index + 1}</a>`).join(', ')}</p>
        <img src="${characterData.image}" alt="${characterData.name}" width="200">
    `;
    modal.style.display = "block";
}

async function main() {
    const locationId = 1; // You can change this to the desired location ID
    const locationUrl = `https://rickandmortyapi.com/api/location/${locationId}`;
    const locationData = await fetchData(locationUrl);

    fetchCharacters(locationUrl);

    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        fetchCharacters(locationUrl, searchTerm);
    });
}

main();
