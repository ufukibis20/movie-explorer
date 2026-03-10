# Movie Explorer

A modern movie search application built with React and TypeScript using the TMDB API.

## Live Demo

[Open the live app](https://movie-explorer-jet-delta.vercel.app)


## Screenshot

![Movie Explorer Screenshot](./movie-explorer-screenshot.png)


## Overview

Movie Explorer is a frontend project that allows users to search for movies, view details, and save favorites locally in the browser.

## Features

- Search movies via TMDB API
- Display movie posters, ratings, and release dates
- Responsive card layout
- Favorite movies with Local Storage persistence
- Dedicated favorites section
- Movie detail modal
- Error and loading states

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- TMDB API
- Local Storage API

## Project Structure

```bash
src/
  components/
    MovieCard.tsx
    MovieModal.tsx
  pages/
    Home.tsx
    Home.css
  services/
    api.ts
  types/
    movie.ts
  App.tsx
  ```
  ## Getting Started

  ```bash
  npm install
  ```

  ## Start development server
  ```bash
  npm install
  ```

  ## Build for production
  ```bash
  npm run dev
  ```

  ## Environment Variables

  Create a .env file in the project root and add your TMDB API key:

  ```env
  VITE_TMDB_API_KEY=your_api_key_here
  ```

## Learning Goals

This project was built to strengthen practical frontend development skills in:

- API integration with React
- TypeScript typing for external data
- Component-based architecture
- State management with React Hooks
- Conditional rendering
- Local Storage persistence
- Responsive UI design
- Modal interactions

## Author

Ufuk Ibis  
GitHub: https://github.com/ufukibis20
