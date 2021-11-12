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
        const members = data.results[0].members;
        printMainFunctions(members);

        const loader = document.querySelector(".loader");
        loader.style.display= "none";
    })
    .catch(error => console.error(error))


    

function printMainFunctions(members) {
    const id = "members-table";

    function completeTable(array) {
        const completeTable = document.querySelector(`#${id} tbody`)
        completeTable.innerHTML = ""
        if(array.length > 0) {
            array.forEach( member => {
                const fullName = `${member.last_name}, ${member.first_name} ${member.middle_name !== null ? member.middle_name :""}`
                const createTr = document.createElement("tr")
                    createTr.innerHTML += `
                            <td>
                                <a href="${member.url}" target="_blank">${fullName} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                </svg></a>
                            </td>
                            <td>${member.party}</td>
                            <td>${member.state}</td>
                            <td>${member.seniority}</td>
                            <td>${member.votes_with_party_pct}%</td>
                    `
                    completeTable.appendChild(createTr)
            });
        } else {
            const createP = document.createElement("p")
            createP.innerHTML = `<tr colspan="4" class="text-center fs-5">No data</tr>`
            completeTable.appendChild(createP)
        }
        return completeTable
    }
    completeTable(members);

    // PARTYS

    let checkbox= document.querySelectorAll("input[type=checkbox]")
    checkbox= Array.from(checkbox)

    const filter = document.querySelector("#filter")
    filter.addEventListener("change", verifyChecked)

    function verifyChecked(){
        let state = select.value;
        let checked = checkbox.filter(check => check.checked === true)

        let values = checkbox.map(checkbox => {
            if(checkbox.checked) {
            return checkbox.value
            }
            })

        let array = "";
        if(checked.length > 0 && state !== "") {
            array = members.filter(member => values.includes(member.party) && state === member.state)
            completeTable(array)
        } else if(checked.length > 0 && state === "") {
            array = members.filter(member => values.includes(member.party))
            completeTable(array) 
        } else if(checked.length === 0 && state !== "") {
            array = members.filter(member => state === member.state)
            completeTable(array) 
        } else {
            completeTable(members)
        }
    }

    // STATES

    const select = document.querySelector("#select-state")

    function memberStates() {
        let memberStates = members.map(member => member.state)
        const newArr = []
        memberStates.forEach(state => {
                if(!newArr.includes(state)) {
                    newArr.push(state)
                }
            })
            return newArr
    }

    const states = memberStates().sort()

    function createSelectStateOptions() {
        const select = document.querySelector("#select-state")
        states.forEach(state => {
            const option = document.createElement("option");
            option.innerHTML += `<option value="${state}">${state}</option>`
            select.appendChild(option)
        })
    }
    createSelectStateOptions()

}