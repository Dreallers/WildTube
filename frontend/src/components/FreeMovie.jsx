import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import CommentsSection from "./CommentsSection";
import { useUser } from "../contexts/UserContext";

function FreeMovie({ movie }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const location = useLocation();

  // Implement this function to check favorited state
  const checkIfFavorited = async (myMovieId) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/favorites/film/${
        user.id
      }`;

      const response = await axios.get(url);

      if (response.data.some((fav) => fav.filmId === myMovieId)) {
        setIsFavorited(true);
        return true;
      }

      setIsFavorited(false);
      return false;
    } catch (error) {
      console.error("Error checking favorite status", error);
      return null;
    }
  };
  const handleClick = () => {
    navigate(`/EditVideo/${movie.id}`);
  };

  const handleFavoriteClick = async (myMovieId) => {
    const urlForPosting = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/favorites/film`;
    const urlForDeleting = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/favorites/film/${user.id}/${myMovieId}`;
    const data = {
      userId: user.id,
      filmId: myMovieId,
    };

    const isFavorite = await checkIfFavorited(myMovieId);

    if (isFavorite) {
      axios
        .delete(urlForDeleting, data)
        .then(() => {
          setIsFavorited(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(urlForPosting, data)
        .then(() => {
          setIsFavorited(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Implement this function to handle watchlist click
  const checkIfWatchlisted = async (myMovieId) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/watchlist/film/${
        user.id
      }`;

      const response = await axios.get(url);

      if (response.data.some((fav) => fav.filmId === myMovieId)) {
        setIsWatchlisted(true);
        return true;
      }

      setIsWatchlisted(false);
      return false;
    } catch (error) {
      console.error("Error checking watchlist status", error);
      return null;
    }
  };

  const handleWatchlistClick = async (myMovieId) => {
    const urlForPosting = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/watchlist/film`;
    const urlForDeleting = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/watchlist/film/${user.id}/${myMovieId}`;
    const data = {
      userId: user.id,
      filmId: myMovieId,
    };

    const isWatchlistedStatement = await checkIfWatchlisted(myMovieId);

    if (isWatchlistedStatement) {
      axios
        .delete(urlForDeleting, data)
        .then(() => {
          setIsWatchlisted(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(urlForPosting, data)
        .then(() => {
          setIsWatchlisted(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (user && movie?.id) {
      checkIfFavorited(movie.id);
    }
  }, [user, movie.id]);

  useEffect(() => {
    if (user && movie?.id) {
      checkIfWatchlisted(movie.id);
    }
  }, [user, movie.id]);

  const handleshare = () => {
    const movieUrl = `${import.meta.env.VITE_BACKEND_URL}/movies/${movie?.id}`;

    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: movie?.description,
        url: movieUrl,
      });
    } else {
      const mailToLink = `mailto:?subject=${movie?.title}&body=${movie?.description} ${movieUrl}`;
      window.location.href = mailToLink;
    }
  };

  return (
    movie && (
      <div className="movie-page-details" key={movie?.id}>
        <div
          className="movie-information-display"
          style={
            location.pathname.includes("/movies/")
              ? {
                  paddingBottom: "19.6875vw",
                }
              : {}
          }
        >
          <div className="thumbnail-container">
            <img
              className="movie-cover"
              src={
                (movie?.cover_filename &&
                  `${import.meta.env.VITE_BACKEND_URL}/assets/images/${
                    movie?.cover_filename
                  }`) ||
                movie?.cover_url
              }
              alt={movie?.title}
            />
            <div className="upper-layer">
              <NavLink
                className="play-button-container"
                to={`/moviePlayer/${movie?.id}`}
              >
                <img
                  className="play-button"
                  src={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/assets/icons/play_button_icon.svg`}
                  alt="play button"
                />
              </NavLink>
            </div>
          </div>
          <div className="details-option-wrapper">
            <div className="details-container">
              <p className="movie-info release-year">{movie?.year}</p>
              <p className="separator">•</p>
              <p className="movie-info duration">{movie?.duration}m</p>
            </div>
            {user && (
              <div className="ActionIcons">
                <button
                  type="button"
                  className="ThumbsUpRegular1"
                  onClick={() => handleshare(movie)}
                >
                  <img
                    className="favourite-icon"
                    src={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/assets/icons/partage.svg`}
                    alt="partage"
                  />
                </button>
                <button
                  className="ThumbsUpRegular1"
                  type="button"
                  onClick={() => handleFavoriteClick(movie?.id)}
                >
                  <img
                    className="favourite-icon"
                    src={
                      !isFavorited
                        ? `${
                            import.meta.env.VITE_BACKEND_URL
                          }/assets/icons/favourite-icon.svg`
                        : `${
                            import.meta.env.VITE_BACKEND_URL
                          }/assets/icons/thumbs-up-solid.svg`
                    }
                    alt="favourite icon"
                  />
                </button>
                {user.IsAdmin === 1 && (
                  <button
                    className="ThumbsUpRegular1"
                    type="button"
                    onClick={handleClick}
                  >
                    <img
                      className="favourite-icon"
                      src={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/assets/icons/edit.png`}
                      alt="edit icon"
                    />
                  </button>
                )}
                <button
                  className="ThumbsUpRegular1"
                  type="button"
                  onClick={() => handleWatchlistClick(movie?.id)}
                >
                  <img
                    className="favourite-icon"
                    src={
                      !isWatchlisted
                        ? `${
                            import.meta.env.VITE_BACKEND_URL
                          }/assets/icons/watchlist-icon.svg`
                        : `${
                            import.meta.env.VITE_BACKEND_URL
                          }/assets/icons/check-solid.svg`
                    }
                    alt="watchlist icon"
                  />
                </button>
              </div>
            )}
          </div>
          <div className="description-container">
            <p className="movie-title">{movie?.title}</p>
            <p className="movie-description">{movie?.description}</p>
          </div>
          <CommentsSection filmId={movie?.id} user={user} />
        </div>
      </div>
    )
  );
}

FreeMovie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cover_filename: PropTypes.string,
    cover_url: PropTypes.string,
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default FreeMovie;
