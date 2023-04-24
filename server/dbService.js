const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
});


class DbService {
    static getDBServiceInstance() {
        return instance ? instance: new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name, hours) {
        try {
            const dateAdded = new Date();
            
            var curr_total = await new Promise((resolve, reject) => {
                const query = "SELECT SUM(time_spent) FROM names WHERE name = ?";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            var insertId;
            if (JSON.parse(JSON.stringify(curr_total))[0]['SUM(time_spent)'] === null) {
                curr_total = +hours;
                console.log(typeof(curr_total));
                console.log(curr_total);
                insertId = await new Promise((resolve, reject) => {
                    const query = "INSERT INTO names (name, time_spent, date_added, curr_total) VALUES (?,?,?,?)";
                    connection.query(query, [name, hours, dateAdded, curr_total], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    })
                });
            } else {
                console.log(JSON.parse(JSON.stringify(curr_total))[0]['SUM(time_spent)']);
                console.log(hours);
                curr_total = +JSON.parse(JSON.stringify(curr_total))[0]['SUM(time_spent)'] + +hours;
                console.log(curr_total);
                insertId = await new Promise((resolve, reject) => {
                    const query = "INSERT INTO names (name, time_spent, date_added, curr_total) VALUES (?,?,?,?)";
                    connection.query(query, [name, hours, dateAdded, curr_total], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    })
                });
            }
            return {
                id : insertId,
                name: name,
                hours: hours,
                dateAdded: dateAdded,
                curr_total: curr_total
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
    
                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;