Sentdemo
========

http://github.com/neurosnap/sentences

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

## Dev

```bash
make build
./sentdemo
```

Open browser at localhost:8080
