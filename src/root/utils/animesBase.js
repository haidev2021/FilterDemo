export const ATTRIBUTES = [
    {
        name: "Page",
        id: "page",
        type: 4,
    },
    {
        name: "Type",
        id: "type",
        "type":1,
        entries: [
            { attributeEntryId: "tv", name: "tv" },
            { attributeEntryId: "ova", name: "ova" },
            { attributeEntryId: "movie", name: "movie" },
            { attributeEntryId: "special", name: "special" },
            { attributeEntryId: "ona", name: "ona" },
            { attributeEntryId: "music", name: "music" }
        ]
    }
    ,
    {
        name: "Status",
        id: "status",
        "type":1,
        entries: [
            { attributeEntryId: "airing", name: "airing" },
            { attributeEntryId: "completed", name: "completed" },
            { attributeEntryId: "complete", name: "complete (alias)" },
            { attributeEntryId: "to_be_aired", name: "to_be_aired" },
            { attributeEntryId: "tba", name: "tba (alias)" },
            { attributeEntryId: "upcoming", name: "upcoming (alias)" },
            { attributeEntryId: "rated", name: "rated" }
        ]
    }
    ,
    {
        name: "Rating",
        id: "rating",
        "type":1,
        entries: [
            { attributeEntryId: "g", name: "G - All Ages" },
            { attributeEntryId: "pg", name: "PG - Children" },
            { attributeEntryId: "pg13", name: "PG-13 - Teens 13 or older" },
            { attributeEntryId: "r17", name: "R - 17+ recommended (violence & profanity)" },
            { attributeEntryId: "r", name: "R+ - Mild Nudity (may also contain violence & profanity)" },
            { attributeEntryId: "rx", name: "Rx - Hentai (extreme sexual content/nudity)" }
        ]
    },
    {
        name: "Genre Exclude",
        id: "genre_exclude",
        type: 9,
        entries: [
            { id: "true", name: "true" },
        ]
    },
    {
        name: "Score",
        id: "score",
        type: 4,
    },
    {
        name: "Producer",
        id: "producer",
        type: 4,
    },
    {
        name: "Date",
        id: "date",
        type: 8,
    },
    {
        name: "Magazine",
        id: "magazine",
        type: 4,
    },
];

export const order_by = [
    { id: "title", name: "title" },
    { id: "start_date", name: "start_date" },
    { id: "end_date", name: "end_date" },
    { id: "score", name: "score" },
    { id: "type", name: "type" },
    { id: "members", name: "members" },
    { id: "id", name: "id" },
    { id: "episodes", name: "episodes" },
    { id: "rating", name: "rating" },
];

export const sort = [
    { id: "ascending", name: "ascending" },
    { id: "asc", name: "asc (alias)" },
    { id: "descending", name: "descending" },
    { id: "desc", name: "desc (alias)" },
];

export const SORT_TYPES = [
    {id: "title|ascending", name: "Title ASC"},
    {id: "title|descending", name: "Title DES"},
    {id: "start_date|ascending", name: "Start date ASC"},
    {id: "start_date|descending", name: "Start date DES"},
    {id: "end_date|ascending", name: "End date ASC"},
    {id: "end_date|descending", name: "End date DES"},
    {id: "score|ascending", name: "Score ASC"},
    {id: "score|descending", name: "Score DES"},
    {id: "type|ascending", name: "Type ASC"},
    {id: "type|descending", name: "Type DES"},
    {id: "members|ascending", name: "Nembers ASC"},
    {id: "members|descending", name: "Nembers DES"},
    {id: "id|ascending", name: "Id ASC"},
    {id: "id|descending", name: "Id DES"},
    {id: "episodes|ascending", name: "Episodes ASC"},
    {id: "episodes|descending", name: "Episodes DES"},
    {id: "rating|ascending", name: "Rating ASC"},
    {id: "rating|descending", name: "Rating DES"},
];

export const GENRES = [
    { name: "Action", id: 1 },
    { name: "Adventure", id: 2 },
    { name: "Cars", id: 3 },
    { name: "Comedy", id: 4 },
    { name: "Dementia", id: 5 },
    { name: "Demons", id: 6 },
    { name: "Mystery", id: 7 },
    { name: "Drama", id: 8 },
    { name: "Ecchi", id: 9 },
    { name: "Fantasy", id: 10 },
    { name: "Game", id: 11 },
    { name: "Hentai", id: 12 },
    { name: "Historical", id: 13 },
    { name: "Horror", id: 14 },
    { name: "Kids", id: 15 },
    { name: "Magic", id: 16 },
    { name: "Martial Arts", id: 17 },
    { name: "Mecha", id: 18 },
    { name: "Music", id: 19 },
    { name: "Parody", id: 20 },
    { name: "Samurai", id: 21 },
    { name: "Romance", id: 22 },
    { name: "School", id: 23 },
    { name: "Sci Fi", id: 24 },
    { name: "Shoujo", id: 25 },
    { name: "Shoujo Ai", id: 26 },
    { name: "Shounen", id: 27 },
    { name: "Shounen Ai", id: 28 },
    { name: "Space", id: 29 },
    { name: "Sports", id: 30 },
    { name: "Super Power", id: 31 },
    { name: "Vampire", id: 32 },
    { name: "Yaoi", id: 33 },
    { name: "Yuri", id: 34 },
    { name: "Harem", id: 35 },
    { name: "Slice Of Life", id: 36 },
    { name: "Supernatural", id: 37 },
    { name: "Military", id: 38 },
    { name: "Police", id: 39 },
    { name: "Psychological", id: 40 },
    { name: "Thriller", id: 41 },
    { name: "Seinen", id: 42 },
    { name: "Josei", id: 43 },
];