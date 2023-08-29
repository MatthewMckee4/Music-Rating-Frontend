import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Route, Link, useLocation } from "react-router-dom";
import axios from "axios";

const SearchBar = ({ token }) => {
  const location = useLocation(); // Use the useLocation hook
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [menuActive, setMenuActive] = useState(false);

  const searchArtists = useCallback(async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: `artist:${searchKey}`,
          type: "artist",
          limit: 10,
        },
      });
      console.log(searchKey);
      if (data.artists && data.artists.items) {
        const filteredArtists = data.artists.items.filter(
          (artist) => artist.name.length <= 50
        );

        setArtists(filteredArtists);
      } else {
        console.error("No 'items' property in the API response:", data);
      }
    } catch (error) {
      console.error("Error searching artists:", error);
    }
  }, [searchKey, token]);

  useEffect(() => {
    if (searchKey) {
      searchArtists();
    } else {
      setArtists([]);
    }
  }, [searchKey, searchArtists]);

  useEffect(() => {
    // Clear the search key and close the menu when the route changes
    setSearchKey("");
    setMenuActive(false);
  }, [location]);

  const handleInputChange = (e) => {
    setSearchKey(e.target.value);
    setMenuActive(!!e.target.value);
  };

  const handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      setSearchKey("");
      setMenuActive(false);
    }
  };

  const handleLinkClick = () => {
    setSearchKey("");
    setMenuActive(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchKey.trim() !== "") {
      console.log("Searching for:", searchKey);
    }
  };

  return (
    <div className="searchBar">
      <div className="search-bar-container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="search-bar"
              type="text"
              placeholder="Search"
              value={searchKey}
              onChange={handleInputChange}
              onKeyDown={handleEscapeKey}
            />
          </div>
          <div>
            <button
              type="submit"
              className="search-button"
              onClick={handleSubmit}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </form>
      </div>
      {console.log(artists)}
      {artists ? (
        <div className={`searchResultsMenu ${menuActive ? "active" : ""}`}>
          {artists.length > 0 && (
            <ul className="search-results">
              {artists.map((artist) => (
                <li key={artist.id}>
                  <Link
                    to={{
                      pathname: `/artist/${artist.id}`,
                      search: `?token=${encodeURIComponent(
                        token
                      )}&artistId=${encodeURIComponent(artist.id)}`,
                    }}
                    onClick={handleLinkClick}
                  >
                    {artist.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className={`searchResultsMenu ${menuActive ? "active" : ""}`}>
          {" "}
          <ul>
            <li>No Results</li>
            <li>Logout and Login if this continues</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;