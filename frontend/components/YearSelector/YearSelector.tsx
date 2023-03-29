
import BaseSelector from "../Selectors/BaseSelector";


const YearSelector = (props: any) => {
    const setYear = props.setYear;

    return(
        <BaseSelector callback={setYear} name="year" ind="years" apiPath="/api/years/"></BaseSelector>

    );
};

export default YearSelector;