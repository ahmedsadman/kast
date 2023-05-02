import { Flex, Menu, MenuButton, MenuItem, Button, MenuList, IconButton, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, LinkIcon } from '@chakra-ui/icons';

function ActionsMenu() {
  return (
    <Flex alignSelf="stretch" justifyContent="space-between" alignItems="center" m={1}>
      <div>Hello</div>
      <div>
        <Tooltip label="Copy Invite Link">
          <IconButton
            aria-label="Invite Link"
            mr={2}
            mt={1}
            mb={1}
            variant="outline"
            icon={<LinkIcon />}
            _hover={{ color: 'black', bg: 'white' }}
          />
        </Tooltip>

        <Menu colorScheme="blue">
          <MenuButton as={Button} colorScheme="blue" rightIcon={<ChevronDownIcon />}>
            Actions
          </MenuButton>
          <MenuList textColor="black">
            <MenuItem>Change file</MenuItem>
            <MenuItem>Add/Update subtitle</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Flex>
  );
}

export default ActionsMenu;
