# FastF1_WebViewer

[![GitHub Actions Vercel Preview Deployment](https://github.com/ndv99/FastF1_WebViewer/actions/workflows/preview.yaml/badge.svg)](https://github.com/ndv99/FastF1_WebViewer/actions/workflows/preview.yaml)

[![GitHub Actions Vercel Production Deployment](https://github.com/ndv99/FastF1_WebViewer/actions/workflows/production.yaml/badge.svg)](https://github.com/ndv99/FastF1_WebViewer/actions/workflows/production.yaml)

A web interface for accessing the functions of the FastF1 Python library.

To generate a secret key:

`python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`

Copy `.example.env` and paste as `.env`, then add your secret key to the `SECRET_KEY` field.
