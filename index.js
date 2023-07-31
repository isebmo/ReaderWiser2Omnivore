import csv from 'csv-parser';
import fs from 'fs';
import fetch from 'node-fetch';
import {v4 as uuidv4} from 'uuid';

const results = [];
const YOUR_API_URL = 'https://api-prod.omnivore.app/api/graphql'; // Remplacez par votre URL GraphQL
const CSV_FROM_READER = 'export.csv'; // Remplacez par le chemin vers votre fichier CSV

const saveUrl = async (url2save) => {
    const uuid = uuidv4();
    const YOUR_GRAPHQL_QUERY = `{ "query": "mutation SaveUrl($input: SaveUrlInput!) { saveUrl(input: $input) { ... on SaveSuccess { url clientRequestId } ... on SaveError { errorCodes message } } }", "variables": { "input": { "clientRequestId": "${uuid}", "source": "api", "url": "${url2save}" }} }`;
    return fetch(YOUR_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'c6a44c26-4848-4aa6-920f-2f1127376946' // Remplacez par votre jeton d'autorisation
        },
        body: YOUR_GRAPHQL_QUERY,
        //body : '{ "query": "mutation SaveUrl($input: SaveUrlInput!) { saveUrl(input: $input) { ... on SaveSuccess { url clientRequestId } ... on SaveError { errorCodes message } } }", "variables": { "input": { "clientRequestId": "85282635-4DF4-4BFC-A3D4-B3A004E57067", "source": "api", "url": "https://blog.omnivore.app/p/contributing-to-omnivore" }} }'
    })
        .then(res => {
            console.log(res.json())
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.error(err)
        });
}



fs.createReadStream(CSV_FROM_READER)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        const promises = results.filter((data) => data['Location'] === 'new')
            .map((data) => saveUrl(data['URL']));
        await Promise.all(promises);
    });







/*
curl -X POST -d '{ "query": "mutation SaveUrl($input: SaveUrlInput!) { saveUrl(input: $input) { ... on SaveSuccess { url clientRequestId } ... on SaveError { errorCodes message } } }", "variables": { "input": { "clientRequestId": "85282635-4DF4-4BFC-A3D4-B3A004E57067", "source": "api", "url": "https://blog.omnivore.app/p/contributing-to-omnivore" }} }' -H 'content-type: application/json' -H 'authorization: <your api key>' https://api-prod.omnivore.app/api/graphql
 */