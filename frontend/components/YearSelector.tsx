
import { Select } from "@canonical/react-components";
import axios from "axios";
import { useEffect, useState } from "react";


const YearSelector = (props: any) => {
    const setYear = props.setYear;
    const [years, setYears] = useState([{value:0, label: "Select a year", disabled: true}]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            axios.get("/api/years/")
            .then((res) => {
                const tempYears = years;

                for ( var year in res.data["years"] ) {
                    tempYears.push({ value: parseInt(res.data["years"][year]), label: res.data["years"][year] , disabled:false });
                };

                setYears(tempYears);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Unable to get available years. Error: ",  err);
            });
        }
    }, [years, loading]);
    
    const handleChange =(event: any)=>{
        setYear(event.target[event.target.selectedIndex].value);
    };

    return (
        <>
            {(loading ? (
                <p>Loading...</p>
            ) : (
                <div id="year-selector-wrapper">
                    <Select defaultValue={0} onChange={handleChange} options={years} />
                </div>
            ))}
        </>
    );
};

export default YearSelector;
