import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import {
  IAnime,
  IAnimeInfo,
  IRecentAnime,
  IRecommendations,
  ISearchedAnime,
  ITrending,
} from "../types/anime.types";

const baseUrl =
  process.env.CONSUMET_URL || "https://consumet-api.vercel.app";

const BASE_BACKEND_URL: string = process.env.BASE_BACKEND_URL as string;

/* ============================= */
/* 🔥 TRENDING */
/* ============================= */
export const getTrendingAnime = async (limit: number, page: number) => {
  try {
    const { data } = await axios.get(
      "https://consumet-api.vercel.app/meta/anilist/trending",
      {
        params: { perPage: limit, page },
      }
    );

    return data;
  } catch (error: any) {
    console.error("🔥 TRENDING FULL ERROR:");
    console.error(error?.response?.data || error);
    throw error; // <-- IMPORTANT (temporary)
  }
};

/* ============================= */
/* 🔥 POPULAR */
/* ============================= */
export const getPopularAnime = async (limit: number, page: number) => {
  try {
    const { data } = await axios.get(
      "https://consumet-api.vercel.app/meta/anilist/popular",
      {
        params: { perPage: limit, page },
      }
    );

    return data;
  } catch (error: any) {
    console.error("🔥 POPULAR FULL ERROR:");
    console.error(error?.response?.data || error);
    throw error;
  }
};

/* ============================= */
/* 🔥 INFO */
/* ============================= */
export const getAnimeInfoById = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/meta/anilist/info/${id}`
    );
    return data as IAnimeInfo;
  } catch (error: any) {
    console.error("INFO ERROR:", error?.response?.data || error.message);
    return null;
  }
};

/* ============================= */
/* 🔥 ❗ FIXED: EPISODES */
/* ============================= */
export const getAnimeEpisodesById = async (id: string) => {
  try {
    // ✅ Consumet does NOT provide episodes directly here
    // You already fetch episodes via scrapeEpisodes in controller
    return null;
  } catch (error: any) {
    console.error("EPISODE ERROR:", error?.response?.data || error.message);
    return null;
  }
};

/* ============================= */
/* 🔥 SEARCH */
/* ============================= */
export const getSearchedAnime = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/meta/anilist/${query}`,
      {
        params: { perPage: limit, page },
      }
    );
    return data as ISearchedAnime;
  } catch (error: any) {
    console.error("SEARCH ERROR:", error?.response?.data || error.message);
    return null;
  }
};

/* ============================= */
/* 🔥 STREAM */
/* ============================= */
export const getAnimeEpisodesStream = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/anime/gogoanime/watch/${id}`
    );
    return data;
  } catch (error: any) {
    console.error("STREAM ERROR:", error?.response?.data || error.message);
    return null;
  }
};

/* ============================= */
/* 🔥 RECOMMENDATIONS */
/* ============================= */
export const getAnimeRecommendationById = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/meta/anilist/recommendations/${id}`
    );
    return data as IRecommendations;
  } catch (error: any) {
    console.error(
      "RECOMMENDATION ERROR:",
      error?.response?.data || error.message
    );
    return null;
  }
};

/* ============================= */
/* 🔥 EXTRA BACKEND */
/* ============================= */

interface Episode {
  episodeNumber: number;
  episodeId: string;
}

export const scrapeEpisodes = async (id: string): Promise<Episode[]> => {
  try {
    const { data } = await axios.get(
      `${BASE_BACKEND_URL}/api/v1/episode/${id}`
    );
    return data.episodes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchRecentAnimes = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_BACKEND_URL}/api/v1/recentepisode/all`
    );
    return data as IRecentAnime;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const mergeAnilistIdFromTitle = async (title: string) => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/meta/anilist/${title}`
    );
    return data?.results as IAnime[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAnimeMovies = async (page: string) => {
  try {
    const { data } = await axios.get(
      `${BASE_BACKEND_URL}/api/v1/movies/${page}`
    );
    return data as IRecentAnime;
  } catch (error) {
    console.log(error);
    return null;
  }
};
