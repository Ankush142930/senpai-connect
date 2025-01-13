import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { FaWpforms } from 'react-icons/fa6';
import { LuUser } from 'react-icons/lu';
import Login from './authentication/Login';
import Signup from './authentication/Signup';

const TabSwitch = () => {
  return (
    <Tabs variant="soft-rounded" colorScheme="orange" align="center">
      <TabList>
        <Tab>
          <FaWpforms />
          Login
        </Tab>
        <Tab>
          <LuUser />
          Sign Up
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Login />
        </TabPanel>
        <TabPanel>
          <Signup />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
export default TabSwitch;
