
import { Select } from "@canonical/react-components";
import axios from "axios";
import { useEffect, useState } from "react";


const BaseSelector = (props: any) => {
    const callback = props.callback;
    const name = props.name;
    const ind = props.ind;
    const apiPath = props.apiPath;
    const [years, setYears] = useState([{ value: 0, label: `Select a ${name}`, disabled: true }]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        axios.get("/api/years/")
            .then((res) => {
                const temp = [];
                for (var year in res.data[ind]) {
                    temp.push({ value: parseInt(res.data[ind][year]), label: res.data[ind][year], disabled: false });
                };
                setYears(temp);
                setLoading(false);
            });
    }, []);

    const handleChange = (event: any) => {

        callback(event.target[event.target.selectedIndex].value);
    };

    return (
        <>
            {(loading ? (
                <p>Loading...</p>
            ) : (
                <div id={`${name}-selector-wrapper`}>
                    <Select defaultValue={0} onChange={handleChange} options={years} />
                </div>
            ))}
        </>
    );
};

export default BaseSelector;