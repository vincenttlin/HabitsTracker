document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadEmptySearchTable(data['data']));
    
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input')
    .value;

    if (searchValue === "") {
        fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadEmptySearchTable(data['data']));
    } else {
        fetch('http://localhost:5000/search/' + searchValue)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
    }
}

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetch('http://localhost:5000/getAll')
            .then(response => response.json())
            .then(data => loadEmptySearchTable(data['data']));
            location.reload();
        }
    })
}


const addBtn = document.querySelector('#add-name-btn');
let spans = document.getElementsByClassName('add');

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
    const hoursInput = document.querySelector('#hours-input');
    var hours;
    if (hoursInput.value === "") {
        hours = 0;
    } else {
        hours = hoursInput.value;
    } 
    hoursInput.value = "";
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name, hours: hours})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));

    for (span of spans) {
        span.classList.add("anim");
    }
    setTimeout(function(){
        for(span of spans){
            span.classList.remove("anim");
        }
    }, 500)

    //calculates total time done for task and prints in console
    //console.log(JSON.parse(JSON.stringify(data))[0]['SUM(time_spent)'])
    //document.getElementById("time").innerHTML = JSON.parse(JSON.stringify(data))[0]['SUM(time_spent)']
    
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    //display total time and task
    /**
    console.log(JSON.parse(JSON.stringify(data['curr_total'])));
    if (JSON.parse(JSON.stringify(data['curr_total'])) === 0) {
        document.getElementById("time").innerHTML = parseFloat(JSON.parse(JSON.stringify(data['hours'])));
    } else {
        document.getElementById("time").innerHTML = Math.round(parseFloat(JSON.parse(JSON.stringify(data['curr_total']))[0]['SUM(time_spent)'])
        + parseFloat(JSON.parse(JSON.stringify(data['hours']))), 2);
    }
    */
    document.getElementById("task").innerHTML = data['name'];
    document.getElementById("time").innerHTML = data['curr_total'];

    let tableHtml = "<tr>";
        //tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${data['name']}</td>`;
        tableHtml += `<td>${data['hours']}</td>`;
        data['date_added'] = new Date(data['dateAdded']).toLocaleDateString();
        tableHtml += `<td>${data['date_added']}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id=${data['id']}>Delete</td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id=${data['id']}>Edit</td>`;
        tableHtml += "</tr>";

    /**
    let tableHtml = "<tr>";
    
    tableHtml += `<td>${data['name']}</td>`;
    if (data.hasOwnProperty('date_added')) {
        data['date'] = new Date(data['date_added']).toLocaleDateString();
        tableHtml += `<td>${data['date']}</td>`;
    } else {
        tableHtml += `<td>${data['date_added']}</td>`;
    }
    
    for (var key in data) {
        console.log(data['id']);
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                //var dateObj = new Date();
                //var month = dateObj.getUTCMonth() + 1;
                //var day = dateObj.getUTCDate();
                //var year = dateObj.getUTCFullYear();
                //data[key] = year + "/" + month + "/" + day;
                data[key] = new Date(data[key]).toLocaleDateString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class='delete-row-btn' data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class='edit-row-btn' data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    */

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        document.getElementById("time").innerHTML = "___";
        document.getElementById("task").innerHTML = "___";
        return;
    }
    let tableHtml = "";
    //console.log(data);
    //console.log(data[0]['curr_total']);
    data.forEach(function ({id, name, time_spent, date_added}) {
        //console.log(data[0]['curr_total']);
        console.log(data);
        document.getElementById("time").innerHTML = data[Object.keys(data).length - 1]['curr_total'];
        document.getElementById("task").innerHTML = data[0]['name'];
        tableHtml += "<tr>";
        //tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${time_spent}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function loadEmptySearchTable(data) {
    const table = document.querySelector('table tbody');
    document.getElementById("time").innerHTML = "___";
    document.getElementById("task").innerHTML = "___";
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";
    data.forEach(function ({id, name, time_spent, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${time_spent}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

const end = Date.parse("2024-01-01T00:00:00.000");

// countdown
let timer = setInterval(function() {

  // get today's date
  var myDate = new Date();
  const today = Date.parse(myDate.toLocaleString("en-US", {
    timezone: "America/Los_Angeles"
  }));

  // get the difference
  let diff = end - today;

  // math
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // display
  document.getElementById("timer").innerHTML =
    "<div class=\"days\"> \
  <div class=\"numbers\">" + days + "</div>days</div> \
<div class=\"hours\"> \
  <div class=\"numbers\">" + hours + "</div>hours</div> \
<div class=\"minutes\"> \
  <div class=\"numbers\">" + minutes + "</div>minutes</div> \
<div class=\"seconds\"> \
  <div class=\"numbers\">" + seconds + "</div>seconds</div> \
</div>";

}, 1000);