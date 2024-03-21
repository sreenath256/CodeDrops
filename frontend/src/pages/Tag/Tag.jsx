import React, { useEffect } from "react";
import DropBlocksList from "../../components/DropBlock/DropBlockList";
import axiosClient from "../../axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ShimmerSearch from "../../components/Shimmer/ShimmerSearch";
import ShimmerDropBlock from "../../components/Shimmer/ShimmerDropBlock";
import { useParams } from "react-router-dom";

const Tag = () => {

    const { id, tag } = useParams()

    const fetchUserDrops = async () => {
        const response = await axiosClient.get(`/drop/tag/${id}`);
        return response.data;
    };

    const queryClient = useQueryClient();

    const { data: drops, isLoading, isError, error } = useQuery({
        queryKey: ['tagdrops', id],
        queryFn: fetchUserDrops,
    });

    if (isLoading) {
        return <>
            <div className="w-full max-w-3xl sm:pt-8 p-4 pt-6 sm:px-0">
                <ShimmerSearch />
                <ShimmerDropBlock />
                <ShimmerDropBlock />
                <ShimmerDropBlock />
                <ShimmerDropBlock />
            </div>
        </>
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex align-center justify-self-center w-full">
            <DropBlocksList dropBlocks={drops} title={`${tag} Drops`} />
        </div>
    );
};

export default Tag;