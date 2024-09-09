import { Flex, Menu, MenuButton, MenuItem, Button, MenuList, IconButton, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, LinkIcon } from '@chakra-ui/icons';

function TopBar({ menuItems, fileName, openInviteModal }: TopBarProps) {
  return (
    <Flex alignSelf="stretch" justifyContent="space-between" alignItems="center" mb={1}>
      <div>{fileName}</div>
      <div>
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
