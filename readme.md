# Metabase Recovery

This is a small script package I built to help me recover some data I extracted out of a broken H2 database. It helps reformat the table data exported as JSON from H2 and use the Metabase API to re-upload these queries.

## Preparation

1. Make sure you're on a recent version of node (this was written with v20.4.0) that at least has the `fetch` SDK.
2. Run `npm install`
3. Add a `.env` file with the url, username and password or add them as environment variables

Note: I'm not a fan of saving my username and password in local files or at all, but i opted to do so here for simplicity. You can add them as temporary environment variables as well to ensure they're gone once you've finished using the script.

## Uploading queries

```shell
cat ~/Downloads/REPORT_CARD.json | node transform-cards.js > report_cards.json
node import-cards.js report-cards.json
```

Remember, if you are moving these queries between instances, you will likely need to change the `database` id.

## Known issues

* The script will duplicate queries if run twice