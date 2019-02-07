Sentdemo
========

http://github.com/neurosnap/sentences

## Environment variables for deployment

* SENTDEMO\_USER
* SENTDEMO\_SERVER
* SENTDEMO\_DIR

## Install

```bash
make install
```

## Deploy

This app uses Google App Engine as the underlying system. The Google App Engine free tier should suffice for personal usage.

Install the gcloud sdk
https://cloud.google.com/sdk/install

Login to gcloud
`gcloud auth login`

Run the gcloud app deploy on the project for Sharer
`gcloud app deploy app.yaml`
