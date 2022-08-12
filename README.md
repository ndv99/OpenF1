# FastF1_WebViewer

A web interface for accessing the functions of the FastF1 Python library.

To generate a Django secret key:

`python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`

Copy `.example.env` and paste as `.env`, then add your secret key to the `SECRET_KEY` field.
