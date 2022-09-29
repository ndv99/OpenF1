from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from itertools import groupby
from django.http.request import QueryDict
import pandas
import json
import fastf1
import os

years = list(range(2018, 2023)) # range() is not inclusive for the max value

def assemble_url(params, url):
    for p in params:
        if url[-1] != "?":
            url = f"{url}&{p}={params[p]}"
        else:
            url = f"{url}{p}={params[p]}"
    return url


def get_year_from_request(params: QueryDict):
    error = None
    year = None
    try:
        year = int(params['year'])
    except ValueError:
        res = {'errorMessage': "Please send a valid integer for the year you want."}
        error = Response(res, status.HTTP_400_BAD_REQUEST)
        return error, year
    except KeyError:
        res = {
            'errorMessage': "Please provide the desired year as a parameter named 'year'."}
        error = Response(res, status.HTTP_400_BAD_REQUEST)
        return error, year

    if year < min(years):
        res = {'errorMessage': "Telemetry is only available from 2018 onwards."}
        error =  Response(res, status.HTTP_400_BAD_REQUEST)
    
    if year > max(years):
        res = {'errorMessage': "It's still 2022, we can't predict the future!"}
        error = Response(res, status.HTTP_400_BAD_REQUEST)

    return error, year


def get_event_from_request(params: QueryDict):
    error = None
    event = None
    try:
        event = params['event']
    except KeyError:
        res = {'errorMessage': "Please provide the name of the desired event as a parameter named 'event'."}
        error = Response(res, status.HTTP_400_BAD_REQUEST)
        return error, event

    if type(event) is not str:
        res = {
            'errorMessage': "Please send a valid string for the name of the event you want."}
        error = Response(res, status.HTTP_400_BAD_REQUEST)

    return error, event


def enable_cache():
    if not os.path.isdir('server/fastf1_cache'):
        os.mkdir('server/fastf1_cache')
    fastf1.Cache.enable_cache('server/fastf1_cache')

# Create your views here.

class Years(viewsets.ViewSet):

    def list(self, request, *args, **kwargs):
        res = { "years": years }
        return Response(res, status.HTTP_200_OK)


class Events(viewsets.ViewSet):

    def list(self, request: Request, *args, **kwargs):

        params = request.query_params

        error, year = get_year_from_request(params)

        if error:
            return error

        enable_cache()
        schedule = fastf1.get_event_schedule(year)
        event_names = schedule.EventName.values.tolist()
        res = {"events": event_names}
        return Response(res, status.HTTP_200_OK)


class RaceLapChart(viewsets.ViewSet):
    def list(self, request: Request, *args, **kwargs):

        headers = request.query_params
        params = request.query_params

        year_error, year = get_year_from_request(params)

        if year_error:
            return year_error

        event_error, event = get_event_from_request(params)

        if event_error:
            return event_error

        enable_cache()
        session = fastf1.get_session(year, event, "R")
        session.load()

        drivers = pandas.unique(session.laps['Driver'])

        results = {}
        grid = {}

        for driver in drivers:
            results[driver] = session.get_driver(driver)['Position']
            gridpos = session.get_driver(driver)['GridPosition']
            if gridpos == 0:
                gridpos = 20
            grid[driver] = gridpos

        lap_chart_data = {}

        for driver in grid:
            lap_chart_data[driver] = {
                "Name": session.get_driver(driver)['FullName'],
                "Positions": [int(grid[driver])],
                "Laps": [0],
                "TeamColor": session.get_driver(driver)['TeamColor'],
                "Compounds": [],
                "LapTimes": [],
            }

        lapsobj = session.laps.iterlaps()
        all_laps = []

        for lap in lapsobj:
            all_laps.append({"LapNumber": lap[1]['LapNumber'], "Time": lap[1]['Time'], "Driver": lap[1]
                            ['Driver'], "Compounds": lap[1]['Compound'], "LapTimes": lap[1]['LapTime']})

        def sortLapsByNumber(lap):
            return lap["LapNumber"]

        def sortLapsByTime(lap):
            return lap["Time"]

        all_laps.sort(key=sortLapsByNumber)

        for key, value in groupby(all_laps, sortLapsByNumber):
            value_as_list = list(value)
            value_as_list.sort(key=sortLapsByTime)
            for x in range(len(value_as_list)):
                v = value_as_list[x]
                lap_chart_data[v['Driver']]['Positions'].append(x+1)
                lap_chart_data[v['Driver']]['Laps'].append(v['LapNumber'])
                lap_chart_data[v['Driver']]['Compounds'].append(v['Compounds'])
                lap_chart_data[v['Driver']]['LapTimes'].append(v['LapTimes'])

        res = {"lapChartData": lap_chart_data}
        return Response(res, status.HTTP_200_OK)
