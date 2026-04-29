import { Request, Response } from "express";
import {
  fetchRecentAnimes,
  getAnimeEpisodesStream,
  getAnimeInfoById,
  getAnimeMovies,
  getAnimeRecommendationById,
  getPopularAnime,
  getSearchedAnime,
  getTrendingAnime,
  scrapeEpisodes,
} from "../helpers/helper";
import axios from "axios";
import { createAnimeId } from "../lib/utils";

/**
 * TRENDING
 */
export const trending = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const anime: any = await getTrendingAnime(limit, page);

    if (!anime?.results) {
      console.error("❌ TRENDING EMPTY:", anime);
      return res.status(500).json({ message: "Trending failed" });
    }

    const results = anime.results
      .filter((a: any) => a?.title && a.status !== "NOT_YET_RELEASED")
      .map((a: any) => ({
        ...a,
        animeId: createAnimeId(
          a.title?.userPreferred,
          a.title?.english,
          a.id
        ),
      }));

    return res.status(200).json({
      results,
      page: anime.page,
    });
  } catch (error) {
    console.error("🔥 TRENDING ERROR:", error);
    return res.status(500).json({ message: "Trending failed" });
  }
};

/**
 * POPULAR
 */
export const popular = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const anime: any = await getPopularAnime(limit, page);

    if (!anime?.results) {
      console.error("❌ POPULAR EMPTY:", anime);
      return res.status(500).json({ message: "Popular failed" });
    }

    const results = anime.results.map((a: any) => ({
      ...a,
      animeId: createAnimeId(
        a.title?.userPreferred,
        a.title?.english,
        a.id
      ),
    }));

    return res.status(200).json({
      results,
      page: anime.page,
    });
  } catch (error) {
    console.error("🔥 POPULAR ERROR:", error);
    return res.status(500).json({ message: "Popular failed" });
  }
};

/**
 * INFO
 */
export const info = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Anime id required!" });
    }

    const animeInfo: any = await getAnimeInfoById(id as string);

    if (!animeInfo) {
      return res.status(404).json({ message: "Anime not found!" });
    }

    const animeId = createAnimeId(
      animeInfo.title?.userPreferred,
      animeInfo.title?.english,
      animeInfo.id
    );

    let episodes: any[] = [];

    if (animeInfo?.id_provider?.idGogo) {
      episodes = await scrapeEpisodes(animeInfo.id_provider.idGogo);
    } else {
      const { data } = await axios.get(
        `https://consumet-api.vercel.app/anime/gogoanime/${animeInfo.title?.userPreferred}`
      );

      const gogoId = data?.results?.[0]?.id;

      if (gogoId) {
        episodes = await scrapeEpisodes(gogoId);
      }
    }

    return res.status(200).json({
      ...animeInfo,
      animeId,
      anime_episodes: episodes.reverse(),
    });
  } catch (error) {
    console.error("🔥 INFO ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch info" });
  }
};

/**
 * SEARCH
 */
export const searched = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query required!" });
    }

    const data: any = await getSearchedAnime(
      query as string,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 12
    );

    if (!data?.results) {
      return res.status(404).json({ message: "No results" });
    }

    const results = data.results.map((a: any) => ({
      ...a,
      animeId: createAnimeId(
        a.title?.userPreferred,
        a.title?.english,
        a.id
      ),
    }));

    return res.status(200).json({ results });
  } catch (error) {
    console.error("🔥 SEARCH ERROR:", error);
    return res.status(500).json({ message: "Search failed" });
  }
};

/**
 * STREAM
 */
export const stream = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const data = await getAnimeEpisodesStream(id as string);

    if (!data) {
      return res.status(404).json({ message: "Stream not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("🔥 STREAM ERROR:", error);
    return res.status(500).json({ message: "Streaming failed" });
  }
};

/**
 * EPISODE
 */
export const episode = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Episode id required!" });
    }

    const data = await scrapeEpisodes(id as string);

    return res.status(200).json(data);
  } catch (error) {
    console.error("EPISODE ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch episodes" });
  }
};

/**
 * RECOMMENDATIONS
 */
export const recommendations = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const data: any = await getAnimeRecommendationById(id as string);

    if (!data?.results) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    return res.status(200).json(data.results);
  } catch (error) {
    console.error("RECOMMEND ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

/**
 * RECENTS
 */
export const recents = async (_req: Request, res: Response) => {
  try {
    const data: any = await fetchRecentAnimes();

    if (!data?.results) {
      return res.status(404).json({ message: "No recents found" });
    }

    return res.status(200).json(data.results);
  } catch (error) {
    console.error("RECENTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch recents" });
  }
};

/**
 * MOVIES
 */
export const movies = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;

    const data: any = await getAnimeMovies((page as string) || "1");

    if (!data?.results) {
      return res.status(404).json({ message: "No movies found" });
    }

    return res.status(200).json(data.results);
  } catch (error) {
    console.error("MOVIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch movies" });
  }
};