

exports.config = {
    db_config: {
        host: "localhost",
        user: "root",
        password: "",
        database: "photosharingapp",

        pooled_connections: 125,
        idle_timeout_millis: 30000
    },

    static_content: "../static/"
};

