import YearSelector from './components/YearSelector'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

const DevPage: NextPage = () => {
    const [year, setYear] = useState(0)
    const [events, setEvents] = useState([])
    const axios = require('axios').default;

    const getEventsByYear = () => {
        axios.get("https://fastf1-webviewer-api.herokuapp.com/api/events/", //TODO: add proxy instead of full api url
            {
                headers: {
                    year: year
                },

            })
            .then(function (response: any) {
                setEvents(response.data)
            })
            .catch(function (error: any) {
                setEvents([])
                console.error("Unable to get events for: ", year, error)
            })
    }
    useEffect(() => {
        if(year === 0 ){
            return
        }        
        getEventsByYear()
    },
        [year]
    )

    useEffect(() => {
        if(year === 0 ){ //TODO: this will be used when setting year via url query
            return
        }
        //TODO: setevents

    }, [events])

    return (
        <div>
            <YearSelector setYear={setYear}></YearSelector>
        </div>


    )
}

export default DevPage
