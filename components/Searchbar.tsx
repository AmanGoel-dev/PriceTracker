"use client";
import { ScrapeAndStoreProduct } from "@/libs/actions";
import { findSourceMap } from "module";
import { hostname } from "os";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
// checking wheter the url is of amazon or not
const isValidAmazonUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostName = parsedUrl.hostname;
    if (
      hostName.includes("amazon.com") ||
      hostName.includes("amazon.") ||
      hostName.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchprompt, SetSearchprompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isvalidLink = isValidAmazonUrl(searchprompt);
    if (!isvalidLink) {
      toast.error("Please provide a valid url");
    }
    try {
      setIsLoading(true);
      const product = await ScrapeAndStoreProduct(searchprompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className=" flex flex-wrap  gap-4' mt-12 " onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchprompt}
        onChange={(e) => {
          SetSearchprompt(e.target.value);
        }}
        placeholder="Enter product link"
        className=" searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchprompt === ""}
      >
        {isLoading ? "Searching...." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
