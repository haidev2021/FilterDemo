
import queryString from 'query-string';
import moment from 'moment';

const LANGUAGE = "language";
const WHITELABLE_ID = "whitelabelId";
const TEXT_RESOURCE_SECTION = "sectionOrId";
const CATEGORY_SUGGESTION_KEYWORD = "keyword";
const MODULE = "module";
const GEO_COUNTRY_CODE = "countryCode";
const GEO_ZIP = "zip";
const GEO_NAME = "name";
export const CATEGORY_ID = "genre";
const ADVERT_LANGUAGE = "lng";
const WITH_IMAGES_ONLY = "wio";
export const SEARCH_TERM = "q";
export const SEARCH_LOCATION = "loc";
const SEARCH_DISTANCE = "sdc";
const RESULT_PAGE_INDEX = "pi";
const RESULT_PAGE_SIZE = "ps";
export const SORT_FIELD = "order_by";
export const SORT_ORDER = "sort";
export const ATTRIBUTE_ID_LIST = "aidl";
export const ATTRIBUTE_MULTIID_LIST = "amid";
export const ATTRIBUTE_TEXT_LIST = "atxl";
export const ATTRIBUTE_RANGE_LIST_NUMBER = "aral";
export const ATTRIBUTE_RANGE_LIST_DATE = "ardl";
const MEMBER_ID = "mid";
const USERNAME = "sun";
const SEARCH_CANTON = "sct";
const USE_ADVERT_LANGUAGE_FILTER = "ualf";
const ADVERT_TYPE = "aty";
const ADVERT_ID = "advertId";
const DEVICE_TOKEN = "DeviceToken";
const USER_SETTING_API_MEMBER_ID = "memberId";
const AUTOCOMPLETE_SEARCH_TERM = "searchTerm";
const AUTOCOMPLETE_CATEGORY_ID = "categoryId";
const AUTOCOMPLETE_NUMBER_OF_RESULTS = "numberOfResults";
function normaliseValue(value) {
    return value !== null && value !== undefined ? value : "";
}

export function updateSubQueryRef(ref, key, value) {
    console.log('prefilledCategory updateSubQueryRef', ref, key, value)
    ref.current[key] = encodeSubQuery(key, value);
}

export function encodeSubQuery(key, value) {
    let result = "";
    let obj = {};
    if (value instanceof Map) {
        // obj[key] = [];
        const map = value;
        console.log('encodeSubQuery map', map)
        Array.from(map.values(), (att) => {
            let newValue = null;
            if (key === ATTRIBUTE_TEXT_LIST && att.inputText) {
                newValue = att.inputText;
                if (newValue)
                    obj[att.attributeId] = newValue;
            }
            else if (key === ATTRIBUTE_RANGE_LIST_DATE && (att.inputDateFrom || att.inputDateTo)) {
                const from = att.inputDateFrom && normaliseValue(moment(new Date(att.inputDateFrom)).format("YYYY-MM-DD").toString());
                if (from)
                    obj["start_" + att.attributeId] = from;
                const to = att.inputDateTo && normaliseValue(moment(new Date(att.inputDateTo)).format("YYYY-MM-DD").toString());
                if (to)
                    obj["end_" + att.attributeId] = to;
            }
            else if (key === ATTRIBUTE_ID_LIST && att.attributeEntryId) {
                newValue = att.attributeEntryId;
                if (newValue)
                    obj[att.attributeId] = newValue;
            }
        });
        // result = obj[key].length > 0 ? queryString.stringify(obj, { arrayFormat: 'comma' }) : "";
        result = queryString.stringify(obj);
    }
    else if (value) {
        obj[key] = value;
        result = queryString.stringify(obj);
    }
    console.log('encodeSubQuery key', key, 'result', value, 'value', result)
    return result;
}

const queriableFields = [SEARCH_TERM, CATEGORY_ID, SEARCH_LOCATION, ATTRIBUTE_RANGE_LIST_NUMBER,
    ATTRIBUTE_RANGE_LIST_DATE, ATTRIBUTE_ID_LIST, ATTRIBUTE_MULTIID_LIST, ATTRIBUTE_TEXT_LIST, SORT_FIELD, SORT_ORDER];
const keyboardAttributeFields = [ATTRIBUTE_RANGE_LIST_NUMBER, ATTRIBUTE_TEXT_LIST];

export function getCompoundQuery(subQueries) {
    let filledSubQueries = [];
    let filledKeyBoardInputQueries = [];
    queriableFields.map(key => {
        if (subQueries[key]) {
            filledSubQueries.push(subQueries[key]);
            if (keyboardAttributeFields.includes(key))
                filledKeyBoardInputQueries.push(subQueries[key]);
        }
    })
    let query = filledSubQueries.join("&");
    let keyBoardInputQuery = filledKeyBoardInputQueries.join("&");
    return {query, keyBoardInputQuery}
}

function stringToData(fieldName, stringValue) {
    if (fieldName === "inputNumber")
        return Number.parseFloat(stringValue)
    else if (fieldName === "inputDate")
        return Date.parse(stringValue)
    else if (fieldName === "attributeEntryId")
        return Number.parseInt(stringValue)
    else
        return stringValue;
}

function getEntriedAttribute(toSplit, fieldName) {
    const [attributeId, input1, input2] = toSplit.split("_");
    const entriedAtt = { attributeId: Number.parseInt(attributeId) };
    if (input2 === undefined) {
        entriedAtt[fieldName] = stringToData(fieldName, input1);
    } else if (input2 === "") {
        entriedAtt[fieldName + "From"] = stringToData(fieldName, input1);
    } else {
        entriedAtt[fieldName + "From"] = stringToData(fieldName, input1);
        entriedAtt[fieldName + "To"] = stringToData(fieldName, input2);
    }
    console.log('getEntriedAttribute entriedAtt', entriedAtt)
    return entriedAtt;
}

function toArray(value) {
    return Array.isArray(value) ? value : (value || value === 0 ? [value] : []);
}

export function parseSearchQuery(query) {
    // query = "atxl=3_%25xxx%25,33_%25yyy%25&cid=113"
    // let PRINT_EXTRA_LOGS = true;
    // console.log('/search parseSearchQuery query', query)
    const parsed = queryString.parse(query, { arrayFormat: 'comma' });

    const categoryId = parsed[CATEGORY_ID] || 0;

    let categoryFilter = {
        categoryId: categoryId,
    }

    let commonFilter = { term: parsed[SEARCH_TERM], location: parsed[SEARCH_LOCATION] };
    // console.log('parseSearchQuery commonFilter', commonFilter)
    const attributes = [
        ...Array.from(toArray(parsed[ATTRIBUTE_TEXT_LIST]), item => getEntriedAttribute(item, "inputText")),
        ...Array.from(toArray(parsed[ATTRIBUTE_RANGE_LIST_NUMBER]), item => getEntriedAttribute(item, "inputNumber")),
        ...Array.from(toArray(parsed[ATTRIBUTE_RANGE_LIST_DATE]), item => getEntriedAttribute(item, "inputDate")),
        ...Array.from(toArray(parsed[ATTRIBUTE_ID_LIST]), item => getEntriedAttribute(item, "attributeEntryId")),
    ];

    if (attributes.length > 0)
        categoryFilter.attributes = attributes;

    /*{attributes: {$all: [{$elemMatch: {attributeId: 223, inputDate: "2020-10-21"}}, {$elemMatch: {attributeId: 226, attributeEntryId: "15334"}}]}};*/

    // console.log('parseSearchQuery categoryFilter', categoryFilter);

    let shortType = parsed[SORT_FIELD] && parsed[SORT_ORDER] && `${parsed[SORT_FIELD]}|${parsed[SORT_ORDER]}`;
    // console.log('parseSearchQuery shortType', shortType)

    return { commonFilter, categoryFilter, shortType };
}