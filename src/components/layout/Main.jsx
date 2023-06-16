import React from 'react'
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Drawer, Affix } from 'antd';
import Sidenav from './Sidenav';
import Header from './Header';

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [sidenavColor, setSidenavColor] = useState('#1890ff');
  const sidenavType = 'transparent';
  const fixed = false;

  const openDrawer = () => setVisible(!visible);
  const handleSidenavColor = (color) => setSidenavColor(color);

  let { pathname } = useLocation();
  pathname = pathname.replace('/', '');
  console.log(pathname);

  useEffect(() => {
    if (pathname === 'rtl') {
      setPlacement('left');
    } else {
      setPlacement('right');
    }
  }, [pathname]);

  if(pathname === 'login') return null;

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === 'profile' ? 'layout-profile' : ''
      } ${pathname === 'rtl' ? 'layout-dashboard-rtl' : ''}`}
    >
      <Drawer
        title={false}
        placement={placement === 'right' ? 'left' : 'right'}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={placement === 'right' ? 'left' : 'right'}
        width={250}
        className={`drawer-sidebar ${
          pathname === 'rtl' ? 'drawer-sidebar-rtl' : ''
        } `}
      >
        <Layout
          className={`layout-dashboard ${
            pathname === 'rtl' ? 'layout-dashboard-rtl' : ''
          }`}
        >
          <Sider
            trigger={null}
            width={250}
            theme='light'
            className={`sider-primary ant-layout-sider-primary ${
              sidenavType === '#fff' ? 'active-route' : ''
            }`}
            style={{ background: sidenavType }}
          >
            <Sidenav color={sidenavColor} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme='light'
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === '#fff' ? 'active-route' : ''
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>
      <Layout>
        {fixed ? (
          <Affix>
            <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}

              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}

            />
          </AntHeader>
        )}
        <main className='ant-layout-content content-ant'>
          <Outlet/>
        </main>
      </Layout>
    </Layout>
  );
}

export default Main;
