const knex = require("../db/connection");



function create(table){
    return knex('table')
    .insert(table, "*")
    .then((createdTables=> createdTables[0]))
}

function list(){
    return knex('table')
    .select('*')
}



module.exports = {
    create,
    list,
    
}