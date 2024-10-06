import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-indigo-800">
            <Toolbar className="justify-between">
                <Box className="flex items-center">
                    <Link to="/yt_sm">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ9-g_Ke8MgmhbrEJTiO1FX1KQQObXCmh3Fg&s"
                            alt="Logo"
                            className="h-8 w-8 mr-2"
                        />
                    </Link>
                </Box>
                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/yt_sm"
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    Summarizer
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
