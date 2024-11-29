import { CSidebar, CSidebarHeader, CSidebarBrand, CNavTitle, CNavItem, CBadge, CSidebarNav, CSidebarToggler } from "@coreui/react";
import styles from './sidebar.module.css';

const Sidebar = () => {
    return (
    <CSidebar className={`border-end ${styles.sidebar}`} colorScheme="dark">
        <CSidebarHeader className="border-bottom">
            <CSidebarBrand>Search</CSidebarBrand>
        </CSidebarHeader>
        <CSidebarNav>
            <CNavTitle>Sports</CNavTitle>
            <CNavItem href="#">Basketball</CNavItem>
            <CNavItem href="#"> Soccer <CBadge color="primary ms-auto">NEW</CBadge></CNavItem>
            <CNavItem href="#">Volleyball</CNavItem>
            <CNavItem href="#">Badminton</CNavItem>
            <CNavItem href="#">Tennis</CNavItem>
            <CNavItem href="#">Pickleball</CNavItem>
        </CSidebarNav>
        <CSidebarHeader className="border-top">
            <CSidebarToggler/>
        </CSidebarHeader>
    </CSidebar>
    );
};
export default Sidebar;