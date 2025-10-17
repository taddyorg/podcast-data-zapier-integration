// GraphQL Fragments - reused across queries

const ITUNES_INFO_FRAGMENT = `
  uuid
  baseArtworkUrlOf(size: 640)
  summary
`;

const PODCAST_SERIES_FRAGMENT = `
  uuid
  name
  rssUrl
  itunesId
  description(shouldStripHtmlTags: true)
  imageUrl
  totalEpisodesCount
  language
  genres
  popularityRank
`;

const PODCAST_SERIES_EXTENDED_FRAGMENT = `
  uuid
  name
  itunesId
  rssUrl
  description(shouldStripHtmlTags: true)
  imageUrl
  language
  totalEpisodesCount
  authorName
  websiteUrl
  itunesInfo {
    ${ITUNES_INFO_FRAGMENT}
  }
  genres
`;

const EPISODE_FRAGMENT = `
  uuid
  name
  description(shouldStripHtmlTags: true)
  audioUrl
  duration
  datePublished
`;

const EPISODE_EXTENDED_FRAGMENT = `
  uuid
  name
  description(shouldStripHtmlTags: true)
  audioUrl
  imageUrl
  datePublished
  duration
  episodeNumber
  seasonNumber
  fileType
  podcastSeries {
    uuid
    name
    imageUrl
  }
`;

// Zapier dropdown choices for genres
const GENRE_CHOICES = [
  { sample: 'Arts', value: 'PODCASTSERIES_ARTS', label: 'Arts' },
  { sample: 'Business', value: 'PODCASTSERIES_BUSINESS', label: 'Business' },
  { sample: 'Comedy', value: 'PODCASTSERIES_COMEDY', label: 'Comedy' },
  { sample: 'Education', value: 'PODCASTSERIES_EDUCATION', label: 'Education' },
  { sample: 'Fiction', value: 'PODCASTSERIES_FICTION', label: 'Fiction' },
  { sample: 'Government', value: 'PODCASTSERIES_GOVERNMENT', label: 'Government' },
  { sample: 'Health & Fitness', value: 'PODCASTSERIES_HEALTH_AND_FITNESS', label: 'Health & Fitness' },
  { sample: 'History', value: 'PODCASTSERIES_HISTORY', label: 'History' },
  { sample: 'Kids & Family', value: 'PODCASTSERIES_KIDS_AND_FAMILY', label: 'Kids & Family' },
  { sample: 'Leisure', value: 'PODCASTSERIES_LEISURE', label: 'Leisure' },
  { sample: 'Music', value: 'PODCASTSERIES_MUSIC', label: 'Music' },
  { sample: 'News', value: 'PODCASTSERIES_NEWS', label: 'News' },
  { sample: 'Religion & Spirituality', value: 'PODCASTSERIES_RELIGION_AND_SPIRITUALITY', label: 'Religion & Spirituality' },
  { sample: 'Science', value: 'PODCASTSERIES_SCIENCE', label: 'Science' },
  { sample: 'Society & Culture', value: 'PODCASTSERIES_SOCIETY_AND_CULTURE', label: 'Society & Culture' },
  { sample: 'Sports', value: 'PODCASTSERIES_SPORTS', label: 'Sports' },
  { sample: 'Technology', value: 'PODCASTSERIES_TECHNOLOGY', label: 'Technology' },
  { sample: 'True Crime', value: 'PODCASTSERIES_TRUE_CRIME', label: 'True Crime' },
  { sample: 'TV & Film', value: 'PODCASTSERIES_TV_AND_FILM', label: 'TV & Film' }
];

// Maps parent genres to their complete hierarchy (parent + all subgenres)
const GENRE_HIERARCHY = {
  PODCASTSERIES_ARTS: [
    'PODCASTSERIES_ARTS',
    'PODCASTSERIES_ARTS_BOOKS',
    'PODCASTSERIES_ARTS_DESIGN',
    'PODCASTSERIES_ARTS_FASHION_AND_BEAUTY',
    'PODCASTSERIES_ARTS_FOOD',
    'PODCASTSERIES_ARTS_PERFORMING_ARTS',
    'PODCASTSERIES_ARTS_VISUAL_ARTS'
  ],
  PODCASTSERIES_BUSINESS: [
    'PODCASTSERIES_BUSINESS',
    'PODCASTSERIES_BUSINESS_CAREERS',
    'PODCASTSERIES_BUSINESS_ENTREPRENEURSHIP',
    'PODCASTSERIES_BUSINESS_INVESTING',
    'PODCASTSERIES_BUSINESS_MANAGEMENT',
    'PODCASTSERIES_BUSINESS_MARKETING',
    'PODCASTSERIES_BUSINESS_NON_PROFIT'
  ],
  PODCASTSERIES_COMEDY: [
    'PODCASTSERIES_COMEDY',
    'PODCASTSERIES_COMEDY_IMPROV',
    'PODCASTSERIES_COMEDY_INTERVIEWS',
    'PODCASTSERIES_COMEDY_STANDUP'
  ],
  PODCASTSERIES_EDUCATION: [
    'PODCASTSERIES_EDUCATION',
    'PODCASTSERIES_EDUCATION_COURSES',
    'PODCASTSERIES_EDUCATION_HOW_TO',
    'PODCASTSERIES_EDUCATION_LANGUAGE_LEARNING',
    'PODCASTSERIES_EDUCATION_SELF_IMPROVEMENT'
  ],
  PODCASTSERIES_FICTION: [
    'PODCASTSERIES_FICTION',
    'PODCASTSERIES_FICTION_COMEDY_FICTION',
    'PODCASTSERIES_FICTION_DRAMA',
    'PODCASTSERIES_FICTION_SCIENCE_FICTION'
  ],
  PODCASTSERIES_GOVERNMENT: ['PODCASTSERIES_GOVERNMENT'],
  PODCASTSERIES_HEALTH_AND_FITNESS: [
    'PODCASTSERIES_HEALTH_AND_FITNESS',
    'PODCASTSERIES_HEALTH_AND_FITNESS_ALTERNATIVE_HEALTH',
    'PODCASTSERIES_HEALTH_AND_FITNESS_FITNESS',
    'PODCASTSERIES_HEALTH_AND_FITNESS_MEDICINE',
    'PODCASTSERIES_HEALTH_AND_FITNESS_MENTAL_HEALTH',
    'PODCASTSERIES_HEALTH_AND_FITNESS_NUTRITION',
    'PODCASTSERIES_HEALTH_AND_FITNESS_SEXUALITY'
  ],
  PODCASTSERIES_HISTORY: ['PODCASTSERIES_HISTORY'],
  PODCASTSERIES_KIDS_AND_FAMILY: [
    'PODCASTSERIES_KIDS_AND_FAMILY',
    'PODCASTSERIES_KIDS_AND_FAMILY_EDUCATION_FOR_KIDS',
    'PODCASTSERIES_KIDS_AND_FAMILY_PARENTING',
    'PODCASTSERIES_KIDS_AND_FAMILY_PETS_AND_ANIMALS',
    'PODCASTSERIES_KIDS_AND_FAMILY_STORIES_FOR_KIDS'
  ],
  PODCASTSERIES_LEISURE: [
    'PODCASTSERIES_LEISURE',
    'PODCASTSERIES_LEISURE_ANIMATION_AND_MANGA',
    'PODCASTSERIES_LEISURE_AUTOMOTIVE',
    'PODCASTSERIES_LEISURE_AVIATION',
    'PODCASTSERIES_LEISURE_CRAFTS',
    'PODCASTSERIES_LEISURE_GAMES',
    'PODCASTSERIES_LEISURE_HOBBIES',
    'PODCASTSERIES_LEISURE_HOME_AND_GARDEN',
    'PODCASTSERIES_LEISURE_VIDEO_GAMES'
  ],
  PODCASTSERIES_MUSIC: [
    'PODCASTSERIES_MUSIC',
    'PODCASTSERIES_MUSIC_COMMENTARY',
    'PODCASTSERIES_MUSIC_HISTORY',
    'PODCASTSERIES_MUSIC_INTERVIEWS'
  ],
  PODCASTSERIES_NEWS: [
    'PODCASTSERIES_NEWS',
    'PODCASTSERIES_NEWS_BUSINESS',
    'PODCASTSERIES_NEWS_COMMENTARY',
    'PODCASTSERIES_NEWS_DAILY_NEWS',
    'PODCASTSERIES_NEWS_ENTERTAINMENT',
    'PODCASTSERIES_NEWS_POLITICS',
    'PODCASTSERIES_NEWS_SPORTS',
    'PODCASTSERIES_NEWS_TECH'
  ],
  PODCASTSERIES_RELIGION_AND_SPIRITUALITY: [
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_BUDDHISM',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_CHRISTIANITY',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_HINDUISM',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_ISLAM',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_JUDAISM',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_RELIGION',
    'PODCASTSERIES_RELIGION_AND_SPIRITUALITY_SPIRITUALITY'
  ],
  PODCASTSERIES_SCIENCE: [
    'PODCASTSERIES_SCIENCE',
    'PODCASTSERIES_SCIENCE_ASTRONOMY',
    'PODCASTSERIES_SCIENCE_CHEMISTRY',
    'PODCASTSERIES_SCIENCE_EARTH_SCIENCES',
    'PODCASTSERIES_SCIENCE_LIFE_SCIENCES',
    'PODCASTSERIES_SCIENCE_MATHEMATICS',
    'PODCASTSERIES_SCIENCE_NATURAL_SCIENCES',
    'PODCASTSERIES_SCIENCE_NATURE',
    'PODCASTSERIES_SCIENCE_PHYSICS',
    'PODCASTSERIES_SCIENCE_SOCIAL_SCIENCES'
  ],
  PODCASTSERIES_SOCIETY_AND_CULTURE: [
    'PODCASTSERIES_SOCIETY_AND_CULTURE',
    'PODCASTSERIES_SOCIETY_AND_CULTURE_DOCUMENTARY',
    'PODCASTSERIES_SOCIETY_AND_CULTURE_PERSONAL_JOURNALS',
    'PODCASTSERIES_SOCIETY_AND_CULTURE_PHILOSOPHY',
    'PODCASTSERIES_SOCIETY_AND_CULTURE_PLACES_AND_TRAVEL',
    'PODCASTSERIES_SOCIETY_AND_CULTURE_RELATIONSHIPS'
  ],
  PODCASTSERIES_SPORTS: [
    'PODCASTSERIES_SPORTS',
    'PODCASTSERIES_SPORTS_BASEBALL',
    'PODCASTSERIES_SPORTS_BASKETBALL',
    'PODCASTSERIES_SPORTS_CRICKET',
    'PODCASTSERIES_SPORTS_FANTASY_SPORTS',
    'PODCASTSERIES_SPORTS_FOOTBALL',
    'PODCASTSERIES_SPORTS_GOLF',
    'PODCASTSERIES_SPORTS_HOCKEY',
    'PODCASTSERIES_SPORTS_RUGBY',
    'PODCASTSERIES_SPORTS_RUNNING',
    'PODCASTSERIES_SPORTS_SOCCER',
    'PODCASTSERIES_SPORTS_SWIMMING',
    'PODCASTSERIES_SPORTS_TENNIS',
    'PODCASTSERIES_SPORTS_VOLLEYBALL',
    'PODCASTSERIES_SPORTS_WILDERNESS',
    'PODCASTSERIES_SPORTS_WRESTLING'
  ],
  PODCASTSERIES_TECHNOLOGY: ['PODCASTSERIES_TECHNOLOGY'],
  PODCASTSERIES_TRUE_CRIME: ['PODCASTSERIES_TRUE_CRIME'],
  PODCASTSERIES_TV_AND_FILM: [
    'PODCASTSERIES_TV_AND_FILM',
    'PODCASTSERIES_TV_AND_FILM_AFTER_SHOWS',
    'PODCASTSERIES_TV_AND_FILM_FILM_REVIEWS',
    'PODCASTSERIES_TV_AND_FILM_HISTORY',
    'PODCASTSERIES_TV_AND_FILM_INTERVIEWS',
    'PODCASTSERIES_TV_AND_FILM_TV_REVIEWS'
  ]
};

// Zapier dropdown choices for languages (top 20 most popular)
const LANGUAGE_CHOICES = [
  { sample: 'English', value: 'ENGLISH', label: 'English' },
  { sample: 'Spanish', value: 'SPANISH', label: 'Spanish' },
  { sample: 'Portuguese', value: 'PORTUGUESE', label: 'Portuguese' },
  { sample: 'Chinese', value: 'CHINESE', label: 'Chinese' },
  { sample: 'French', value: 'FRENCH', label: 'French' },
  { sample: 'German', value: 'GERMAN', label: 'German' },
  { sample: 'Japanese', value: 'JAPANESE', label: 'Japanese' },
  { sample: 'Italian', value: 'ITALIAN', label: 'Italian' },
  { sample: 'Korean', value: 'KOREAN', label: 'Korean' },
  { sample: 'Russian', value: 'RUSSIAN', label: 'Russian' },
  { sample: 'Hindi', value: 'HINDI', label: 'Hindi' },
  { sample: 'Arabic', value: 'ARABIC', label: 'Arabic' },
  { sample: 'Dutch', value: 'DUTCH_FLEMISH', label: 'Dutch' },
  { sample: 'Polish', value: 'POLISH', label: 'Polish' },
  { sample: 'Turkish', value: 'TURKISH', label: 'Turkish' },
  { sample: 'Swedish', value: 'SWEDISH', label: 'Swedish' },
  { sample: 'Norwegian', value: 'NORWEGIAN', label: 'Norwegian' },
  { sample: 'Danish', value: 'DANISH', label: 'Danish' },
  { sample: 'Finnish', value: 'FINNISH', label: 'Finnish' },
  { sample: 'Indonesian', value: 'INDONESIAN', label: 'Indonesian' }
];

// Podcast content type choices
const CONTENT_TYPE_CHOICES = [
  { sample: 'Audio', value: 'AUDIO', label: 'Audio Podcasts' },
  { sample: 'Video', value: 'VIDEO', label: 'Video Podcasts' }
];

// Transcript style choices
const TRANSCRIPT_STYLE_CHOICES = [
  { sample: 'Paragraph', value: 'PARAGRAPH', label: 'Paragraph' },
  { sample: 'Utterance', value: 'UTTERANCE', label: 'Utterance (with timestamps)' }
];

// Match strategy choices for search
const MATCH_STRATEGY_CHOICES = [
  { sample: 'All Terms', value: 'ALL_TERMS', label: 'All Terms' },
  { sample: 'Exact Phrase', value: 'EXACT_PHRASE', label: 'Exact Phrase' },
  { sample: 'Most Terms', value: 'MOST_TERMS', label: 'Most Terms (default)' }
];

// Sort order choices for search
const SORT_ORDER_CHOICES = [
  { sample: 'Relevance', value: 'EXACTNESS', label: 'Relevance (best match first)' },
  { sample: 'Popularity', value: 'POPULARITY', label: 'Popularity (most popular first)' }
];

module.exports = {
  // GraphQL Fragments
  ITUNES_INFO_FRAGMENT,
  PODCAST_SERIES_FRAGMENT,
  PODCAST_SERIES_EXTENDED_FRAGMENT,
  EPISODE_FRAGMENT,
  EPISODE_EXTENDED_FRAGMENT,

  // Dropdown Choices
  GENRE_CHOICES,
  GENRE_HIERARCHY,
  LANGUAGE_CHOICES,
  CONTENT_TYPE_CHOICES,
  TRANSCRIPT_STYLE_CHOICES,
  MATCH_STRATEGY_CHOICES,
  SORT_ORDER_CHOICES
};
