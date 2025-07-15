import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GiHamburgerMenu } from "react-icons/gi";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 300, height: 1, bgcolor: '#eee9d5' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key="close">
          <ListItemButton onClick={toggleDrawer(false)}>
            <ListItemText className="text-right">
              <span className="text-3xl">&times;</span>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem key="home">
          <ListItemButton href="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem key="about">
          <ListItemButton href="/about.html">
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} className="p-0!"><GiHamburgerMenu className="text-black dark:text-[#cdd6f4] w-9 h-9"/></Button>
      <Drawer open={open} onClose={toggleDrawer(false)} >
        {DrawerList}
      </Drawer>
    </div>
  );
}
