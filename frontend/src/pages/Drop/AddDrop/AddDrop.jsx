import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../../axios';
import convertToSlug from "../../../utils/slugify";
import toast from 'react-hot-toast';


const AddDrop = () => {
    const [dropName, setdropName] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const [showError, setShowError] = useState(null)
    const navigate = useNavigate();
    const [Tags, setTags] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTags, setFilteredTags] = useState([]);
    const queryClient = useQueryClient();

    const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

    const fetchTags = async () => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
        const headers = {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        };
        const response = await axiosClient.get('/tag', { headers });
        setTags(response.data.data);
        setFilteredTags(response.data.data);
        return response.data.data; // Assuming your API response contains an array of drops
    };

    const { data: tags, isError, error } = useQuery({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);

        // Filter tags based on the search input value
        const filtered = Tags.filter(tag => tag.tagName.toLowerCase().includes(value.toLowerCase()));
        setFilteredTags(filtered);
    };

    const handleTagToggle = (tagid) => {
        if (selectedTags.includes(tagid)) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tagid));
        } else {
            setSelectedTags([...selectedTags, tagid]);
        }
    };

    const handleAddDrop = async () => {
        let dropbody;
        let authorid = localStorage.getItem("userid");
        if (editorRef.current) {
            dropbody = editorRef.current.getContent();
        }
        let data = {
            dropname: dropName,
            dropbody: dropbody,
            tags: selectedTags,
            user: authorid,
        }
        const slug = convertToSlug(data.dropname);
        data = {
            ...data,
            slug: slug
        };
        setIsLoading(true);
        mutateAsync(data);
    };

    const { mutateAsync } = useMutation({
        mutationFn: (data) => {
            const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
            const headers = {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            };
            return axiosClient.post('/drop/', data, { headers });
        },
        onSuccess: () => {
            // Handle success, navigate to a different page or show a success message
            queryClient.invalidateQueries('drops');
            navigate("/");
            toast.success('Drop Added Successfully!');
        },
        onError: (error) => {
            setShowError('Error occurred while adding drop. Please try again.');
            setIsLoading(false);
        },
    });


    return (
        <main className="w-full mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                    <center className="self-center text-2xl mb-5 font-bold block font-bold text-gray-900 dark:text-white">
                        <b>Add Drop</b>
                    </center>
                    <form className="mx-auto px-6 pt-6 pb-2 rounded-md">
                        <div className="mb-4">
                            <label
                                htmlFor="dropName"
                                className="block text-sm mb-2 dark:text-white"
                            >
                                Drop Name
                            </label>
                            <input
                                type="text"
                                id="dropName"
                                name="dropName"
                                onChange={(e) => {
                                    setdropName(e.target.value);
                                }}
                                className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                            />
                        </div>

                        <div className="mb-8">
                            <label
                                htmlFor="description"
                                className="block text-sm mb-2 dark:text-white mb-4"
                            >
                                Drop Body
                            </label>

                            <Editor
                                apiKey={apiKey}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue="<p>This is the initial content of the editor.</p>"
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "code",
                                        "help",
                                        "wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | blocks | " +
                                        "bold italic forecolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style:
                                        "body { font-family:'Poppins', sans-serif; font-size:16px }",
                                    skin: (document.body.classList.contains('dark') ? "oxide-dark" : "oxide"),
                                    content_css: (document.body.classList.contains('dark') ? "dark" : "default")
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-sm mb-2 dark:text-white"
                            >
                                Drop Tags
                            </label>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search tags"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="border py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-wrap">
                                {filteredTags.map((tag) => (
                                    <div
                                        key={tag._id}
                                        onClick={() => handleTagToggle(tag._id)}
                                        className={`cursor-pointer border border-1 border-green-700 rounded-full px-3 py-1 m-2 
            ${selectedTags.includes(tag._id) ? "bg-green-700 text-white" : "text-green-600"}`}
                                    >
                                        {tag.tagName}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-orange-700 text-xs dark:text-orange-500">
                                    Crafted with 💚 by <b> {localStorage.getItem("username")}</b>
                                </p>
                                <button
                                    type="button"
                                    onClick={handleAddDrop}
                                    className="bg-green-700 mt-4 hover:bg-green-800 font-bold text-green-100 py-2 px-4 rounded-full"
                                >
                                    Add Drop
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AddDrop;