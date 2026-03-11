var mysql = require('mysql2'),
    local = require("../local.config.json");

exports.init = function () {
    conn_props = local.config.db_config;
    console.log("app/data/db.js .init");
    console.log("  mySQL server:", conn_props.host, conn_props.user, conn_props.password, conn_props.database); 
    if (conn_props.user === "" || conn_props.password == "") {
        console.log("Error, update local.config.json with your SQL credentials");
    }
    exports.dbpool = mysql.createPool({
        connectionLimit: conn_props.pooled_connections,
        host:            conn_props.host,
        user:            conn_props.user,
        password:        conn_props.password,
        database:        conn_props.database
    });
};

exports.dbpool = null;
