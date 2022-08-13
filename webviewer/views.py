from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
import requests
import json
import fastf1
import os

def assemble_url(params, url):
    for p in params:
        if url[-1] != "?":
            url = f"{url}&{p}={params[p]}"
        else:
            url = f"{url}{p}={params[p]}"
    return url

# Create your views here.

class Events(viewsets.ViewSet):

    def list(self, request, *args, **kwargs):

        headers = request.headers
        if not os.path.isdir('server/fastf1_cache'):
            os.mkdir('server/fastf1_cache')
        fastf1.Cache.enable_cache('server/fastf1_cache')
        try:
            year = int(headers['year'])
        except ValueError:
            res = {'errorMessage': "Please send a valid integer for the year you want."}
            return Response(res, status.HTTP_400_BAD_REQUEST)
        except KeyError:
            res = {'errorMessage': "Please provide the desired year as a header with key 'year'."}
            return Response(res, status.HTTP_400_BAD_REQUEST)

        if year < 2018:
            res = {'errorMessage': "Telemetry is only available from 2018 onwards."}
            return Response(res, status.HTTP_400_BAD_REQUEST)
        
        if year > 2022:
            res = {'errorMessage': "It's still 2022, we can't predict the future!"}
            return Response(res, status.HTTP_400_BAD_REQUEST)
        
        schedule = fastf1.get_event_schedule(year)
        event_names = schedule.EventName.values.tolist()
        res = { "events": event_names }
        return Response(res, status.HTTP_200_OK)
