import {fetch} from "fetch-plus";

export default async function fetchDataFrom(url, query) {
    const response = await fetch(url, query)
    if (response.ok) {
        return 'data:image/png;base64,' + await response.text()
    }
    return null;
}