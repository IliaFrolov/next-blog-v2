import React, { FC } from 'react';

interface SearchBarProps { }

const SearchBar: FC<SearchBarProps> = ({ }) => {
    return <input
        placeholder="search..."
        type="text"
        className='transition border-2 rounded focus:border-primary-dark dark:focus:border-primary outline-none bg-transparent border-secondary-dark p-2 text-primary-dark dark:text-primary' />;
};

export default SearchBar;