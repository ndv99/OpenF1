
import { Select } from '@canonical/react-components';
interface Props { }

function YearSelector(props: Props) {
    const { } = props
    const createYearList2018toCurrentYear = () => {
        const list = []
        let year = parseInt(new Date().getFullYear().toString().substring(-2))

        do {
            list.push({ value: year, label: year.toString() })
            year--;
        } while (year >= 2018)

        return list;

    }
    return (
        <div id="year-selector-wrapper">
            <Select options={createYearList2018toCurrentYear()} />
        </div>
    )
}

export default YearSelector
