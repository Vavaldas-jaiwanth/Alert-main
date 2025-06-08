import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { logout } from "../../store/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const drawerWidth = 240;

const mainNavItems = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "do's & dont's",
    link: "/do&donts",
  },
  {
    title: "NEWS",
    link: "/NewsFeed",
  },
  {
    title: "Donate",
    link: "/Donate",
  },
];

const reliefNavItems = [
  {
    title: "All Relief Centers",
    link: "agency/relief-center",
  },
  {
    title: "My Relief Center",
    link: "agency/my-relief-center",
  },
];

const collectionNavItems = [
  {
    title: "All Collection Centers",
    link: "agency/collection-center",
  },
  {
    title: "My Collection Center",
    link: "agency/my-collection-center",
  },
];

function DrawerAppBar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agencykey = queryParams.get("key");
  console.log("navbar.jsx:", agencykey);
  const SECRET_KEY = process.env.AGENCY_KEY || "india1";
  const handleLogout = () => {
    dispatch(logout());
    navigate(`/agency?key=${agencykey}`);
    Cookies.remove("Token");
  };

  useEffect(() => {
    const isAgencyPath = location.pathname.startsWith("/agency");

    // If user is on a public route, and is incorrectly showing as agency -> reset
    if (
      !isAgencyPath &&
      isAuthenticated &&
      (role === "relief" || role === "collection")
    ) {
      console.log("Resetting stale agency session");
      dispatch(logout());
      Cookies.remove("Token");
    }
  }, [location.pathname, isAuthenticated, role]);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const hideOnRoutes = ["/agency", "/agency/register"];
  if (
    hideOnRoutes.includes(location.pathname) &&
    location.search.includes(`key=${agencykey}`)
  ) {
    return null;
  }
  const navItems = {
    default: mainNavItems,
    relief: reliefNavItems.map((item) => ({
      ...item,
      link: `${item.link}?key=${agencykey}`,
    })),
    collection: collectionNavItems.map((item) => ({
      ...item,
      link: `${item.link}?key=${agencykey}`,
    })),
  };

  let currentNavItems = mainNavItems;

  if (isAuthenticated) {
    currentNavItems = navItems[role] || [];
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const activeStyle = {
    textDecoration: "none",
    backgroundColor: "skyblue",
    borderRadius: ".5rem",
    padding: ".1rem",
    textAlign: "center",
  };

  const nonActiveStyle = {
    textDecoration: "none",
    textAlign: "center",
  };

  const navbarStyles = {
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
  };

  const navLinkStyles = {
    color: "#fff",
    textDecoration: "none",
    padding: "0.5rem 1rem",
  };

  const navLinkHoverStyles = {
    backgroundColor: "#333",
  };

  const signInButtonStyles = {
    backgroundColor: "#0066ff",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "4px",
  };

  const signInButtonHoverStyles = {
    backgroundColor: "#0052cc",
  };

  const mediaQueryTabletStyles = {
    navbar: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    navLinks: {
      flexDirection: "column",
      width: "100%",
    },
    navLink: {
      textAlign: "left",
      width: "100%",
      boxSizing: "border-box",
    },
    signInButton: {
      width: "100%",
      marginTop: "0.5rem",
    },
  };

  const mediaQueryMobileStyles = {
    navbar: {
      padding: "0.5rem",
    },
    navLink: {
      padding: "0.5rem",
    },
    signInButton: {
      padding: "0.5rem",
    },
  };

  return (
    <Box sx={{ display: "flex", mb: 10 }}>
      <AppBar
        component="nav"
        position="fixed"
        color="primary"
        sx={{
          boxShadow: "none",
          p: 0,
          ...navbarStyles, // Apply inline styles
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Co-Rescue App
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {currentNavItems.map((item, val) => (
                <NavLink
                  key={val}
                  to={item.link}
                  style={
                    ({ isActive }) =>
                      isActive
                        ? { ...navLinkStyles, ...navLinkHoverStyles } // Apply inline styles
                        : navLinkStyles // Apply inline styles
                  }
                >
                  <Button key={val} sx={{ color: "#fff" }}>
                    {item.title}
                  </Button>
                </NavLink>
              ))}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    ...signInButtonStyles, // Apply inline styles
                    backgroundColor: "white",
                    color: "#fff",
                    ml: 4,
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={
            window !== undefined ? () => window().document.body : undefined
          }
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Co-Rescue
            </Typography>
            <Divider />
            <List>
              {currentNavItems.map((item, val) => (
                <ListItem key={val} disablePadding>
                  <ListItemButton
                    sx={{ textAlign: "center" }}
                    onClick={() => navigate(item.link)}
                  >
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
