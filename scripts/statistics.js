// FETCH
let chamber = document.querySelector("title").innerText.split(" ").includes("Senate") ? "senate" : "house";

let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

const init = {
    method: "GET",
    headers: {
        "X-API-Key" : "gOVts9kRKAQhdEKWpmwVO4fZTDC99688zNzzuKOt"
    }
}


fetch(endpoint, init)
    .then(response => response.json())
    .then(data => {
        let members = data.results[0].members;
        
        const statistics = createStatistics(members);
        
        renderTable(statistics.leastEngaged, "least-engaged", true);
        renderTable(statistics.mostEngaged, "most-engaged", true);
        renderTable(statistics.leastLoyal, "least-loyal", false);
        renderTable(statistics.mostLoyal, "most-loyal", false);
        statisticsGlaceTable(statistics, "glace-table", members);

        let loader = document.querySelectorAll(".loader");
        loader = Array.from(loader)
        loader.forEach(load => load.style.display = "none")
    })
    .catch(error => console.error(error))


// PRINCIPAL FUNCTIONS

function createStatistics(array) {
    let statistics = {
        democrats: [],
        republicans: [],
        independents: [],
        leastEngaged: [],
        mostEngaged: [],
        leastLoyal: [],
        mostLoyal: []
    }

    statistics.democrats = array.filter(member => member.party === "D")
    statistics.republicans = array.filter(member => member.party === "R")
    statistics.independents = array.filter(member => member.party === "ID")

    statistics.leastEngaged = createArray(array, "missed_votes", true);
    statistics.mostEngaged = createArray(array, "missed_votes", false);
    statistics.leastLoyal = createArray(array, "votes_with_party_pct", false);
    statistics.mostLoyal = createArray(array, "votes_with_party_pct", true);

    return statistics
}

function createArray(array, element, boolean) {
    let arr =[]
    let membersCopy= [...array]
    membersCopy = membersCopy.filter(member => member.total_votes > 0);

    membersCopy.sort((memberA, memberB) => {
            return boolean ? memberB[element] - memberA[element] : memberA[element] - memberB[element]
    })
    
    let indexLimit = Math.round((membersCopy.length * 0.1) - 1)
    let limit = membersCopy[indexLimit][element]

    arr = membersCopy.filter(member => {
        return boolean ? member[element] >= limit : member[element] <= limit
        })
    return arr 
}

function findAverageVotes(array, element) {
    let sum = 0;
    array.forEach(el => {
        sum += el[element];
    }); 
    return sum > 0 ? (sum / array.length).toFixed(2) : "0"
}

// ATTENDANCE && LOYALTY TABLE

function renderTable(array, id, boolean) {
    const tableBody = document.querySelector(`#${id} tbody`);
    if(tableBody) {
        array.forEach(member => {
            const fullName = `${member.last_name}, ${member.first_name} ${member.middle_name !== null ? member.middle_name :""}`;
            const votesParty = Math.round((member.total_votes * member.votes_with_party_pct) / 100);
            let createTr = document.createElement("tr");
            createTr.innerHTML = `
                    <td>
                        <a href="${member.url}" target="_blank">${fullName} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                        </svg></a>
                    </td>
                    <td>${boolean ? member.missed_votes : votesParty}</td>
                    <td>${boolean ? member.missed_votes_pct : member.votes_with_party_pct}%</td>
                    `;
            tableBody.appendChild(createTr);
        })
    }
}

// GLACE TABLE

function statisticsGlaceTable(object, id, array) {
    const table = document.querySelector(`#${id}`);
    const tableBody = document.querySelector(`#${id} tbody`);
    const tfoot = document.createElement("tfoot");
    const avgVotesDem = findAverageVotes(object.democrats, 'votes_with_party_pct');
    const avgVotesRep = findAverageVotes(object.republicans, 'votes_with_party_pct');
    const avgVotesInd = findAverageVotes(object.independents, 'votes_with_party_pct');
    const totalVotesAvg = findAverageVotes(array, 'votes_with_party_pct');
    tableBody.innerHTML += `
                <tr>
                    <td>Democrats</td>
                    <td>${object.democrats.length}</td>
                    <td>${avgVotesDem}&percnt;</td>
                </tr>
                <tr>
                    <td>Republicans</td>
                    <td>${object.republicans.length}</td>
                    <td>${avgVotesRep}&percnt;</td>
                </tr>
                <tr>
                    <td>Independents</td>
                    <td>${object.independents.length}</td>
                    <td>${avgVotesInd}&percnt;</td>
                </tr>
                `;
    tfoot.innerHTML =`
                <tr>
                    <td>Total</td>
                    <td>${object.independents.length + object.democrats.length + object.republicans.length}</td>
                    <td>${totalVotesAvg}&percnt;</td>
                </tr>`;
    table.appendChild(tfoot);
}
