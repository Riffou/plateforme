var config = {
    local: {
        mode: 'local',
        hostURL: 'localhost:3000',
        hostURLChallenges: 'localhost:3001',
        port: '3000'
    },
    preprod: {
        mode:  'preprod',
        hostURL: '10.1.48.114:80',
        port:'80'
    }
};

var configdb = {
    local: {
        host: 'localhost',
        port: 5432,
        database: 'ensimag',
        user: 'ensimag',
        password: 'ensimagdb'
    },
    localDocker: {
        host: 'plateforme_db',
        port: 5432,
        database: 'devops',
        user: 'devops',
        password: 'solutec'
    },
    preprod: {
        host: 'localhost',
        port: 5432,
        database: 'nicolas',
        user: 'nicolas',
        password: 'solutec'
    }
};

module.exports = {
    config: function(mode) {
        return config[mode || process.argv[2] || 'local'] || config.local;
    },
    configdb: function(mode) {
        return configdb[mode || process.argv[2] || 'local'] || configdb.local;
    }
}

