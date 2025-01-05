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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import TruckLoading from "./layouts/truck/TruckLoading";
import User from "layouts/user";

// @mui icons
import Icon from "@mui/material/Icon";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import AdUnitsIcon from "@mui/icons-material/AdUnits";
import Category from "layouts/category/Category";
import CategoryList from "layouts/category/components/category-table/CategoryList";
import UserList from "layouts/user/components/user-table/UserList";
import Product from "layouts/product/Product";
import ProductList from "layouts/product/components/product-table/ProductList";
import RawMaterial from "layouts/raw-material/RawMaterial";
import RawMaterialList from "layouts/raw-material/components/raw-material-table/RawMaterialList";
import RawMaterialBillList from "layouts/raw-material/components/raw-material-table/RawMaterialBillList";
import RawMaterialCategoryList from "layouts/raw-material/components/raw-material-table/category/RawMaterialCategoryList";
import RawMaterialHistoryList from "layouts/raw-material/components/raw-material-history-table/RawMaterialHistoryList";
import Stock from "layouts/stock/Stock";
import StockList from "layouts/stock/components/stock-table/StockList";
import Labour from "layouts/labour/Labour";
import LabourList from "layouts/labour/components/labour-table/LabourList";
import LabourAttendance from "layouts/labour/components/labour-attendance/LabourAttendance";
import SeeAttendance from "layouts/labour/components/labour-attendance/SeeAttendance";
import LabourPayment from "layouts/labour/components/labour-payment/LabourPayment";
import SeePayment from "layouts/labour/components/labour-payment/SeePayment";
import Order from "layouts/order/Order";
import OrderList from "layouts/order/components/order-table/OrderList";
import RawMaterialBill from "layouts/raw-material/RawMaterialBill";
import Expense from "layouts/expense/Expense";
import ExpenseList from "layouts/expense/components/expense-table/ExpenseList";
import Rent from "layouts/rent/Rent";
import RentList from "layouts/rent/components/rent-table/RentList";
import Vehicle from "layouts/vehicle/Vehicle";
import VehicleList from "layouts/vehicle/components/vehicle-table/VehicleList";
import Seller from "layouts/seller/Seller";
import SellerList from "layouts/seller/components/seller-table/CreateList";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "/dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Truck Loading",
    key: "/truck_laoding",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/truck_laoding",
    component: <TruckLoading />,
  },
  {
    type: "divider",
  },
  {
    type: "title",
    name: "User Management",
    icon: <Icon fontSize="small">people</Icon>,
  },
  {
    type: "collapse-children",
    name: "Create User",
    key: "/user/create",
    route: "/user/create",
    icon: <Icon fontSize="small">add</Icon>,
    component: <User />,
  },
  {
    type: "collapse-children",
    name: "User List",
    key: "/user/list",
    route: "/user/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <UserList />,
  },
  {
    type: "hidden",
    name: "Edit User",
    key: "edit user",
    route: `/user/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <User isEdit={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "View User",
    key: "view user",
    route: `/user/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <User isView={true} isCreate={false} />,
  },
  {
    type: "divider",
  },

  {
    type: "title",
    name: "Category Management",
    icon: <Icon fontSize="small">category</Icon>,
  },

  {
    type: "collapse-children",
    name: "Create Category",
    key: "/category/create",
    route: "/category/create",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Category />,
  },
  {
    type: "collapse-children",
    name: "Category List",
    key: "/category/list",
    route: "/category/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <CategoryList />,
  },
  {
    type: "hidden",
    name: "Edit Category",
    key: "edit category",
    route: `/category/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Category isEdit={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "View Category",
    key: "view category",
    route: `/category/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Category isView={true} isCreate={false} />,
  },
  {
    type: "divider",
  },

  {
    type: "title",
    name: "Product Management",
    icon: <Icon fontSize="small">shopping</Icon>,
  },

  {
    type: "collapse-children",
    name: "Create Product",
    key: "/product/create",
    route: "/product/create",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Product />,
  },
  {
    type: "collapse-children",
    name: "Product List",
    key: "/product/list",
    route: "/product/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <ProductList />,
  },
  {
    type: "hidden",
    name: "Edit Product",
    key: "edit product",
    route: `/product/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Product isEdit={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "View Prodcut",
    key: "view product",
    route: `/product/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Product isView={true} isCreate={false} />,
  },
  {
    type: "divider",
  },

  {
    type: "title",
    name: "Raw Material Management",
    icon: <LocalShippingIcon fontSize="small" />,
  },

  {
    type: "collapse-children",
    name: "Add Raw Material Bill",
    key: "/raw-material-bill/add",
    route: "/raw-material-bill/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <RawMaterialBill />,
  },
  {
    type: "collapse-children",
    name: "Add Raw Material",
    key: "/raw-material/add",
    route: "/raw-material/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <RawMaterial />,
  },

  {
    type: "collapse-children",
    name: "Raw Material Bill List",
    key: "/raw-material-bill/list",
    route: `/raw-material-bill/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <RawMaterialBillList />,
  },

  {
    type: "hidden",
    name: "Raw Material Edit",
    key: "/raw-material-bill/edit",
    route: `/raw-material-bill/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <RawMaterialBill isEdit={true} isCreate={false} />,
  },
  {
    type: "collapse-children",
    name: "Raw Material List",
    key: "/raw-material/list",
    route: `/raw-material/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <RawMaterialList />,
  },

  {
    type: "collapse-children",
    name: "Category List",
    key: "/raw-material-category/list",
    route: `/raw-material-category/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <RawMaterialCategoryList />,
  },
  {
    type: "hidden",
    name: "Raw Material History",
    key: "/raw-material/history",
    route: `/raw-material/history`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <RawMaterialHistoryList />,
  },
  {
    type: "hidden",
    name: "Raw Material View",
    key: "/raw-material/view",
    route: `/raw-material/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <RawMaterial isView={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "Raw Material Edit",
    key: "/raw-material/edit",
    route: `/raw-material/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <RawMaterial isEdit={true} isCreate={false} />,
  },
  {
    type: "divider",
  },
  {
    type: "title",
    name: "Expense Management",
    icon: <Icon fontSize="small">inventory</Icon>,
  },

  {
    type: "collapse-children",
    name: "Add Expense",
    key: "/expense/add",
    route: "/expense/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Expense />,
  },

  {
    type: "collapse-children",
    name: "Expense List",
    key: "/expense/list",
    route: `/expense/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <ExpenseList />,
  },

  {
    type: "hidden",
    name: "Expense Bill Edit",
    key: "/expense/edit",
    route: `/expense/edit`,
    icon: <Icon fontSize="small">edit</Icon>,
    component: <Expense isEdit={true} isCreate={false} />,
  },

  {
    type: "divider",
  },

  {
    type: "title",
    name: "Rent Management",
    icon: <Icon fontSize="small">inventory</Icon>,
  },

  {
    type: "collapse-children",
    name: "Add Rent",
    key: "/rent/add",
    route: "/rent/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Rent />,
  },

  {
    type: "collapse-children",
    name: "Rent List",
    key: "/rent/list",
    route: `/rent/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <RentList />,
  },
  {
    type: "hidden",
    name: "Edit Rent",
    key: "/rent/edit",
    route: `/rent/edit`,
    icon: <Icon fontSize="small">edit</Icon>,
    component: <Rent isEdit={true} isCreate={false} />,
  },

  {
    type: "divider",
  },

  {
    type: "title",
    name: "Seller Management",
    icon: <Icon fontSize="small">inventory</Icon>,
  },

  {
    type: "collapse-children",
    name: "Add Seller",
    key: "/seller/add",
    route: "/seller/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Seller />,
  },

  {
    type: "collapse-children",
    name: "Seller List",
    key: "/seller/list",
    route: `/seller/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <SellerList />,
  },

  {
    type: "hidden",
    name: "Edit Seller",
    key: "/seller/edit",
    route: `/seller/edit`,
    icon: <Icon fontSize="small">edit</Icon>,
    component: <Seller isEdit={true} isCreate={false} />,
  },
  {
    type: "divider",
  },

  {
    type: "title",
    name: "Vehicle Management",
    icon: <Icon fontSize="small">inventory</Icon>,
  },

  {
    type: "hidden",
    name: "Edit Vehicle",
    key: "/vehicle/edit",
    route: "/vehicle/edit",
    icon: <Icon fontSize="small">edit</Icon>,
    component: <Vehicle isEdit={true} isCreate={false} />,
  },
  {
    type: "collapse-children",
    name: "Add Vehicle",
    key: "/vehicle/add",
    route: "/vehicle/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Vehicle />,
  },
  {
    type: "collapse-children",
    name: "Vehicle List",
    key: "/vehicle/list",
    route: "/vehicle/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <VehicleList />,
  },

  {
    type: "divider",
  },

  {
    type: "title",
    name: "Stock Management",
    icon: <Icon fontSize="small">inventory</Icon>,
  },

  {
    type: "collapse-children",
    name: "Add Stock",
    key: "/stock/add",
    route: "/stock/add",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Stock />,
  },

  {
    type: "collapse-children",
    name: "Stock List",
    key: "/stock/list",
    route: `/stock/list`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <StockList />,
  },
  {
    type: "divider",
  },

  {
    type: "title",
    name: "Labour Management",
    icon: <Icon fontSize="small">people</Icon>,
  },
  {
    type: "collapse-children",
    name: "Create Labour",
    key: "/labour/create",
    route: "/labour/create",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Labour />,
  },
  {
    type: "collapse-children",
    name: "Labour List",
    key: "/labour/list",
    route: "/labour/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <LabourList />,
  },
  {
    type: "hidden",
    name: "Edit Labour",
    key: "edit labour",
    route: `/labour/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Labour isEdit={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "View Labour",
    key: "view labour",
    route: `/labour/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Labour isView={true} isCreate={false} />,
  },
  {
    type: "collapse-children",
    name: "Labour Attendance",
    key: "/labour/attendance",
    route: "/labour/attendance",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <LabourAttendance />,
  },
  {
    type: "collapse-children",
    name: "Labour Payment",
    key: "/labour/payment",
    route: "/labour/payment",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <LabourPayment />,
  },
  {
    type: "hidden",
    name: "Labour Attendance",
    route: `/labour/attendance/view`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <SeeAttendance />,
  },
  {
    type: "hidden",
    name: "Labour Payment",
    route: `/labour/payment/view`,
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <SeePayment />,
  },

  {
    type: "divider",
  },
  {
    type: "title",
    name: "Order Management",
    icon: <Icon fontSize="small">shopping</Icon>,
  },

  {
    type: "collapse-children",
    name: "Create Order",
    key: "/order/create",
    route: "/order/create",
    icon: <Icon fontSize="small">add</Icon>,
    component: <Order />,
  },
  {
    type: "collapse-children",
    name: "Order List",
    key: "/order/list",
    route: "/order/list",
    icon: <Icon fontSize="small">list-alt</Icon>,
    component: <OrderList />,
  },
  {
    type: "hidden",
    name: "Edit Order",
    key: "edit order",
    route: `/order/edit`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Order isEdit={true} isCreate={false} />,
  },
  {
    type: "hidden",
    name: "View Order",
    key: "view order",
    route: `/order/view`,
    icon: <Icon fontSize="small">people</Icon>,
    component: <Order isView={true} isCreate={false} />,
  },
];

export default routes;
