import React, { useEffect, useState } from "react";
import DropBlock from "./DropBlock";

const DropBlocksList = ({ dropBlocks, title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDropBlocks, setfilteredDropBlocks] = useState(dropBlocks.data)


  useEffect(() => {
    const getData = setTimeout(() => {
      setfilteredDropBlocks(dropBlocks.data.filter((block) =>
        block.dropname.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }, 1000)
    return () => clearTimeout(getData)
  }, [searchTerm])



  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <center className="self-center text-5xl my-8 font-bold text-black dark:text-gray-300">
        <b>{title}</b>
      </center>
      <center>
        <input
          type="text"
          placeholder={"Search" + " " + title + "..."}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-4 p-5 flex w-full focus:outline-none bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-900 dark:border-gray-700 p-5 mb-4 "
        />
      </center>

      {filteredDropBlocks.map((block, index) => (
        <DropBlock
          key={index}
          dropname={block.dropname}
          dropbody={block.dropbody}
          tags={block.tags}
          slug={block.slug}
          userid={block.user._id}
          username={block.user.name}
          dropid={block._id}
        />
      ))}
    </div>
  );
};

export default DropBlocksList;