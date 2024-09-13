import { Flex, Menu, MenuButton, MenuItem, Button, MenuList, IconButton, Tooltip, HStack } from '@chakra-ui/react';
import { ChevronDownIcon, LinkIcon } from '@chakra-ui/icons';

function TopBar({ menuItems, fileName, openInviteModal }: TopBarProps) {
  const openGithub = () => {
    window.open('https://github.com/ahmedsadman/kast', '_newtab');
  };

  return (
    <Flex alignSelf="stretch" justifyContent="space-between" alignItems="center" mb={1}>
      <div>{fileName}</div>
      <div>
        <HStack>
          <IconButton
            aria-label="github"
            variant="outline"
            icon={<img width="40" height="40" src="https://img.icons8.com/ios-glyphs/60/github.png" alt="github" />}
            onClick={openGithub}
          />

          <Tooltip label="Copy Invite Link">
            <IconButton
              aria-label="Invite Link"
              mt={1}
              mb={1}
              variant="outline"
              icon={<LinkIcon />}
              _hover={{ color: 'black', bg: 'white' }}
              onClick={openInviteModal}
              className="copyLink"
            />
          </Tooltip>
          {fileName && (
            <Menu colorScheme="blue">
              <MenuButton as={Button} mr={0.5} ml={2} colorScheme="blue" rightIcon={<ChevronDownIcon />}>
                Actions
              </MenuButton>
              <MenuList>
                {menuItems.map((menu) => (
                  <MenuItem textColor="black" key={menu.label} onClick={menu.action}>
                    {menu.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </HStack>
      </div>
    </Flex>
  );
}

type Menu = {
  label: string;
  action: () => void;
};

type TopBarProps = {
  menuItems: Menu[];
  fileName: string | undefined;
  openInviteModal: () => void;
};

export default TopBar;
