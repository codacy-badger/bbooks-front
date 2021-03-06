const fs = require('fs');

const heroku = `export const environment = {
    production: true,
    api: 'https://bbooks-api.herokuapp.com/',
    gauth: '${process.env.GOOGLELOGIN}',
    fbauth: '${process.env.FACEBOOKLOGIN}',
    apicep: '${process.env.APICEP}'
}`

fs.writeFile('src/environments/environment.prod.ts', heroku, (err, result) => {
    if (err) {
        console.log('Falha ao escrever arquivo');
    }
});
