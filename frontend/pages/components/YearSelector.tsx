
import { Select } from "@canonical/react-components";


const YearSelector = (props: any) => {
    const setYear = props.setYear;
    
    const handleChange =(event: any)=>{
        setYear(event.target[event.target.selectedIndex].value);
    };

    const createYearList2018toCurrentYear = () => {

        const list = [{value:0, label: "Select a year", disabled: true}];

        let year = parseInt(new Date().getFullYear().toString().substring(-2));

        do {
            list.push({ value: year, label: year.toString() , disabled:false});
            year--;
        } while (year >= 2018);

        return list;
    };


    return (
        <div id="year-selector-wrapper">
            <Select defaultValue={0} onChange={handleChange} options={createYearList2018toCurrentYear()} />
        </div>
    );
};

export default YearSelector;
