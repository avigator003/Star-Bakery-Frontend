/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

import { CacheProvider } from "@emotion/react";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import Basic from "layouts/authentication/sign-in";
import brandDark from "assets/images/logo-ct-dark.png";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    layout,
    darkMode,
    direction,
    miniSidenav,
    sidenavColor,
    whiteSidenav,
    transparentSidenav,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  const user = localStorage.getItem("user");
  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={
                  (transparentSidenav && !darkMode) || whiteSidenav
                    ? brandDark
                    : brandWhite
                }
                brandName="Material Dashboard 2"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName="Star Bakery"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route
            path="*"
            element={<Navigate to={user !== null ? "/dashboard" : "/signin"} />}
          />
          <Route path="/signin" element={<Basic />} />
          {user !== null && getRoutes(routes)}
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
