In designing, I chose to use as few libraries as I could and just make a simple command line tool. The callTwitter function queries the twitter api for 2 different peices of information: number of retweets a person currently has and the number of followers they have, then passes those to the 
addToGeckoBoard function, which defines the dataset schema and posts the infromation to the set. The 
callTwitter function then sets itself up to re-query the twitter api and push the new data to gecko board in an hour.

To setup, run npm install. An .env file with a geckoboard api key, as well as a twitter api key, secret, access token and access token secret is needed for authentication. 
