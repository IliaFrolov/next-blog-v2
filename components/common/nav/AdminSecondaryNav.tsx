import React, { FC } from 'react';
import DropdownOptions, { DdOptions } from '../DropdownOptions';
import ProfileHead from '../ProfileHead';
import { useRouter } from 'next/router';
import useDarkMode from 'hooks/useDarkMode';
import { signOut } from 'next-auth/react';
import SearchBar from '../SearchBar';

interface AdminSecondaryNavProps { }

const AdminSecondaryNav: FC<AdminSecondaryNavProps> = ({ }) => {
    const { push } = useRouter();
    const { toggleTheme } = useDarkMode();
    const navigateToCreateNewPost = () => push('/admin/posts/create');
    const handleLogout = async () => await signOut();

    const options: DdOptions = [{
        label: 'Add new post',
        onClick: navigateToCreateNewPost,
    },
    {
        label: 'Change theme',
        onClick: toggleTheme,
    },
    {
        label: 'Log out',
        onClick: handleLogout,
    }]
    return (
        <div className='flex items-center justify-between'>
            <SearchBar />
            <DropdownOptions head={<ProfileHead nameInitial='J' />} options={options} />
        </div>);
};

export default AdminSecondaryNav;