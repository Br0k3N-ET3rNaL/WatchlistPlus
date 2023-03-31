interface Title {
    id: string,
    title: string,
    type: string,
    description: string,
    releaseYear: number,
    ageGuidance: string,
    runtime: number,
    rating: number,
    genres: string[],
    watched?: Watched,
}

interface Watched {
    rating: number,
    status: string,
    title?: Title,
}

interface Review {
    username: string,
    review: string,
    titleId: string,
    userId: number,
}

interface Recommendation {
    title1Id: string,
    title2Id: string,
    userId: number,
}

interface Recommendations {
    title1Id: string,
    title1Title: string,
    title2Id: string,
    title2Title: string,
    count: number,
}

export type { Title, Watched, Review, Recommendation, Recommendations };
