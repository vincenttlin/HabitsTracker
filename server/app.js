const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false}));


//create
app.post('/insert', (request, response) => {
    const { name, hours } = request.body;
    const db = dbService.getDBServiceInstance();

    //console.log(JSON.parse(JSON.stringify(curr))[0]['SUM(time_spent)']);
    //curr = JSON.parse(JSON.stringify(curr))[0]['SUM(time_spent)'] + hours;

    const result = db.insertNewName(name, hours);

    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));

    /**
    const time = db.calculateHours(name);

    //calculates total time done for task and prints in console
    //console.log(JSON.parse(JSON.stringify(data))[0]['SUM(time_spent)'])
    time
    .then(data => response.json({ time : JSON.parse(JSON.stringify(data))[0]['SUM(time_spent)']}))
    .catch(err => console.log(err));
    */
});

//read
app.get('/getAll', (request, response) => {
    const db = dbService.getDBServiceInstance();

    const result = db.getAllData();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//update
app.patch('/update', (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDBServiceInstance();

    const result = db.updateNameById(id, name);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

//delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDBServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDBServiceInstance();

    const result = db.searchByName(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));